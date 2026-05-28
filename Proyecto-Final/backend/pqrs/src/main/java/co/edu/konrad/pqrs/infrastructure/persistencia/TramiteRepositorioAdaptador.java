package co.edu.konrad.pqrs.infrastructure.persistencia;

import co.edu.konrad.pqrs.domain.model.Tramite;
import co.edu.konrad.pqrs.domain.port.TramiteRepositorio;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TramiteRepositorioAdaptador implements TramiteRepositorio {

    private final TramiteJpaRepositorio jpa;

    public TramiteRepositorioAdaptador(TramiteJpaRepositorio jpa) {
        this.jpa = jpa;
    }

    @Override
    public Tramite guardar(Tramite t) {
        return aDominio(jpa.save(aEntidad(t)));
    }

    @Override
    public List<Tramite> buscarPorPqrs(Integer pqrsId) {
        return jpa.findByPqrsIdOrderByTimestampDesc(pqrsId).stream().map(this::aDominio).toList();
    }

    private TramiteEntidad aEntidad(Tramite t) {
        TramiteEntidad e = new TramiteEntidad();
        e.setId(t.getId());
        e.setPqrsId(t.getPqrsId());
        e.setGestorId(t.getGestorId());
        e.setEstadoAnterior(t.getEstadoAnterior());
        e.setEstadoNuevo(t.getEstadoNuevo());
        e.setJustificacion(t.getJustificacion());
        e.setTimestamp(t.getTimestamp());
        return e;
    }

    private Tramite aDominio(TramiteEntidad e) {
        Tramite t = new Tramite(e.getPqrsId(), e.getGestorId(), e.getEstadoAnterior(),
                e.getEstadoNuevo(), e.getJustificacion());
        t.setId(e.getId());
        t.setTimestamp(e.getTimestamp());
        return t;
    }
}
