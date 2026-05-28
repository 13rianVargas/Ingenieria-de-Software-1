package co.edu.konrad.pqrs.infrastructure.persistencia;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdjuntoJpaRepositorio extends JpaRepository<AdjuntoEntidad, Integer> {

    List<AdjuntoEntidad> findByPqrsId(Integer pqrsId);
}
