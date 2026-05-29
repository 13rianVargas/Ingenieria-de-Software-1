package co.edu.konrad.pqrs.domain.service;

import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import co.edu.konrad.pqrs.domain.model.Pqrs;
import co.edu.konrad.pqrs.domain.model.Tramite;
import co.edu.konrad.pqrs.domain.port.NotificadorPort;
import co.edu.konrad.pqrs.domain.port.PqrsRepositorio;
import co.edu.konrad.pqrs.domain.port.TramiteRepositorio;
import co.edu.konrad.pqrs.infrastructure.auditoria.Auditable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ServicioTramitar {

    private final PqrsRepositorio pqrsRepositorio;
    private final TramiteRepositorio tramiteRepositorio;
    private final NotificadorPort notificador;

    public ServicioTramitar(PqrsRepositorio pqrsRepositorio,
                            TramiteRepositorio tramiteRepositorio,
                            NotificadorPort notificador) {
        this.pqrsRepositorio = pqrsRepositorio;
        this.tramiteRepositorio = tramiteRepositorio;
        this.notificador = notificador;
    }

    public static class PqrsNoEncontradaException extends RuntimeException {
        public PqrsNoEncontradaException(String m) { super(m); }
    }

    @Transactional
    @Auditable(accion = "tramitar", entidad = "pqrs")
    public Pqrs tramitar(Integer pqrsId, Integer gestorId, EstadoPqrs nuevoEstado, String justificacion) {
        if (justificacion == null || justificacion.trim().length() < 10) {
            throw new IllegalArgumentException("La justificacion debe tener al menos 10 caracteres");
        }

        Pqrs pqrs = pqrsRepositorio.buscarPorId(pqrsId)
                .orElseThrow(() -> new PqrsNoEncontradaException("PQRS no encontrada: " + pqrsId));

        EstadoPqrs anterior = pqrs.getEstado();

        Tramite tramite = new Tramite(pqrsId, gestorId, anterior, nuevoEstado, justificacion.trim());
        tramiteRepositorio.guardar(tramite);

        pqrs.setEstado(nuevoEstado);
        pqrs.setGestorId(gestorId);
        if (nuevoEstado.esCierre()) {
            pqrs.setFechaCierre(LocalDateTime.now());
        }
        Pqrs guardada = pqrsRepositorio.guardar(pqrs);

        // Notifica al cliente el cambio de estado (worker async lo envia por correo).
        notificador.encolar(guardada.getClienteId(), guardada.getId(), "cambio_estado", "pqrs-cambio-estado");

        return guardada;
    }
}
