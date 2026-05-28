package co.edu.konrad.pqrs.infrastructure.persistencia;

import co.edu.konrad.pqrs.domain.model.RolUsuario;
import co.edu.konrad.pqrs.domain.model.TipoDocumento;
import co.edu.konrad.pqrs.domain.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class UsuarioRepositorioAdaptadorTest {

    private UsuarioJpaRepositorio jpa;
    private UsuarioRepositorioAdaptador adaptador;

    @BeforeEach
    void setup() {
        jpa = Mockito.mock(UsuarioJpaRepositorio.class);
        adaptador = new UsuarioRepositorioAdaptador(jpa);
    }

    private UsuarioEntidad entidad() {
        UsuarioEntidad e = new UsuarioEntidad();
        e.setId(2);
        e.setTipoDoc(TipoDocumento.CC);
        e.setNumDoc("123");
        e.setNombres("Gestor");
        e.setApellidos("Demo");
        e.setEmail("gestor@demo.com");
        e.setTelefono("300");
        e.setClaveHash("$2a$hash");
        e.setRol(RolUsuario.gestor);
        e.setFechaCreacion(LocalDateTime.now());
        return e;
    }

    @Test
    void guardarMapeaRolYClave() {
        when(jpa.save(any())).thenReturn(entidad());
        Usuario u = new Usuario(TipoDocumento.CC, "123", "Gestor", "Demo",
                "gestor@demo.com", "300", "$2a$hash");
        u.setRol(RolUsuario.gestor);

        Usuario r = adaptador.guardar(u);

        assertEquals(2, r.getId());
        assertEquals(RolUsuario.gestor, r.getRol());
        assertEquals("$2a$hash", r.getClaveHash());
    }

    @Test
    void buscarPorCorreoMapeaRol() {
        when(jpa.findByEmail("gestor@demo.com")).thenReturn(Optional.of(entidad()));
        Optional<Usuario> r = adaptador.buscarPorCorreo("gestor@demo.com");
        assertTrue(r.isPresent());
        assertEquals(RolUsuario.gestor, r.get().getRol());
    }

    @Test
    void existePorEmailDelegaEnJpa() {
        when(jpa.existsByEmail("x@demo.com")).thenReturn(true);
        assertTrue(adaptador.existePorEmail("x@demo.com"));
    }

    @Test
    void buscarPorDocumento() {
        when(jpa.findByNumDoc("123")).thenReturn(Optional.of(entidad()));
        assertTrue(adaptador.buscarPorDocumento("123").isPresent());
    }
}
