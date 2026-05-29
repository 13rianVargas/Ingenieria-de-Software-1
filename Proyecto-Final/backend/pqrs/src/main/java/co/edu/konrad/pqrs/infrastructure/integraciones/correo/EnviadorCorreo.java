package co.edu.konrad.pqrs.infrastructure.integraciones.correo;

/**
 * Abstraccion de envio de correo. Implementaciones: SMTP (local) y Brevo HTTP
 * (produccion en Render, que bloquea el SMTP saliente). Se selecciona con
 * la propiedad correo.provider (smtp por defecto, brevo en prod).
 */
public interface EnviadorCorreo {

    boolean habilitado();

    void enviar(String destinatario, String asunto, String htmlBody);
}
