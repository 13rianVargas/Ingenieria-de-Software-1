package co.edu.konrad.pqrs.domain.port;

import co.edu.konrad.pqrs.domain.model.Tramite;

import java.util.List;

public interface TramiteRepositorio {

    Tramite guardar(Tramite tramite);

    List<Tramite> buscarPorPqrs(Integer pqrsId);
}
