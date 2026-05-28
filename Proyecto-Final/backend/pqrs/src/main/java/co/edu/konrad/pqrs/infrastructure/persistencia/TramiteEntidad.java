package co.edu.konrad.pqrs.infrastructure.persistencia;

import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "tramite")
@Data
public class TramiteEntidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "pqrs_id", nullable = false)
    private Integer pqrsId;

    @Column(name = "gestor_id", nullable = false)
    private Integer gestorId;

    @Column(name = "estado_anterior", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private EstadoPqrs estadoAnterior;

    @Column(name = "estado_nuevo", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private EstadoPqrs estadoNuevo;

    @Column(nullable = false, columnDefinition = "text")
    private String justificacion;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
}
