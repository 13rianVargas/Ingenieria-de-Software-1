package co.edu.konrad.pqrs.api.rest;

import co.edu.konrad.pqrs.domain.model.RolUsuario;
import co.edu.konrad.pqrs.domain.model.Usuario;

public record RegistroUsuarioResponse (

        Integer id,
        String nombres,
        String apellidos,
        String email,
        RolUsuario rol


){


    public static RegistroUsuarioResponse desde(Usuario u) {

        return new RegistroUsuarioResponse(

                u.getId(), u.getNombres(), u.getApellidos(), u.getEmail(), u.getRol()

        );

    }


}
