package co.edu.konrad.pqrs.api.rest;

import co.edu.konrad.pqrs.domain.model.Credenciales;
import co.edu.konrad.pqrs.domain.model.TokenSesion;
import co.edu.konrad.pqrs.domain.service.ServicioAutenticacion;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final ServicioAutenticacion servicioAutenticacion;

    public AuthController(ServicioAutenticacion servicioAutenticacion) {
        this.servicioAutenticacion = servicioAutenticacion;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        TokenSesion token = servicioAutenticacion.autenticar(
                new Credenciales(request.email(), request.clave()));
        return ResponseEntity.ok(new LoginResponse(token.token(), token.rol(), token.expiraEn()));
    }
}
