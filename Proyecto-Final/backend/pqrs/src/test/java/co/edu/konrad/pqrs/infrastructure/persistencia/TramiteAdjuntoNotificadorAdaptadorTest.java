package co.edu.konrad.pqrs.infrastructure.persistencia;

import co.edu.konrad.pqrs.domain.model.Adjunto;
import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import co.edu.konrad.pqrs.domain.model.Tramite;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TramiteAdjuntoNotificadorAdaptadorTest {

    @Test
    void tramiteAdaptadorMapea() {
        TramiteJpaRepositorio jpa = Mockito.mock(TramiteJpaRepositorio.class);
        TramiteRepositorioAdaptador ad = new TramiteRepositorioAdaptador(jpa);

        TramiteEntidad e = new TramiteEntidad();
        e.setId(1);
        e.setPqrsId(10);
        e.setGestorId(2);
        e.setEstadoAnterior(EstadoPqrs.nuevo);
        e.setEstadoNuevo(EstadoPqrs.en_proceso);
        e.setJustificacion("justificacion valida");
        e.setTimestamp(LocalDateTime.now());
        when(jpa.save(any())).thenReturn(e);
        when(jpa.findByPqrsIdOrderByTimestampDesc(10)).thenReturn(List.of(e));

        Tramite t = ad.guardar(new Tramite(10, 2, EstadoPqrs.nuevo, EstadoPqrs.en_proceso, "justificacion valida"));
        assertEquals(1, t.getId());
        assertEquals(EstadoPqrs.en_proceso, t.getEstadoNuevo());
        assertEquals(1, ad.buscarPorPqrs(10).size());
    }

    @Test
    void adjuntoAdaptadorMapea() {
        AdjuntoJpaRepositorio jpa = Mockito.mock(AdjuntoJpaRepositorio.class);
        AdjuntoRepositorioAdaptador ad = new AdjuntoRepositorioAdaptador(jpa);

        AdjuntoEntidad e = new AdjuntoEntidad();
        e.setId(1);
        e.setPqrsId(10);
        e.setNombreArchivo("f.pdf");
        e.setUrlNas("https://r2/f.pdf");
        e.setTipoMime("application/pdf");
        e.setTamanoBytes(123L);
        e.setFechaSubida(LocalDateTime.now());
        when(jpa.save(any())).thenReturn(e);
        when(jpa.findByPqrsId(10)).thenReturn(List.of(e));

        Adjunto a = ad.guardar(new Adjunto(10, "f.pdf", "https://r2/f.pdf", "application/pdf", 123L));
        assertEquals(1, a.getId());
        assertEquals("https://r2/f.pdf", a.getUrlNas());
        assertEquals(1, ad.buscarPorPqrs(10).size());
    }

    @Test
    void notificadorAdaptadorEncolaPendiente() {
        NotificacionJpaRepositorio jpa = Mockito.mock(NotificacionJpaRepositorio.class);
        NotificadorAdaptador ad = new NotificadorAdaptador(jpa);

        ad.encolar(3, 10, "radicado_creado", "pqrs-radicada");

        ArgumentCaptor<NotificacionEntidad> cap = ArgumentCaptor.forClass(NotificacionEntidad.class);
        verify(jpa).save(cap.capture());
        assertEquals("pendiente", cap.getValue().getEstado());
        assertEquals(0, cap.getValue().getIntentos());
        assertEquals("radicado_creado", cap.getValue().getTipo());
    }
}
