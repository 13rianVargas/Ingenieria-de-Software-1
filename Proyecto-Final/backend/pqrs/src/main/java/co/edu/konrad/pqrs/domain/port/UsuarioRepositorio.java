package co.edu.konrad.pqrs.domain.port;

import co.edu.konrad.pqrs.domain.model.*;

import java.util.Optional;


public interface UsuarioRepositorio {

    Usuario guardar(Usuario usuario);

    Optional<Usuario> buscarPorCorreo(String email);

    Optional<Usuario> buscarPorDocumento(String docNum);

    boolean existePorEmail(String email);


}