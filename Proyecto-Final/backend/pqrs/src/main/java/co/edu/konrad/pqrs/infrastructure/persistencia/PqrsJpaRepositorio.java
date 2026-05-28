package co.edu.konrad.pqrs.infrastructure.persistencia;

import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import co.edu.konrad.pqrs.domain.model.TipoPqrs;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PqrsJpaRepositorio extends JpaRepository<PqrsEntidad, Integer> {

    @Query("""
            SELECT p FROM PqrsEntidad p
            WHERE p.clienteId = :clienteId
              AND (:rad IS NULL OR p.radicado = :rad)
            ORDER BY p.fechaRadicado DESC
            """)
    List<PqrsEntidad> misPqrs(@Param("clienteId") Integer clienteId, @Param("rad") String radicado);

    @Query("""
            SELECT p FROM PqrsEntidad p
            WHERE (:estado IS NULL OR p.estado = :estado)
              AND (:tipo IS NULL OR p.tipo = :tipo)
            ORDER BY p.fechaRadicado DESC
            """)
    List<PqrsEntidad> bandeja(@Param("estado") EstadoPqrs estado,
                              @Param("tipo") TipoPqrs tipo,
                              Pageable pageable);

    @Query("""
            SELECT COUNT(p) FROM PqrsEntidad p
            WHERE (:estado IS NULL OR p.estado = :estado)
              AND (:tipo IS NULL OR p.tipo = :tipo)
            """)
    long contarBandeja(@Param("estado") EstadoPqrs estado, @Param("tipo") TipoPqrs tipo);
}
