package co.edu.konrad.pqrs.infrastructure.integraciones.correo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Envia correos via la API HTTP de Brevo (POST https://api.brevo.com/v3/smtp/email).
 * Usa el puerto 443, no bloqueado por Render free (a diferencia del SMTP saliente).
 * Activo solo con correo.provider=brevo.
 */
@Component
@ConditionalOnProperty(name = "correo.provider", havingValue = "brevo")
public class CorreoBrevo implements EnviadorCorreo {

    private static final Logger log = LoggerFactory.getLogger(CorreoBrevo.class);

    private final RestClient http = RestClient.builder()
            .baseUrl("https://api.brevo.com/v3")
            .build();
    private final String apiKey;
    private final String fromEmail;
    private final String fromNombre;

    public CorreoBrevo(@Value("${brevo.api-key:}") String apiKey,
                       @Value("${brevo.from-email:}") String fromEmail,
                       @Value("${brevo.from-nombre:PQRS SuperMarket Konrad}") String fromNombre) {
        this.apiKey = apiKey;
        this.fromEmail = fromEmail;
        this.fromNombre = fromNombre;
    }

    @Override
    public boolean habilitado() {
        return apiKey != null && !apiKey.isBlank() && fromEmail != null && !fromEmail.isBlank();
    }

    @Override
    public void enviar(String destinatario, String asunto, String htmlBody) {
        http.post()
                .uri("/smtp/email")
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "sender", Map.of("email", fromEmail, "name", fromNombre),
                        "to", List.of(Map.of("email", destinatario)),
                        "subject", asunto,
                        "htmlContent", htmlBody))
                .retrieve()
                .toBodilessEntity();
        log.info("Correo Brevo enviado a {} ({})", destinatario, asunto);
    }
}
