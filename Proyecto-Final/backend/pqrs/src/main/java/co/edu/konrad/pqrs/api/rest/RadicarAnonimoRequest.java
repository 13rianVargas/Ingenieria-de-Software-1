package co.edu.konrad.pqrs.api.rest;

import co.edu.konrad.pqrs.domain.model.TipoDocumento;
import co.edu.konrad.pqrs.domain.model.TipoPqrs;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RadicarAnonimoRequest(
        @NotNull TipoDocumento tipoDoc,
        @NotBlank String numDoc,
        @NotBlank String nombres,
        @NotBlank String apellidos,
        @Email @NotBlank String email,
        String telefono,
        @NotNull TipoPqrs tipo,
        @NotNull @Size(min = 5, max = 200) String asunto,
        @NotNull @Size(min = 20) String descripcion
) {
}
