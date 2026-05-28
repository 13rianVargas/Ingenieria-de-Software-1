package co.edu.konrad.pqrs.infrastructure.persistencia;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificacion")
@Data
public class NotificacionEntidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "usuario_id", nullable = false)
    private Integer usuarioId;

    @Column(name = "pqrs_id")
    private Integer pqrsId;

    @Column(nullable = false, length = 30)
    private String tipo;

    @Column(nullable = false, length = 50)
    private String plantilla;

    @Column(name = "enviado_en")
    private LocalDateTime enviadoEn;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(nullable = false)
    private Integer intentos;
}
