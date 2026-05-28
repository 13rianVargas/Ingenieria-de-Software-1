package co.edu.konrad.pqrs.infrastructure.security;

import co.edu.konrad.pqrs.domain.model.TokenSesion;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private static final String SECRET = "dev-secret-must-be-overridden-32chars-min";
    private final JwtService jwt = new JwtService(SECRET, 28800000L);

    @Test
    void generaTokenYExtraeEmailYRol() {
        TokenSesion t = jwt.generar("cliente@demo.com", "cliente");
        assertNotNull(t.token());
        assertEquals("cliente", t.rol());
        assertEquals("cliente@demo.com", jwt.extraerEmail(t.token()));
        assertEquals("cliente", jwt.extraerRol(t.token()));
    }

    @Test
    void tokenValidoEsValido() {
        TokenSesion t = jwt.generar("gestor@demo.com", "gestor");
        assertTrue(jwt.esValido(t.token()));
    }

    @Test
    void tokenBasuraNoEsValido() {
        assertFalse(jwt.esValido("no.es.un.jwt"));
        assertFalse(jwt.esValido(""));
    }

    @Test
    void tokenFirmadoConOtraClaveNoEsValido() {
        JwtService otro = new JwtService("otra-clave-distinta-de-32-caracteres-min", 28800000L);
        String tokenAjeno = otro.generar("x@demo.com", "cliente").token();
        assertFalse(jwt.esValido(tokenAjeno));
    }
}
