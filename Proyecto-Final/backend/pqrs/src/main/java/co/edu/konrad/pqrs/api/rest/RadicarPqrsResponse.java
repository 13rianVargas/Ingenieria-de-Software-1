package co.edu.konrad.pqrs.api.rest;

import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import co.edu.konrad.pqrs.domain.model.Pqrs;

import java.time.LocalDateTime;

public record RadicarPqrsResponse(
        String radicado,
        LocalDateTime fechaRadicado,
        EstadoPqrs estado
) {
    public static RadicarPqrsResponse desde(Pqrs p) {
        return new RadicarPqrsResponse(p.getRadicado(), p.getFechaRadicado(), p.getEstado());
    }
}
