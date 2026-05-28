package co.edu.konrad.pqrs.domain.port;

public interface GeneradorRadicado {

    /** Devuelve el siguiente radicado unico, formato PQRS-YYYY-NNNNNN. */
    String siguiente();
}
