package co.edu.konrad.pqrs.domain.port;

import co.edu.konrad.pqrs.domain.model.Adjunto;

import java.util.List;

public interface AdjuntoRepositorio {

    Adjunto guardar(Adjunto adjunto);

    List<Adjunto> buscarPorPqrs(Integer pqrsId);
}
