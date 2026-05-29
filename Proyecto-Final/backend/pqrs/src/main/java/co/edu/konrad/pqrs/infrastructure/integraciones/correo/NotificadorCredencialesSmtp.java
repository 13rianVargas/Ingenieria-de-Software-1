package co.edu.konrad.pqrs.infrastructure.integraciones.correo;

import co.edu.konrad.pqrs.domain.port.NotificadorCredenciales;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Envia las credenciales de acceso por SMTP de forma sincrona y best-effort:
 * si el correo falla o esta deshabilitado, el radicado sigue siendo valido.
 */
@Component
public class NotificadorCredencialesSmtp implements NotificadorCredenciales {

    private static final Logger log = LoggerFactory.getLogger(NotificadorCredencialesSmtp.class);

    private final CorreoSmtp correo;

    public NotificadorCredencialesSmtp(CorreoSmtp correo) {
        this.correo = correo;
    }

    @Override
    public void enviarCredenciales(String email, String nombres, String clavePlana, String radicado) {
        if (!correo.habilitado()) {
            log.warn("SMTP deshabilitado — no se envian credenciales a {} (radicado {})", email, radicado);
            return;
        }
        try {
            String html = "<p>Hola " + nombres + ",</p>"
                    + "<p>Tu PQRS fue radicada con el numero <strong>" + radicado + "</strong>.</p>"
                    + "<p>Creamos una cuenta para que consultes su estado:</p>"
                    + "<ul><li><strong>Usuario:</strong> " + email + "</li>"
                    + "<li><strong>Clave temporal:</strong> " + clavePlana + "</li></ul>"
                    + "<p>Ingresa al portal y cambiala apenas puedas.</p>"
                    + "<p>SuperMarket Konrad</p>";
            correo.enviar(email, "Tu PQRS fue radicada — acceso al portal", html);
        } catch (RuntimeException e) {
            log.error("Fallo al enviar credenciales a {} (radicado {}): {}", email, radicado, e.getMessage());
        }
    }
}
