package co.edu.konrad.pqrs.domain.service;

import co.edu.konrad.pqrs.domain.model.Adjunto;
import co.edu.konrad.pqrs.domain.model.Pqrs;
import co.edu.konrad.pqrs.domain.model.TipoPqrs;
import co.edu.konrad.pqrs.domain.port.AdjuntoRepositorio;
import co.edu.konrad.pqrs.domain.port.AlmacenAdjuntos;
import co.edu.konrad.pqrs.domain.port.GeneradorRadicado;
import co.edu.konrad.pqrs.domain.port.NotificadorPort;
import co.edu.konrad.pqrs.domain.port.PqrsRepositorio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class ServicioRadicarPqrs {

    private static final Logger log = LoggerFactory.getLogger(ServicioRadicarPqrs.class);
    private static final long MAX_BYTES = 5L * 1024 * 1024; // 5 MB
    private static final String MIME_PDF = "application/pdf";

    private final PqrsRepositorio pqrsRepositorio;
    private final AdjuntoRepositorio adjuntoRepositorio;
    private final AlmacenAdjuntos almacenAdjuntos;
    private final NotificadorPort notificador;
    private final GeneradorRadicado generadorRadicado;

    public ServicioRadicarPqrs(PqrsRepositorio pqrsRepositorio,
                               AdjuntoRepositorio adjuntoRepositorio,
                               AlmacenAdjuntos almacenAdjuntos,
                               NotificadorPort notificador,
                               GeneradorRadicado generadorRadicado) {
        this.pqrsRepositorio = pqrsRepositorio;
        this.adjuntoRepositorio = adjuntoRepositorio;
        this.almacenAdjuntos = almacenAdjuntos;
        this.notificador = notificador;
        this.generadorRadicado = generadorRadicado;
    }

    /** Datos del anexo PDF (opcional). */
    public record Anexo(String nombreArchivo, String tipoMime, byte[] contenido) {
    }

    @Transactional
    public Pqrs radicar(TipoPqrs tipo, String asunto, String descripcion, Integer clienteId, Anexo anexo) {
        validar(asunto, descripcion);
        if (anexo != null) {
            validarAnexo(anexo);
        }

        String radicado = generadorRadicado.siguiente();

        Pqrs pqrs = new Pqrs(tipo, asunto, descripcion, clienteId);
        pqrs.setRadicado(radicado);
        Pqrs guardada = pqrsRepositorio.guardar(pqrs);

        if (anexo != null) {
            subirAnexoBestEffort(guardada, radicado, anexo);
        }

        notificador.encolar(clienteId, guardada.getId(), "radicado_creado", "pqrs-radicada");

        return guardada;
    }

    private void validar(String asunto, String descripcion) {
        if (asunto == null || asunto.length() < 5 || asunto.length() > 200) {
            throw new IllegalArgumentException("El asunto debe tener entre 5 y 200 caracteres");
        }
        if (descripcion == null || descripcion.trim().length() < 20) {
            throw new IllegalArgumentException("La descripcion debe tener al menos 20 caracteres");
        }
    }

    private void validarAnexo(Anexo anexo) {
        if (!MIME_PDF.equals(anexo.tipoMime())) {
            throw new AnexoInvalidoException("El anexo debe ser application/pdf");
        }
        if (anexo.contenido() == null || anexo.contenido().length == 0) {
            throw new AnexoInvalidoException("El anexo esta vacio");
        }
        if (anexo.contenido().length > MAX_BYTES) {
            throw new AnexoInvalidoException("El anexo supera el maximo de 5 MB");
        }
    }

    /**
     * Sube el PDF a R2 y persiste metadata. Best-effort: si falla el almacenamiento,
     * NO rompe el radicado (Plan B demo: PDF cae async, radicado sigue valido).
     */
    private void subirAnexoBestEffort(Pqrs pqrs, String radicado, Anexo anexo) {
        try {
            LocalDate hoy = LocalDate.now();
            String ruta = String.format("pqrs/%d/%02d/%s-01.pdf", hoy.getYear(), hoy.getMonthValue(), radicado);
            String url = almacenAdjuntos.subir(ruta, anexo.contenido(), anexo.tipoMime());
            Adjunto adjunto = new Adjunto(pqrs.getId(), anexo.nombreArchivo(), url, anexo.tipoMime(), anexo.contenido().length);
            adjuntoRepositorio.guardar(adjunto);
        } catch (RuntimeException e) {
            log.error("Fallo al subir/persistir anexo del radicado {} (radicado sigue valido): {}",
                    radicado, e.getMessage());
        }
    }
}
