package co.edu.konrad.pqrs.domain.port;

public interface NotificadorPort {

    /** Encola una notificacion (fila estado=pendiente) para envio async. */
    void encolar(Integer usuarioId, Integer pqrsId, String tipo, String plantilla);
}
