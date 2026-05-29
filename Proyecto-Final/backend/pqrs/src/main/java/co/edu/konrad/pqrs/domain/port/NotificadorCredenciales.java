package co.edu.konrad.pqrs.domain.port;

public interface NotificadorCredenciales {

    /**
     * Envia (best-effort) las credenciales de acceso a un cliente recien creado
     * por radicacion anonima. Sincrono porque la clave plana solo existe en este
     * momento (no se persiste).
     */
    void enviarCredenciales(String email, String nombres, String clavePlana, String radicado);
}
