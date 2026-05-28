package co.edu.konrad.pqrs.domain.port;

import co.edu.konrad.pqrs.domain.model.TokenSesion;

public interface GeneradorToken {

    TokenSesion generar(String email, String rol);
}
