package co.edu.konrad.pqrs.api.rest;

import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TramitarEstadoRequest(
        @NotNull EstadoPqrs estado,
        @NotNull @Size(min = 10) String justificacion
) {
}
