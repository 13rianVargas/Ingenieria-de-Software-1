package co.edu.konrad.pqrs.domain.service;

import co.edu.konrad.pqrs.domain.model.Credenciales;
import co.edu.konrad.pqrs.domain.model.TokenSesion;
import co.edu.konrad.pqrs.domain.model.Usuario;
import co.edu.konrad.pqrs.domain.port.CodificadorClave;
import co.edu.konrad.pqrs.domain.port.GeneradorToken;
import co.edu.konrad.pqrs.domain.port.UsuarioRepositorio;
import org.springframework.stereotype.Service;

@Service
public class ServicioAutenticacion {

    private final UsuarioRepositorio usuarioRepositorio;
    private final CodificadorClave codificadorClave;
    private final GeneradorToken generadorToken;

    public ServicioAutenticacion(UsuarioRepositorio usuarioRepositorio,
                                 CodificadorClave codificadorClave,
                                 GeneradorToken generadorToken) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.codificadorClave = codificadorClave;
        this.generadorToken = generadorToken;
    }

    public TokenSesion autenticar(Credenciales credenciales) {
        Usuario usuario = usuarioRepositorio.buscarPorCorreo(credenciales.email())
                .orElseThrow(() -> new CredencialesInvalidasException("Credenciales invalidas"));

        if (!codificadorClave.verifica(credenciales.clave(), usuario.getClaveHash())) {
            throw new CredencialesInvalidasException("Credenciales invalidas");
        }

        return generadorToken.generar(usuario.getEmail(), usuario.getRol().name());
    }

    public static class CredencialesInvalidasException extends RuntimeException {
        public CredencialesInvalidasException(String mensaje) {
            super(mensaje);
        }
    }
}
