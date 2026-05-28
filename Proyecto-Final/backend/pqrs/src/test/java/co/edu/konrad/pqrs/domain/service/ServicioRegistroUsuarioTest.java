package co.edu.konrad.pqrs.domain.service;

import co.edu.konrad.pqrs.domain.model.TipoDocumento;
import co.edu.konrad.pqrs.domain.model.Usuario;
import co.edu.konrad.pqrs.domain.port.CodificadorClave;
import co.edu.konrad.pqrs.domain.port.UsuarioRepositorio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class ServicioRegistroUsuarioTest {

    private UsuarioRepositorio repo;
    private CodificadorClave codificador;
    private ServicioRegistroUsuario servicio;

    @BeforeEach
    void setup() {
        repo = Mockito.mock(UsuarioRepositorio.class);
        codificador = Mockito.mock(CodificadorClave.class);
        servicio = new ServicioRegistroUsuario(repo, codificador);
    }

    private Usuario nuevo() {
        return new Usuario(TipoDocumento.CC, "123", "Ana", "Lopez",
                "ana@demo.com", "300", "PlainPass");
    }

    @Test
    void registraUsuarioNuevoConClaveHasheada() {
        when(repo.existePorEmail("ana@demo.com")).thenReturn(false);
        when(codificador.codificar("PlainPass")).thenReturn("$2a$hash");
        when(repo.guardar(any())).thenAnswer(inv -> inv.getArgument(0));

        Usuario r = servicio.registrar(nuevo());

        assertEquals("$2a$hash", r.getClaveHash());
        verify(repo).guardar(any());
    }

    @Test
    void rechazaEmailDuplicado() {
        when(repo.existePorEmail(anyString())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> servicio.registrar(nuevo()));
        verify(repo, never()).guardar(any());
    }
}
