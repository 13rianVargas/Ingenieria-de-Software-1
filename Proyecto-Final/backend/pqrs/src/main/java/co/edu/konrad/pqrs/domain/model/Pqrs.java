package co.edu.konrad.pqrs.domain.model;

import java.time.LocalDateTime;

public class Pqrs {
    private Integer id;
    private String radicado;
    private TipoPqrs tipo;
    private String asunto;
    private String descripcion;
    private EstadoPqrs estado;
    private Integer clienteId;
    private Integer gestorId;
    private LocalDateTime fechaRadicado;
    private LocalDateTime fechaCierre;

    public Pqrs(TipoPqrs tipo, String asunto, String descripcion, Integer clienteId) {
        this.tipo = tipo;
        this.asunto = asunto;
        this.descripcion = descripcion;
        this.clienteId = clienteId;
        this.estado = EstadoPqrs.nuevo;
        this.fechaRadicado = LocalDateTime.now();
    }

    public Pqrs() {
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getRadicado() { return radicado; }
    public void setRadicado(String radicado) { this.radicado = radicado; }
    public TipoPqrs getTipo() { return tipo; }
    public void setTipo(TipoPqrs tipo) { this.tipo = tipo; }
    public String getAsunto() { return asunto; }
    public void setAsunto(String asunto) { this.asunto = asunto; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public EstadoPqrs getEstado() { return estado; }
    public void setEstado(EstadoPqrs estado) { this.estado = estado; }
    public Integer getClienteId() { return clienteId; }
    public void setClienteId(Integer clienteId) { this.clienteId = clienteId; }
    public Integer getGestorId() { return gestorId; }
    public void setGestorId(Integer gestorId) { this.gestorId = gestorId; }
    public LocalDateTime getFechaRadicado() { return fechaRadicado; }
    public void setFechaRadicado(LocalDateTime fechaRadicado) { this.fechaRadicado = fechaRadicado; }
    public LocalDateTime getFechaCierre() { return fechaCierre; }
    public void setFechaCierre(LocalDateTime fechaCierre) { this.fechaCierre = fechaCierre; }
}
