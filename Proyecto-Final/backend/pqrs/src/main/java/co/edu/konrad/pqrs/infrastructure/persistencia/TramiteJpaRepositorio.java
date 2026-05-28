package co.edu.konrad.pqrs.infrastructure.persistencia;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TramiteJpaRepositorio extends JpaRepository<TramiteEntidad, Integer> {

    List<TramiteEntidad> findByPqrsIdOrderByTimestampDesc(Integer pqrsId);
}
