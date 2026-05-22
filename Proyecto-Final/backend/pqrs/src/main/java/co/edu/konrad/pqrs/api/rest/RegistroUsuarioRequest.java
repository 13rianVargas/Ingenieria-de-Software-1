package co.edu.konrad.pqrs.api.rest;

import co.edu.konrad.pqrs.domain.model.TipoDocumento;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegistroUsuarioRequest (

        @NotNull TipoDocumento tipoDoc,
        @NotBlank String numDoc,
        @NotBlank String nombres,
        @NotBlank String apellidos,
        @Email @NotBlank String email,
        String telefono,
        @NotBlank String clave



        ) {



}
