package co.edu.konrad.pqrs.domain.service;

import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import co.edu.konrad.pqrs.domain.model.Pqrs;
import co.edu.konrad.pqrs.domain.model.Tramite;
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

    public ServicioTramitar(PqrsRepositorio pqrsRepositorio, TramiteRepositorio tramiteRepositorio) {
        this.pqrsRepositorio = pqrsRepositorio;
        this.tramiteRepositorio = tramiteRepositorio;
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
        return pqrsRepositorio.guardar(pqrs);
    }
}
