package co.edu.konrad.pqrs.api.rest;

import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import co.edu.konrad.pqrs.domain.model.Pqrs;
import co.edu.konrad.pqrs.domain.model.TipoPqrs;

import java.time.LocalDateTime;

public record PqrsResumenResponse(
        Integer id,
        String radicado,
        TipoPqrs tipo,
        String asunto,
        EstadoPqrs estado,
        LocalDateTime fechaRadicado,
        LocalDateTime fechaCierre
) {
    public static PqrsResumenResponse desde(Pqrs p) {
        return new PqrsResumenResponse(
                p.getId(), p.getRadicado(), p.getTipo(), p.getAsunto(),
                p.getEstado(), p.getFechaRadicado(), p.getFechaCierre());
    }
}
