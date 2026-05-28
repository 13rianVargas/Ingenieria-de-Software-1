package co.edu.konrad.pqrs.api.rest;

import co.edu.konrad.pqrs.domain.model.TipoPqrs;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RadicarPqrsRequest(
        @NotNull TipoPqrs tipo,
        @NotNull @Size(min = 5, max = 200) String asunto,
        @NotNull @Size(min = 20) String descripcion
) {
}
