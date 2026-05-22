package co.edu.konrad.pqrs.infrastructure.persistencia;


import co.edu.konrad.pqrs.domain.model.RolUsuario;
import co.edu.konrad.pqrs.domain.model.TipoDocumento;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name="usuario")
@Data
public class UsuarioEntidad {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "tipo_doc", nullable = false, length = 4)
    @Enumerated(EnumType.STRING)
    private TipoDocumento tipoDoc;

    @Column(name = "num_doc", nullable = false, unique = true, length = 20)
    private String numDoc;


    @Column(nullable = false, length = 100)
    public String nombres;


    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(length = 20)
    private String telefono;

    @Column(name = "clave_hash", nullable = false, length = 255)
    private String claveHash;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private RolUsuario rol;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;
}





