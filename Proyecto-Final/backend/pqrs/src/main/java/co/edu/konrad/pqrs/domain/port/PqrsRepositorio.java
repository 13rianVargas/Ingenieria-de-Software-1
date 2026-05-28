package co.edu.konrad.pqrs.domain.port;

import co.edu.konrad.pqrs.domain.model.EstadoPqrs;
import co.edu.konrad.pqrs.domain.model.Pqrs;
import co.edu.konrad.pqrs.domain.model.TipoPqrs;

import java.util.List;
import java.util.Optional;

public interface PqrsRepositorio {

    Pqrs guardar(Pqrs pqrs);

    Optional<Pqrs> buscarPorId(Integer id);

    List<Pqrs> buscarPorCliente(Integer clienteId, String radicadoFiltro);

    /** Bandeja gestor: filtros opcionales + paginacion. */
    List<Pqrs> buscarBandeja(EstadoPqrs estado, TipoPqrs tipo, int page, int size);

    long contarBandeja(EstadoPqrs estado, TipoPqrs tipo);
}
