package co.edu.konrad.pqrs.infrastructure.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BcryptCodificadorClaveTest {

    private final BcryptCodificadorClave codificador = new BcryptCodificadorClave();

    @Test
    void codificaYVerificaRoundtrip() {
        String hash = codificador.codificar("Demo2026!");
        assertNotNull(hash);
        assertNotEquals("Demo2026!", hash);
        assertTrue(codificador.verifica("Demo2026!", hash));
        assertFalse(codificador.verifica("otra", hash));
    }
}
