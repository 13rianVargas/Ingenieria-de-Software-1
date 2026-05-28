package co.edu.konrad.pqrs.domain.service;

import co.edu.konrad.pqrs.domain.model.Credenciales;
import co.edu.konrad.pqrs.domain.model.RolUsuario;
import co.edu.konrad.pqrs.domain.model.TipoDocumento;
import co.edu.konrad.pqrs.domain.model.TokenSesion;
import co.edu.konrad.pqrs.domain.model.Usuario;
import co.edu.konrad.pqrs.domain.port.CodificadorClave;
import co.edu.konrad.pqrs.domain.port.GeneradorToken;
import co.edu.konrad.pqrs.domain.port.UsuarioRepositorio;
import co.edu.konrad.pqrs.domain.service.ServicioAutenticacion.CredencialesInvalidasException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class ServicioAutenticacionTest {

    private UsuarioRepositorio usuarioRepositorio;
    private CodificadorClave codificador;
    private GeneradorToken generador;
    private ServicioAutenticacion servicio;

    @BeforeEach
    void setup() {
        usuarioRepositorio = Mockito.mock(UsuarioRepositorio.class);
        codificador = Mockito.mock(CodificadorClave.class);
        generador = Mockito.mock(GeneradorToken.class);
        servicio = new ServicioAutenticacion(usuarioRepositorio, codificador, generador);
    }

    private Usuario usuarioGestor() {
        Usuario u = new Usuario(TipoDocumento.CC, "1", "Gestor", "Demo",
                "gestor@demo.com", "300", "$2a$hash");
        u.setRol(RolUsuario.gestor);
        return u;
    }

    @Test
    void autenticaConCredencialesValidas() {
        Usuario u = usuarioGestor();
        when(usuarioRepositorio.buscarPorCorreo("gestor@demo.com")).thenReturn(Optional.of(u));
        when(codificador.verifica("Demo2026!", "$2a$hash")).thenReturn(true);
        when(generador.generar("gestor@demo.com", "gestor"))
                .thenReturn(new TokenSesion("tok", "gestor", Instant.now()));

        TokenSesion t = servicio.autenticar(new Credenciales("gestor@demo.com", "Demo2026!"));

        assertEquals("tok", t.token());
        assertEquals("gestor", t.rol());
    }

    @Test
    void rechazaClaveIncorrecta() {
        when(usuarioRepositorio.buscarPorCorreo(anyString())).thenReturn(Optional.of(usuarioGestor()));
        when(codificador.verifica(anyString(), anyString())).thenReturn(false);

        assertThrows(CredencialesInvalidasException.class,
                () -> servicio.autenticar(new Credenciales("gestor@demo.com", "mala")));
    }

    @Test
    void rechazaUsuarioInexistente() {
        when(usuarioRepositorio.buscarPorCorreo(anyString())).thenReturn(Optional.empty());

        assertThrows(CredencialesInvalidasException.class,
                () -> servicio.autenticar(new Credenciales("nadie@demo.com", "x")));
    }
}
