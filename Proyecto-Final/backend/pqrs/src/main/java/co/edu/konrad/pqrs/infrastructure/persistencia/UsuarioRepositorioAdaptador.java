package co.edu.konrad.pqrs.infrastructure.persistencia;

import co.edu.konrad.pqrs.domain.model.Usuario;
import co.edu.konrad.pqrs.domain.port.UsuarioRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UsuarioRepositorioAdaptador implements UsuarioRepositorio {

    private final UsuarioJpaRepositorio jpaRepositorio;

    @Override
    public Usuario guardar(Usuario usuario) {
        UsuarioEntidad entidad = aEntidad(usuario);
        return aDominio(jpaRepositorio.save(entidad));
    }

    @Override
    public Optional<Usuario> buscarPorCorreo(String email) {
        return jpaRepositorio.findByEmail(email).map(this::aDominio);
    }

    @Override
    public Optional<Usuario> buscarPorDocumento(String numDoc) {
        return jpaRepositorio.findByNumDoc(numDoc).map(this::aDominio);
    }

    @Override
    public boolean existePorEmail(String email) {
        return jpaRepositorio.existsByEmail(email);
    }

    private UsuarioEntidad aEntidad(Usuario u) {
        UsuarioEntidad e = new UsuarioEntidad();
        e.setTipoDoc(u.getTipoDoc());
        e.setNumDoc(u.getNumDoc());
        e.setNombres(u.getNombres());
        e.setApellidos(u.getApellidos());
        e.setEmail(u.getEmail());
        e.setTelefono(u.getTelefono());
        e.setClaveHash(u.getClaveHash());
        e.setRol(u.getRol());
        e.setFechaCreacion(u.getFechaCreacion());
        return e;
    }

    private Usuario aDominio(UsuarioEntidad e) {
        Usuario u = new Usuario(
                e.getTipoDoc(), e.getNumDoc(), e.getNombres(),
                e.getApellidos(), e.getEmail(), e.getTelefono(), e.getClaveHash()
        );
        u.setId(e.getId());
        u.setFechaCreacion(e.getFechaCreacion());
        return u;
    }
}