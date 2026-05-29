package co.edu.konrad.pqrs.domain.service;

import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import co.edu.konrad.pqrs.domain.model.Pqrs;
import co.edu.konrad.pqrs.domain.model.TipoPqrs;
import co.edu.konrad.pqrs.domain.port.NotificadorPort;
import co.edu.konrad.pqrs.domain.port.PqrsRepositorio;
import co.edu.konrad.pqrs.domain.port.TramiteRepositorio;
import co.edu.konrad.pqrs.domain.service.ServicioTramitar.PqrsNoEncontradaException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class ServicioTramitarTest {

    private PqrsRepositorio pqrsRepo;
    private TramiteRepositorio tramiteRepo;
    private NotificadorPort notificador;
    private ServicioTramitar servicio;

    @BeforeEach
    void setup() {
        pqrsRepo = Mockito.mock(PqrsRepositorio.class);
        tramiteRepo = Mockito.mock(TramiteRepositorio.class);
        notificador = Mockito.mock(NotificadorPort.class);
        servicio = new ServicioTramitar(pqrsRepo, tramiteRepo, notificador);
        when(pqrsRepo.guardar(any())).thenAnswer(inv -> inv.getArgument(0));
    }

    private Pqrs pqrsNueva() {
        Pqrs p = new Pqrs(TipoPqrs.queja, "Asunto", "descripcion larga suficiente aqui", 3);
        p.setId(10);
        return p;
    }

    @Test
    void tramitaCambiaEstadoYRegistraTramite() {
        when(pqrsRepo.buscarPorId(10)).thenReturn(Optional.of(pqrsNueva()));

        Pqrs r = servicio.tramitar(10, 2, EstadoPqrs.en_proceso, "justificacion valida diez");

        assertEquals(EstadoPqrs.en_proceso, r.getEstado());
        assertEquals(2, r.getGestorId());
        assertNull(r.getFechaCierre());
        verify(tramiteRepo).guardar(any());
        verify(notificador).encolar(eq(3), eq(10), eq("cambio_estado"), anyString());
    }

    @Test
    void estadoCierreSeteaFechaCierre() {
        when(pqrsRepo.buscarPorId(10)).thenReturn(Optional.of(pqrsNueva()));

        Pqrs r = servicio.tramitar(10, 2, EstadoPqrs.resuelto, "caso resuelto correctamente");

        assertEquals(EstadoPqrs.resuelto, r.getEstado());
        assertNotNull(r.getFechaCierre());
    }

    @Test
    void rechazaJustificacionCorta() {
        assertThrows(IllegalArgumentException.class,
                () -> servicio.tramitar(10, 2, EstadoPqrs.resuelto, "corta"));
        verifyNoInteractions(tramiteRepo);
    }

    @Test
    void lanzaSiPqrsNoExiste() {
        when(pqrsRepo.buscarPorId(999)).thenReturn(Optional.empty());

        assertThrows(PqrsNoEncontradaException.class,
                () -> servicio.tramitar(999, 2, EstadoPqrs.en_proceso, "justificacion valida"));
    }
}
