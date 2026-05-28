package co.edu.konrad.pqrs.infrastructure.persistencia;

import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import co.edu.konrad.pqrs.domain.model.TipoPqrs;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "pqrs")
@Data
public class PqrsEntidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 20)
    private String radicado;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TipoPqrs tipo;

    @Column(nullable = false, length = 200)
    private String asunto;

    @Column(nullable = false, columnDefinition = "text")
    private String descripcion;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private EstadoPqrs estado;

    @Column(name = "cliente_id", nullable = false)
    private Integer clienteId;

    @Column(name = "gestor_id")
    private Integer gestorId;

    @Column(name = "fecha_radicado", nullable = false)
    private LocalDateTime fechaRadicado;

    @Column(name = "fecha_cierre")
    private LocalDateTime fechaCierre;
}
