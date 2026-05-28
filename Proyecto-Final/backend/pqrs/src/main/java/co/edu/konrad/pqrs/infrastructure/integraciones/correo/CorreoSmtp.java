package co.edu.konrad.pqrs.infrastructure.integraciones.correo;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

/**
 * Envia correos via SMTP (Gmail). Si MAIL_USERNAME esta ausente, queda deshabilitado
 * y el worker no procesa la cola. Sustituye a Resend (no requiere dominio verificado:
 * Gmail SMTP entrega a cualquier destinatario).
 */
@Component
public class CorreoSmtp {

    private static final Logger log = LoggerFactory.getLogger(CorreoSmtp.class);

    private final JavaMailSender mailSender;
    private final String username;
    private final String from;
    private final String fromNombre;

    public CorreoSmtp(JavaMailSender mailSender,
                      @Value("${spring.mail.username:}") String username,
                      @Value("${correo.from:}") String from,
                      @Value("${correo.from-nombre:PQRS}") String fromNombre) {
        this.mailSender = mailSender;
        this.username = username;
        this.from = (from == null || from.isBlank()) ? username : from;
        this.fromNombre = fromNombre;
    }

    public boolean habilitado() {
        return username != null && !username.isBlank();
    }

    /** Envia HTML. Lanza excepcion si falla (el scheduler cuenta el intento). */
    public void enviar(String destinatario, String asunto, String htmlBody) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, StandardCharsets.UTF_8.name());
            helper.setFrom(new InternetAddress(from, fromNombre, StandardCharsets.UTF_8.name()));
            helper.setTo(destinatario);
            helper.setSubject(asunto);
            helper.setText(htmlBody, true);
            mailSender.send(msg);
            log.info("Correo SMTP enviado a {} ({})", destinatario, asunto);
        } catch (UnsupportedEncodingException | jakarta.mail.MessagingException e) {
            throw new RuntimeException("Fallo envio SMTP: " + e.getMessage(), e);
        }
    }
}
