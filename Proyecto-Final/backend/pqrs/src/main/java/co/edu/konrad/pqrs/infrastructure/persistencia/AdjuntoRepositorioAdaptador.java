package co.edu.konrad.pqrs.infrastructure.persistencia;

import co.edu.konrad.pqrs.domain.model.Adjunto;
import co.edu.konrad.pqrs.domain.port.AdjuntoRepositorio;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AdjuntoRepositorioAdaptador implements AdjuntoRepositorio {

    private final AdjuntoJpaRepositorio jpa;

    public AdjuntoRepositorioAdaptador(AdjuntoJpaRepositorio jpa) {
        this.jpa = jpa;
    }

    @Override
    public Adjunto guardar(Adjunto adjunto) {
        return aDominio(jpa.save(aEntidad(adjunto)));
    }

    @Override
    public List<Adjunto> buscarPorPqrs(Integer pqrsId) {
        return jpa.findByPqrsId(pqrsId).stream().map(this::aDominio).toList();
    }

    private AdjuntoEntidad aEntidad(Adjunto a) {
        AdjuntoEntidad e = new AdjuntoEntidad();
        e.setId(a.getId());
        e.setPqrsId(a.getPqrsId());
        e.setNombreArchivo(a.getNombreArchivo());
        e.setUrlNas(a.getUrlNas());
        e.setTipoMime(a.getTipoMime());
        e.setTamanoBytes(a.getTamanoBytes());
        e.setFechaSubida(a.getFechaSubida());
        return e;
    }

    private Adjunto aDominio(AdjuntoEntidad e) {
        Adjunto a = new Adjunto(e.getPqrsId(), e.getNombreArchivo(), e.getUrlNas(),
                e.getTipoMime(), e.getTamanoBytes());
        a.setId(e.getId());
        a.setFechaSubida(e.getFechaSubida());
        return a;
    }
}
