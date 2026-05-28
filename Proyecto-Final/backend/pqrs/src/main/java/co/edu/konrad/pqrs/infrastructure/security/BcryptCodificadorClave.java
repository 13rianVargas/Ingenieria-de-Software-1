package co.edu.konrad.pqrs.infrastructure.security;

import co.edu.konrad.pqrs.domain.port.CodificadorClave;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class BcryptCodificadorClave implements CodificadorClave {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Override
    public String codificar(String claveRaw) {
        return encoder.encode(claveRaw);
    }

    @Override
    public boolean verifica(String claveRaw, String hashGuardado) {
        return encoder.matches(claveRaw, hashGuardado);
    }
}
