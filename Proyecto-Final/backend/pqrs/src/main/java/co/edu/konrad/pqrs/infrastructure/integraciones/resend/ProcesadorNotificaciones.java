package co.edu.konrad.pqrs.infrastructure.integraciones.resend;

import co.edu.konrad.pqrs.infrastructure.persistencia.NotificacionEntidad;
import co.edu.konrad.pqrs.infrastructure.persistencia.NotificacionJpaRepositorio;
import co.edu.konrad.pqrs.infrastructure.persistencia.UsuarioEntidad;
import co.edu.konrad.pqrs.infrastructure.persistencia.UsuarioJpaRepositorio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Worker que procesa la cola de notificaciones cada 30s.
 * Lee filas pendientes (intentos<5), envia via Resend y marca enviada/fallida.
 * No-op si Resend deshabilitado (sin RESEND_API_KEY).
 */
@Component
public class ProcesadorNotificaciones {

    private static final Logger log = LoggerFactory.getLogger(ProcesadorNotificaciones.class);
    private static final int MAX_INTENTOS = 5;

    private final NotificacionJpaRepositorio notificaciones;
    private final UsuarioJpaRepositorio usuarios;
    private final ResendCliente resend;

    public ProcesadorNotificaciones(NotificacionJpaRepositorio notificaciones,
                                    UsuarioJpaRepositorio usuarios,
                                    ResendCliente resend) {
        this.notificaciones = notificaciones;
        this.usuarios = usuarios;
        this.resend = resend;
    }

    @Scheduled(fixedDelay = 30000)
    public void procesar() {
        if (!resend.habilitado()) {
            return; // sin API key, la cola se acumula hasta que se configure
        }

        List<NotificacionEntidad> pendientes =
                notificaciones.findTop20ByEstadoAndIntentosLessThanOrderByIdAsc("pendiente", MAX_INTENTOS);

        for (NotificacionEntidad n : pendientes) {
            try {
                UsuarioEntidad usuario = usuarios.findById(n.getUsuarioId()).orElse(null);
                if (usuario == null) {
                    marcarFallida(n, "usuario inexistente");
                    continue;
                }
                resend.enviar(usuario.getEmail(), asunto(n.getTipo()), cuerpo(n.getTipo(), usuario.getNombres()));
                n.setEstado("enviada");
                n.setEnviadoEn(LocalDateTime.now());
                notificaciones.save(n);
            } catch (RuntimeException e) {
                contarIntento(n, e.getMessage());
            }
        }
    }

    private void contarIntento(NotificacionEntidad n, String motivo) {
        int intentos = n.getIntentos() + 1;
        n.setIntentos(intentos);
        if (intentos >= MAX_INTENTOS) {
            n.setEstado("fallida");
            log.error("Notificacion {} marcada fallida tras {} intentos: {}", n.getId(), intentos, motivo);
        } else {
            log.warn("Notificacion {} fallo intento {}: {}", n.getId(), intentos, motivo);
        }
        notificaciones.save(n);
    }

    private void marcarFallida(NotificacionEntidad n, String motivo) {
        n.setEstado("fallida");
        n.setIntentos(MAX_INTENTOS);
        notificaciones.save(n);
        log.error("Notificacion {} fallida: {}", n.getId(), motivo);
    }

    private String asunto(String tipo) {
        return switch (tipo) {
            case "radicado_creado" -> "Tu PQRS fue radicada";
            case "cambio_estado" -> "Actualizacion de tu PQRS";
            case "clave_autogenerada" -> "Tu acceso al portal PQRS";
            default -> "Notificacion PQRS";
        };
    }

    private String cuerpo(String tipo, String nombres) {
        String mensaje = switch (tipo) {
            case "radicado_creado" -> "Hemos recibido tu PQRS. Pronto un gestor la atendera.";
            case "cambio_estado" -> "El estado de tu PQRS ha cambiado. Ingresa al portal para ver el detalle.";
            default -> "Tienes una nueva notificacion en el portal PQRS.";
        };
        return "<p>Hola " + nombres + ",</p><p>" + mensaje + "</p><p>SuperMarket Konrad</p>";
    }
}
