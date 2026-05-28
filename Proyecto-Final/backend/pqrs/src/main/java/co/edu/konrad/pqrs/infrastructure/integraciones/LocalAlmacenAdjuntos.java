package co.edu.konrad.pqrs.infrastructure.integraciones;

import co.edu.konrad.pqrs.domain.port.AlmacenAdjuntos;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Fallback de desarrollo: no sube a ningun lado, devuelve URL marcador.
 * Activo cuando r2.enabled=false (o ausente). Reemplazado por R2AlmacenAdjuntos
 * cuando se configuran credenciales Cloudflare R2 (r2.enabled=true).
 */
@Component
@ConditionalOnProperty(name = "r2.enabled", havingValue = "false", matchIfMissing = true)
public class LocalAlmacenAdjuntos implements AlmacenAdjuntos {

    private static final Logger log = LoggerFactory.getLogger(LocalAlmacenAdjuntos.class);

    @Override
    public String subir(String ruta, byte[] contenido, String tipoMime) {
        log.warn("R2 deshabilitado — adjunto '{}' ({} bytes) NO almacenado. URL marcador devuelto.",
                ruta, contenido.length);
        return "pending-r2://" + ruta;
    }
}
