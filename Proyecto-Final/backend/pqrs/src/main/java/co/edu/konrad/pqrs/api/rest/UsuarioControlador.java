package co.edu.konrad.pqrs.api.rest;

import co.edu.konrad.pqrs.domain.model.Usuario;
import co.edu.konrad.pqrs.domain.service.ServicioRegistroUsuario;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public class UsuarioControlador {

    private final ServicioRegistroUsuario servicioRegistro;

    public UsuarioControlador(ServicioRegistroUsuario servicioRegistro) {

        this.servicioRegistro = servicioRegistro;
    }

    @PostMapping("/registro")
    public ResponseEntity<RegistroUsuarioResponse> registrar(


            @Valid @RequestBody RegistroUsuarioRequest request) {

        Usuario usuario = new Usuario(

                request.tipoDoc(), request.numDoc(), request.nombres(),

                request.apellidos(), request.email(), request.telefono(), request.clave()
        );

        Usuario registrado = servicioRegistro.registrar(usuario);

        return ResponseEntity.ok(RegistroUsuarioResponse.desde(registrado));
    }
}
