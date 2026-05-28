package co.edu.konrad.pqrs.api.rest;

import co.edu.konrad.pqrs.domain.model.Pqrs;
import co.edu.konrad.pqrs.domain.model.Usuario;
import co.edu.konrad.pqrs.domain.port.UsuarioRepositorio;
import co.edu.konrad.pqrs.domain.service.ServicioRadicarPqrs;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;

@RestController
@RequestMapping("/api/pqrs")
public class PqrsController {

    private final ServicioRadicarPqrs servicioRadicar;
    private final UsuarioRepositorio usuarioRepositorio;

    public PqrsController(ServicioRadicarPqrs servicioRadicar, UsuarioRepositorio usuarioRepositorio) {
        this.servicioRadicar = servicioRadicar;
        this.usuarioRepositorio = usuarioRepositorio;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RadicarPqrsResponse> radicar(
            @Valid @RequestPart("pqrs") RadicarPqrsRequest request,
            @RequestPart(value = "anexo", required = false) MultipartFile anexo,
            Authentication auth) {

        Integer clienteId = resolverClienteId(auth);

        ServicioRadicarPqrs.Anexo anexoDominio = aAnexo(anexo);
        Pqrs radicada = servicioRadicar.radicar(
                request.tipo(), request.asunto(), request.descripcion(), clienteId, anexoDominio);

        return ResponseEntity.status(HttpStatus.CREATED).body(RadicarPqrsResponse.desde(radicada));
    }

    private Integer resolverClienteId(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new IllegalArgumentException("Autenticacion requerida para radicar");
        }
        Usuario usuario = usuarioRepositorio.buscarPorCorreo(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuario autenticado no existe"));
        return usuario.getId();
    }

    private ServicioRadicarPqrs.Anexo aAnexo(MultipartFile anexo) {
        if (anexo == null || anexo.isEmpty()) {
            return null;
        }
        try {
            return new ServicioRadicarPqrs.Anexo(
                    anexo.getOriginalFilename(), anexo.getContentType(), anexo.getBytes());
        } catch (IOException e) {
            throw new UncheckedIOException("No se pudo leer el anexo", e);
        }
    }
}
