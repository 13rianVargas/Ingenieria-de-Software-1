package co.edu.konrad.pqrs.domain.model;

import java.time.LocalDateTime;

public class Adjunto {
    private Integer id;
    private Integer pqrsId;
    private String nombreArchivo;
    private String urlNas;
    private String tipoMime;
    private long tamanoBytes;
    private LocalDateTime fechaSubida;

    public Adjunto(Integer pqrsId, String nombreArchivo, String urlNas, String tipoMime, long tamanoBytes) {
        this.pqrsId = pqrsId;
        this.nombreArchivo = nombreArchivo;
        this.urlNas = urlNas;
        this.tipoMime = tipoMime;
        this.tamanoBytes = tamanoBytes;
        this.fechaSubida = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getPqrsId() { return pqrsId; }
    public String getNombreArchivo() { return nombreArchivo; }
    public String getUrlNas() { return urlNas; }
    public String getTipoMime() { return tipoMime; }
    public long getTamanoBytes() { return tamanoBytes; }
    public LocalDateTime getFechaSubida() { return fechaSubida; }
    public void setFechaSubida(LocalDateTime fechaSubida) { this.fechaSubida = fechaSubida; }
}
