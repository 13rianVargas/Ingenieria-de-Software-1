package co.edu.konrad.pqrs.domain.model;

import java.time.LocalDateTime;

public class Usuario {
    private Integer id;
    private TipoDocumento tipoDoc;
    private String numDoc;
    private String nombres;
    private String apellidos;
    private String email;
    private String telefono;
    private String claveHash;
    private RolUsuario rol;
    private LocalDateTime fechaCreacion;

    public Usuario(TipoDocumento tipoDoc, String numDoc, String nombres,
                   String apellidos, String email, String telefono, String claveHash) {
        this.tipoDoc = tipoDoc;
        this.numDoc = numDoc;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.email = email;
        this.telefono = telefono;
        this.claveHash = claveHash;
        this.rol = RolUsuario.cliente;
        this.fechaCreacion = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public TipoDocumento getTipoDoc() { return tipoDoc; }
    public String getNumDoc() { return numDoc; }
    public String getNombres() { return nombres; }
    public String getApellidos() { return apellidos; }
    public String getEmail() { return email; }
    public String getTelefono() { return telefono; }
    public String getClaveHash() { return claveHash; }
    public RolUsuario getRol() { return rol; }
    public void setRol(RolUsuario rol) { this.rol = rol; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}