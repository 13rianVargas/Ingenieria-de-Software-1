# Criterios de Aceptacion, Suspension y Reanudacion

## Criterios de Aceptacion del Plan

El plan de pruebas se da por completado cuando se cumplan todas las siguientes condiciones:

- 100% de los casos de prueba diseñados han sido ejecutados (estado passed, failed o skipped; ninguno en pending o in-progress).
- 0 defectos abiertos con severidad critical.
- 0 defectos abiertos con severidad major.
- Defectos con severidad minor y trivial documentados y priorizados para correccion futura (no bloquean el cierre del plan academico).
- Todos los issues de GitHub de tipo test-case tienen resultado documentado (resultado obtenido mas evidencia en comentario).

## Criterios de Rechazo

El plan se considera fallido (no apto para entrega) si:

- Mas del 30% de los casos de prueba quedan sin ejecutar.
- Existen defectos critical o major sin documentar resultado obtenido o sin issue de bug-report asociado.

## Criterios de Suspension

Se detiene la ejecución de pruebas cuando:

- Un defecto critical impide ejecutar el flujo principal de la HU-01 (ej. el formulario de radicación no carga, el sistema no permite adjuntar archivos, la API devuelve 500 sistematicamente).
- El ambiente de pruebas no esta disponible o presenta inestabilidad que afecta mas del 50% de los casos planificados.

## Criterios de Reanudacion

La ejecución se reanuda cuando:

- El defecto con severidad critica que causo la suspension ha sido corregido y verificado en el ambiente.
- El ambiente de pruebas esta estable y disponible.
- El equipo acuerda explicitamente en el seguimiento que la causa de suspension esta resuelta.

## Clasificacion de Defectos

Un defecto se clasifica por su severidad segun el impacto sobre el sistema:

| Severidad | Criterio | Etiqueta |
|---|---|---|
| Critical | Bloquea totalmente la HU-01 o causa perdida de datos | severity:critical |
| Major | Funcionalidad principal afectada, hay workaround pero degrada UX | severity:major |
| Minor | Bug cosmetico o funcionalidad secundaria afectada | severity:minor |
| Trivial | Mejora menor de UX, sin impacto funcional real | severity:trivial |

## Clasificacion de Prioridad

Independiente de la severidad, la prioridad indica el orden de correccion:

| Prioridad | Criterio | Etiqueta |
|---|---|---|
| Alta | Debe corregirse antes de cerrar el sprint | priority:alta |
| Media | Debe corregirse en el siguiente sprint | priority:media |
| Baja | Puede quedar en backlog para futuras versiónes | priority:baja |
