package co.edu.konrad.pqrs.api.rest;

import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import co.edu.konrad.pqrs.domain.model.Pqrs;
import co.edu.konrad.pqrs.domain.model.TipoPqrs;
import co.edu.konrad.pqrs.domain.model.Usuario;
import co.edu.konrad.pqrs.domain.port.PqrsRepositorio;
import co.edu.konrad.pqrs.domain.port.UsuarioRepositorio;
import co.edu.konrad.pqrs.domain.service.ServicioRadicarPqrs;
import co.edu.konrad.pqrs.domain.service.ServicioTramitar;
import co.edu.konrad.pqrs.infrastructure.reporte.GeneradorReportePdf;
import jakarta.validation.Valid;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.List;

@RestController
@RequestMapping("/api/pqrs")
public class PqrsController {

    private final ServicioRadicarPqrs servicioRadicar;
    private final ServicioTramitar servicioTramitar;
    private final UsuarioRepositorio usuarioRepositorio;
    private final PqrsRepositorio pqrsRepositorio;
    private final GeneradorReportePdf generadorReportePdf;

    public PqrsController(ServicioRadicarPqrs servicioRadicar,
                          ServicioTramitar servicioTramitar,
                          UsuarioRepositorio usuarioRepositorio,
                          PqrsRepositorio pqrsRepositorio,
                          GeneradorReportePdf generadorReportePdf) {
        this.servicioRadicar = servicioRadicar;
        this.servicioTramitar = servicioTramitar;
        this.usuarioRepositorio = usuarioRepositorio;
        this.pqrsRepositorio = pqrsRepositorio;
        this.generadorReportePdf = generadorReportePdf;
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

    /** CU-04: PQRS propias del cliente autenticado. Filtro opcional por radicado. */
    @GetMapping("/mis")
    @PreAuthorize("hasRole('cliente')")
    public ResponseEntity<List<PqrsResumenResponse>> misPqrs(
            @RequestParam(value = "radicado", required = false) String radicado,
            Authentication auth) {
        Integer clienteId = resolverClienteId(auth);
        List<PqrsResumenResponse> resultado = pqrsRepositorio.buscarPorCliente(clienteId, radicado)
                .stream().map(PqrsResumenResponse::desde).toList();
        return ResponseEntity.ok(resultado);
    }

    /** CU-05: bandeja del gestor. Filtros opcionales estado/tipo + paginacion. */
    @GetMapping
    @PreAuthorize("hasAnyRole('gestor','admin')")
    public ResponseEntity<PaginaResponse<PqrsResumenResponse>> bandeja(
            @RequestParam(value = "estado", required = false) EstadoPqrs estado,
            @RequestParam(value = "tipo", required = false) TipoPqrs tipo,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        List<PqrsResumenResponse> contenido = pqrsRepositorio.buscarBandeja(estado, tipo, page, size)
                .stream().map(PqrsResumenResponse::desde).toList();
        long total = pqrsRepositorio.contarBandeja(estado, tipo);
        return ResponseEntity.ok(new PaginaResponse<>(contenido, total, page, size));
    }

    /** CU-07: reporte PDF de la bandeja con filtros opcionales estado/tipo. */
    @GetMapping("/reporte")
    @PreAuthorize("hasAnyRole('gestor','admin')")
    public ResponseEntity<byte[]> reporte(
            @RequestParam(value = "estado", required = false) EstadoPqrs estado,
            @RequestParam(value = "tipo", required = false) TipoPqrs tipo) {
        List<Pqrs> datos = pqrsRepositorio.buscarBandeja(estado, tipo, 0, 10000);
        byte[] pdf = generadorReportePdf.generar(datos);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("reporte-pqrs.pdf").build().toString())
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    /** CU-06: gestor cambia el estado de una PQRS con justificacion. Registra tramite + auditoria. */
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('gestor','admin')")
    public ResponseEntity<PqrsResumenResponse> tramitar(
            @PathVariable("id") Integer id,
            @Valid @RequestBody TramitarEstadoRequest request,
            Authentication auth) {
        Integer gestorId = resolverClienteId(auth); // resuelve el usuario autenticado (gestor)
        Pqrs actualizada = servicioTramitar.tramitar(id, gestorId, request.estado(), request.justificacion());
        return ResponseEntity.ok(PqrsResumenResponse.desde(actualizada));
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
