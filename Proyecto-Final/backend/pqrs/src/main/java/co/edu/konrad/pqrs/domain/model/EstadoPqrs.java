package co.edu.konrad.pqrs.domain.model;

public enum EstadoPqrs {
    nuevo, en_proceso, resuelto, rechazado;

    public boolean esCierre() {
        return this == resuelto || this == rechazado;
    }
}
