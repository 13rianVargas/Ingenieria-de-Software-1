package co.edu.konrad.pqrs.infrastructure.integraciones.resend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Cliente HTTP de Resend (POST https://api.resend.com/emails).
 * Si RESEND_API_KEY esta ausente, queda deshabilitado (habilitado()=false)
 * y el scheduler no procesa la cola.
 */
@Component
public class ResendCliente {

    private static final Logger log = LoggerFactory.getLogger(ResendCliente.class);

    private final RestClient http = RestClient.create("https://api.resend.com");
    private final String apiKey;
    private final String remitente;

    public ResendCliente(@Value("${resend.api-key:}") String apiKey,
                         @Value("${resend.from:PQRS Konrad <onboarding@resend.dev>}") String remitente) {
        this.apiKey = apiKey;
        this.remitente = remitente;
    }

    public boolean habilitado() {
        return apiKey != null && !apiKey.isBlank();
    }

    /** Envia el correo. Lanza excepcion si falla (para que el scheduler cuente el intento). */
    public void enviar(String destinatario, String asunto, String htmlBody) {
        http.post()
                .uri("/emails")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "from", remitente,
                        "to", destinatario,
                        "subject", asunto,
                        "html", htmlBody))
                .retrieve()
                .toBodilessEntity();
        log.info("Correo Resend enviado a {} ({})", destinatario, asunto);
    }
}
