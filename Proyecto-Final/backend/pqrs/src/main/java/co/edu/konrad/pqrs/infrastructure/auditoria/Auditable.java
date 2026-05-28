package co.edu.konrad.pqrs.infrastructure.auditoria;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marca un metodo de dominio para auditoria automatica via AOP.
 * El AuditoriaAspect persiste una fila en la tabla auditoria tras la ejecucion exitosa.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {

    /** Vocabulario controlado de la accion, ej. "tramitar", "radicar". */
    String accion();

    /** Nombre de la entidad/tabla afectada, ej. "pqrs". */
    String entidad();
}
