package co.edu.konrad.pqrs.domain.model;

import java.time.LocalDateTime;

public class Tramite {
    private Integer id;
    private Integer pqrsId;
    private Integer gestorId;
    private EstadoPqrs estadoAnterior;
    private EstadoPqrs estadoNuevo;
    private String justificacion;
    private LocalDateTime timestamp;

    public Tramite(Integer pqrsId, Integer gestorId, EstadoPqrs estadoAnterior,
                   EstadoPqrs estadoNuevo, String justificacion) {
        this.pqrsId = pqrsId;
        this.gestorId = gestorId;
        this.estadoAnterior = estadoAnterior;
        this.estadoNuevo = estadoNuevo;
        this.justificacion = justificacion;
        this.timestamp = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getPqrsId() { return pqrsId; }
    public Integer getGestorId() { return gestorId; }
    public EstadoPqrs getEstadoAnterior() { return estadoAnterior; }
    public EstadoPqrs getEstadoNuevo() { return estadoNuevo; }
    public String getJustificacion() { return justificacion; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
