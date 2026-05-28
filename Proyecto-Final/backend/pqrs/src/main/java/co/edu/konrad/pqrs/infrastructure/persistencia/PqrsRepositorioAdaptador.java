package co.edu.konrad.pqrs.infrastructure.persistencia;

import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import co.edu.konrad.pqrs.domain.model.Pqrs;
import co.edu.konrad.pqrs.domain.model.TipoPqrs;
import co.edu.konrad.pqrs.domain.port.PqrsRepositorio;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class PqrsRepositorioAdaptador implements PqrsRepositorio {

    private final PqrsJpaRepositorio jpa;

    public PqrsRepositorioAdaptador(PqrsJpaRepositorio jpa) {
        this.jpa = jpa;
    }

    @Override
    public Pqrs guardar(Pqrs pqrs) {
        return aDominio(jpa.save(aEntidad(pqrs)));
    }

    @Override
    public Optional<Pqrs> buscarPorId(Integer id) {
        return jpa.findById(id).map(this::aDominio);
    }

    @Override
    public List<Pqrs> buscarPorCliente(Integer clienteId, String radicadoFiltro) {
        return jpa.misPqrs(clienteId, radicadoFiltro).stream().map(this::aDominio).toList();
    }

    @Override
    public List<Pqrs> buscarBandeja(EstadoPqrs estado, TipoPqrs tipo, int page, int size) {
        return jpa.bandeja(estado, tipo, PageRequest.of(page, size)).stream().map(this::aDominio).toList();
    }

    @Override
    public long contarBandeja(EstadoPqrs estado, TipoPqrs tipo) {
        return jpa.contarBandeja(estado, tipo);
    }

    private PqrsEntidad aEntidad(Pqrs p) {
        PqrsEntidad e = new PqrsEntidad();
        e.setId(p.getId());
        e.setRadicado(p.getRadicado());
        e.setTipo(p.getTipo());
        e.setAsunto(p.getAsunto());
        e.setDescripcion(p.getDescripcion());
        e.setEstado(p.getEstado());
        e.setClienteId(p.getClienteId());
        e.setGestorId(p.getGestorId());
        e.setFechaRadicado(p.getFechaRadicado());
        e.setFechaCierre(p.getFechaCierre());
        return e;
    }

    private Pqrs aDominio(PqrsEntidad e) {
        Pqrs p = new Pqrs();
        p.setId(e.getId());
        p.setRadicado(e.getRadicado());
        p.setTipo(e.getTipo());
        p.setAsunto(e.getAsunto());
        p.setDescripcion(e.getDescripcion());
        p.setEstado(e.getEstado());
        p.setClienteId(e.getClienteId());
        p.setGestorId(e.getGestorId());
        p.setFechaRadicado(e.getFechaRadicado());
        p.setFechaCierre(e.getFechaCierre());
        return p;
    }
}
