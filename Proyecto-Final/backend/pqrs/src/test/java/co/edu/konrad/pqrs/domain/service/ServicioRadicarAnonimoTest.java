package co.edu.konrad.pqrs.domain.service;

import co.edu.konrad.pqrs.domain.model.Pqrs;
import co.edu.konrad.pqrs.domain.model.TipoDocumento;
import co.edu.konrad.pqrs.domain.model.TipoPqrs;
import co.edu.konrad.pqrs.domain.model.Usuario;
import co.edu.konrad.pqrs.domain.port.CodificadorClave;
import co.edu.konrad.pqrs.domain.port.NotificadorCredenciales;
import co.edu.konrad.pqrs.domain.port.UsuarioRepositorio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ServicioRadicarAnonimoTest {

    private UsuarioRepositorio usuarioRepo;
    private CodificadorClave codificador;
    private NotificadorCredenciales notifCred;
    private ServicioRadicarPqrs radicar;
    private ServicioRadicarAnonimo servicio;

    @BeforeEach
    void setup() {
        usuarioRepo = Mockito.mock(UsuarioRepositorio.class);
        codificador = Mockito.mock(CodificadorClave.class);
        notifCred = Mockito.mock(NotificadorCredenciales.class);
        radicar = Mockito.mock(ServicioRadicarPqrs.class);
        servicio = new ServicioRadicarAnonimo(usuarioRepo, codificador, notifCred, radicar);

        Pqrs result = new Pqrs(TipoPqrs.queja, "Asunto", "desc", 7);
        result.setRadicado("PQRS-2026-000010");
        when(radicar.radicar(any(), anyString(), anyString(), anyInt(), any())).thenReturn(result);
    }

    private ServicioRadicarAnonimo.DatosCliente cliente() {
        return new ServicioRadicarAnonimo.DatosCliente(
                TipoDocumento.CC, "123", "Steven", "Clavijo", "steven@demo.com", "300");
    }

    @Test
    void clienteNuevoSeRegistraYRecibeCredenciales() {
        when(usuarioRepo.buscarPorCorreo("steven@demo.com")).thenReturn(Optional.empty());
        when(codificador.codificar(anyString())).thenReturn("$2a$hash");
        when(usuarioRepo.guardar(any())).thenAnswer(inv -> {
            Usuario u = inv.getArgument(0);
            u.setId(7);
            return u;
        });

        Pqrs r = servicio.radicar(cliente(), TipoPqrs.queja, "Asunto valido", "descripcion larga valida aqui", null);

        assertEquals("PQRS-2026-000010", r.getRadicado());
        verify(usuarioRepo).guardar(any());
        verify(notifCred).enviarCredenciales(eq("steven@demo.com"), eq("Steven"), anyString(), eq("PQRS-2026-000010"));
    }

    @Test
    void clienteExistenteNoSeRegistraNiRecibeCredenciales() {
        Usuario existente = new Usuario(TipoDocumento.CC, "123", "Steven", "Clavijo",
                "steven@demo.com", "300", "$2a$hash");
        existente.setId(7);
        when(usuarioRepo.buscarPorCorreo("steven@demo.com")).thenReturn(Optional.of(existente));

        servicio.radicar(cliente(), TipoPqrs.peticion, "Asunto valido", "descripcion larga valida aqui", null);

        verify(usuarioRepo, never()).guardar(any());
        verifyNoInteractions(notifCred);
    }
}
