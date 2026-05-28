package co.edu.konrad.pqrs.domain.service;

import co.edu.konrad.pqrs.domain.model.Usuario;
import co.edu.konrad.pqrs.domain.port.CodificadorClave;
import co.edu.konrad.pqrs.domain.port.UsuarioRepositorio;
import org.springframework.stereotype.Service;

@Service
public class ServicioRegistroUsuario {

    private final UsuarioRepositorio usuarioRepositorio;
    private final CodificadorClave codificadorClave;

    public ServicioRegistroUsuario(UsuarioRepositorio usuarioRepositorio,
                                   CodificadorClave codificadorClave) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.codificadorClave = codificadorClave;
    }

    public Usuario registrar(Usuario usuario) {
        if (usuarioRepositorio.existePorEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese correo");
        }
        String hash = codificadorClave.codificar(usuario.getClaveHash());
        Usuario conHash = new Usuario(
                usuario.getTipoDoc(), usuario.getNumDoc(), usuario.getNombres(),
                usuario.getApellidos(), usuario.getEmail(), usuario.getTelefono(), hash
        );
        return usuarioRepositorio.guardar(conHash);
    }
}
