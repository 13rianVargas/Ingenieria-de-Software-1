package co.edu.konrad.pqrs.infrastructure.auditoria;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.Arrays;

/**
 * Intercepta metodos anotados con @Auditable y persiste una fila en auditoria
 * tras la ejecucion exitosa. entidad_id = primer argumento Integer del metodo.
 * usuario_id queda null (log tecnico); el actor de negocio vive en tramite.gestor_id.
 */
@Aspect
@Component
public class AuditoriaAspect {

    private static final Logger log = LoggerFactory.getLogger(AuditoriaAspect.class);

    private final JdbcTemplate jdbc;

    public AuditoriaAspect(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Around("@annotation(auditable)")
    public Object auditar(ProceedingJoinPoint pjp, Auditable auditable) throws Throwable {
        Object resultado = pjp.proceed();
        try {
            Integer entidadId = primerInteger(pjp.getArgs());
            String ip = ipActual();
            String payload = construirPayload(pjp);
            jdbc.update(
                    "INSERT INTO auditoria (usuario_id, accion, entidad, entidad_id, ip, payload_json) " +
                            "VALUES (?, ?, ?, ?, ?, ?::jsonb)",
                    null, auditable.accion(), auditable.entidad(), entidadId, ip, payload);
        } catch (RuntimeException e) {
            log.error("Fallo al auditar {} (operacion ya ejecutada, no se revierte): {}",
                    auditable.accion(), e.getMessage());
        }
        return resultado;
    }

    private Integer primerInteger(Object[] args) {
        return Arrays.stream(args)
                .filter(Integer.class::isInstance)
                .map(Integer.class::cast)
                .findFirst()
                .orElse(0);
    }

    private String ipActual() {
        try {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            return attrs != null ? attrs.getRequest().getRemoteAddr() : null;
        } catch (RuntimeException e) {
            return null;
        }
    }

    private String construirPayload(ProceedingJoinPoint pjp) {
        MethodSignature sig = (MethodSignature) pjp.getSignature();
        Method metodo = sig.getMethod();
        // Payload minimo: metodo + args (sin datos sensibles esperados en tramitar).
        return String.format("{\"metodo\":\"%s\",\"args\":\"%s\"}",
                metodo.getName(),
                Arrays.toString(pjp.getArgs()).replace("\"", "'"));
    }
}
