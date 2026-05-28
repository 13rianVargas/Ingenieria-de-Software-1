package co.edu.konrad.pqrs.infrastructure.persistencia;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacionJpaRepositorio extends JpaRepository<NotificacionEntidad, Integer> {

    List<NotificacionEntidad> findTop20ByEstadoAndIntentosLessThanOrderByIdAsc(String estado, int maxIntentos);
}
