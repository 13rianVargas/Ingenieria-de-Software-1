# Criterios de Aceptación, Suspensión y Reanudación

## Criterios de Aceptación del Plan

El plan de pruebas se da por completado cuando se cumplan **todas** las
siguientes condiciones:

- 100 % de los casos de prueba diseñados han sido ejecutados (estado
  `passed`, `failed` o `skipped`; ninguno en `pending` o `in-progress`).
- 0 defectos abiertos con severidad `critical`.
- 0 defectos abiertos con severidad `major`.
- Defectos con severidad `minor` y `trivial` documentados y priorizados
  para corrección futura (no bloquean el cierre del plan académico).
- Todos los issues de GitHub de tipo `test-case` tienen resultado
  documentado (resultado obtenido + evidencia en comentario).

## Criterios de Rechazo

El plan se considera fallido (no apto para entrega) si:

- Más del 30 % de los casos de prueba quedan sin ejecutar.
- Existen defectos `critical` o `major` sin documentar resultado obtenido
  o sin issue de bug-report asociado.

## Criterios de Suspensión

Se detiene la ejecución de pruebas cuando:

- Un defecto `critical` impide ejecutar el flujo principal de alguna HU
  (ej. el formulario de registro no carga, el sistema no permite adjuntar
  archivos).
- El ambiente de pruebas no está disponible o presenta inestabilidad
  que afecta más del 50 % de los casos planificados.

## Criterios de Reanudación

La ejecución se reanuda cuando:

- El defecto con severidad crítica que causó la suspensión ha sido
  corregido y verificado en el ambiente.
- El ambiente de pruebas está estable y disponible.
- El equipo acuerda explícitamente en el seguimiento que la causa
  de suspensión está resuelta.

## Clasificación de Defectos

Un defecto se clasifica por su severidad según el impacto sobre el sistema:

| Severidad | Criterio | Etiqueta |
|-----------|----------|----------|
| Critical | Impide la ejecución del flujo principal de una historia de usuario; no existe alternativa. Ejemplo: el formulario de registro no carga o el sistema bloquea el avance entre pasos. | *(severity:critical)* |
| Major | Funcionalidad importante degradada; existe un procedimiento alternativo manual pero el comportamiento no cumple la especificación. Ejemplo: el correo de confirmación no se envía o la distinción persona natural y jurídica es incorrecta. | *(severity:major)* |
| Minor | Funcionalidad secundaria afectada; no impide el flujo principal. Ejemplo: mensaje de validación con texto incorrecto o campo opcional con comportamiento inesperado. | *(severity:minor)* |
| Trivial | Defecto cosmético o de presentación; no afecta funcionalidad ni flujo. Ejemplo: alineación incorrecta, etiqueta con error tipográfico o color distinto al diseño. | *(severity:trivial)* |

Los defectos **critical** suspenden la ejecución del Test Run hasta su
resolución (ver sección Criterios de Suspensión). Los defectos **major**
deben estar en cero antes de aprobar el cierre del plan.
