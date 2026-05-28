package co.edu.konrad.pqrs.infrastructure.persistencia;

import co.edu.konrad.pqrs.domain.port.NotificadorPort;
import org.springframework.stereotype.Component;

@Component
public class NotificadorAdaptador implements NotificadorPort {

    private final NotificacionJpaRepositorio jpa;

    public NotificadorAdaptador(NotificacionJpaRepositorio jpa) {
        this.jpa = jpa;
    }

    @Override
    public void encolar(Integer usuarioId, Integer pqrsId, String tipo, String plantilla) {
        NotificacionEntidad n = new NotificacionEntidad();
        n.setUsuarioId(usuarioId);
        n.setPqrsId(pqrsId);
        n.setTipo(tipo);
        n.setPlantilla(plantilla);
        n.setEstado("pendiente");
        n.setIntentos(0);
        jpa.save(n);
    }
}
