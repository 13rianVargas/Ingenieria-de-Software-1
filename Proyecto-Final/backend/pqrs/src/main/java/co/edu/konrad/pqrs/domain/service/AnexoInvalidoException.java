package co.edu.konrad.pqrs.domain.service;

public class AnexoInvalidoException extends RuntimeException {
    public AnexoInvalidoException(String mensaje) {
        super(mensaje);
    }
}
