package co.edu.konrad.pqrs.domain.service;

import co.edu.konrad.pqrs.domain.model.Pqrs;
import co.edu.konrad.pqrs.domain.model.TipoPqrs;
import co.edu.konrad.pqrs.domain.port.AdjuntoRepositorio;
import co.edu.konrad.pqrs.domain.port.AlmacenAdjuntos;
import co.edu.konrad.pqrs.domain.port.GeneradorRadicado;
import co.edu.konrad.pqrs.domain.port.NotificadorPort;
import co.edu.konrad.pqrs.domain.port.PqrsRepositorio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class ServicioRadicarPqrsTest {

    private PqrsRepositorio pqrsRepo;
    private AdjuntoRepositorio adjuntoRepo;
    private AlmacenAdjuntos almacen;
    private NotificadorPort notificador;
    private GeneradorRadicado generador;
    private ServicioRadicarPqrs servicio;

    @BeforeEach
    void setup() {
        pqrsRepo = Mockito.mock(PqrsRepositorio.class);
        adjuntoRepo = Mockito.mock(AdjuntoRepositorio.class);
        almacen = Mockito.mock(AlmacenAdjuntos.class);
        notificador = Mockito.mock(NotificadorPort.class);
        generador = Mockito.mock(GeneradorRadicado.class);
        servicio = new ServicioRadicarPqrs(pqrsRepo, adjuntoRepo, almacen, notificador, generador);

        when(generador.siguiente()).thenReturn("PQRS-2026-000010");
        when(pqrsRepo.guardar(any())).thenAnswer(inv -> {
            Pqrs p = inv.getArgument(0);
            p.setId(99);
            return p;
        });
    }

    private static final String DESC_OK = "descripcion suficientemente larga para pasar validacion";

    @Test
    void radicaSinAnexo() {
        Pqrs r = servicio.radicar(TipoPqrs.peticion, "Asunto valido", DESC_OK, 3, null);

        assertEquals("PQRS-2026-000010", r.getRadicado());
        verify(notificador).encolar(eq(3), eq(99), eq("radicado_creado"), anyString());
        verifyNoInteractions(almacen);
    }

    @Test
    void radicaConAnexoPdfSubeYPersisteMetadata() {
        when(almacen.subir(anyString(), any(), eq("application/pdf"))).thenReturn("https://r2/x.pdf");
        ServicioRadicarPqrs.Anexo anexo =
                new ServicioRadicarPqrs.Anexo("f.pdf", "application/pdf", new byte[]{1, 2, 3});

        servicio.radicar(TipoPqrs.queja, "Asunto valido", DESC_OK, 3, anexo);

        verify(almacen).subir(anyString(), any(), eq("application/pdf"));
        verify(adjuntoRepo).guardar(any());
    }

    @Test
    void rechazaAnexoNoPdf() {
        ServicioRadicarPqrs.Anexo anexo =
                new ServicioRadicarPqrs.Anexo("f.png", "image/png", new byte[]{1});
        assertThrows(AnexoInvalidoException.class,
                () -> servicio.radicar(TipoPqrs.queja, "Asunto valido", DESC_OK, 3, anexo));
    }

    @Test
    void rechazaAnexoMayorA5mb() {
        byte[] grande = new byte[5 * 1024 * 1024 + 1];
        ServicioRadicarPqrs.Anexo anexo =
                new ServicioRadicarPqrs.Anexo("big.pdf", "application/pdf", grande);
        assertThrows(AnexoInvalidoException.class,
                () -> servicio.radicar(TipoPqrs.queja, "Asunto valido", DESC_OK, 3, anexo));
    }

    @Test
    void rechazaAsuntoCorto() {
        assertThrows(IllegalArgumentException.class,
                () -> servicio.radicar(TipoPqrs.peticion, "ab", DESC_OK, 3, null));
    }

    @Test
    void rechazaDescripcionCorta() {
        assertThrows(IllegalArgumentException.class,
                () -> servicio.radicar(TipoPqrs.peticion, "Asunto valido", "corta", 3, null));
    }

    @Test
    void anexoFallaEnR2NoRompeRadicado() {
        when(almacen.subir(anyString(), any(), anyString()))
                .thenThrow(new RuntimeException("R2 caido"));
        ServicioRadicarPqrs.Anexo anexo =
                new ServicioRadicarPqrs.Anexo("f.pdf", "application/pdf", new byte[]{1});

        Pqrs r = servicio.radicar(TipoPqrs.queja, "Asunto valido", DESC_OK, 3, anexo);

        assertEquals("PQRS-2026-000010", r.getRadicado()); // radicado sigue valido
        verify(notificador).encolar(any(), any(), anyString(), anyString());
    }
}
