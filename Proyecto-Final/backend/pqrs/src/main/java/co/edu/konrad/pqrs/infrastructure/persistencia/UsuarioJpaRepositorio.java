package co.edu.konrad.pqrs.infrastructure.persistencia;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public  interface UsuarioJpaRepositorio extends JpaRepository<UsuarioEntidad, Long> {

    Optional<UsuarioEntidad> findByEmail(String email);

    Optional<UsuarioEntidad> findByNumDoc(String numDoc);

    boolean existsByEmail(String email);

}
