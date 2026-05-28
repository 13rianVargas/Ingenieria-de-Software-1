package co.edu.konrad.pqrs.domain.port;

public interface AlmacenAdjuntos {

    /**
     * Sube el binario y devuelve la URL/URI donde quedo almacenado.
     * @param ruta path logico destino (ej. pqrs/2026/05/PQRS-2026-000004-01.pdf)
     * @param contenido bytes del archivo
     * @param tipoMime content-type (solo application/pdf permitido aguas arriba)
     */
    String subir(String ruta, byte[] contenido, String tipoMime);
}
