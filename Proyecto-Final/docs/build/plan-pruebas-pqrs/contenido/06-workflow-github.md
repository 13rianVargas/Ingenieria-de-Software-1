# Workflow GitHub

## Flujo de ejecucion

Cada caso de prueba viaja por los siguientes estados en el board GitHub Projects:

```
Backlog → Por ejecutar → En ejecucion → Pass / Fail → Cerrado
```

1. **Backlog:** TC creado pero aun no priorizado para el sprint actual.
2. **Por ejecutar:** TC priorizado para el sprint actual, asignado a un analista.
3. **En ejecucion:** El analista esta ejecutando el TC en ese momento.
4. **Pass / Fail:** Resultado documentado en el comentario del Issue.
   - Pass: el resultado obtenido coincide con el esperado.
   - Fail: se abre un Issue de tipo bug-report linkeado.
5. **Cerrado:** El Issue se cierra cuando el resultado esta documentado con evidencias.

## Plantillas Issue

Las plantillas viven en `.github/ISSUE_TEMPLATE/` del repositorio:

- **test-case.yml:** caso de prueba. Campos: ID, HU, CU, tipo, prioridad, severidad, precondiciones, datos, pasos, esperado, obtenido, estado, ambiente, navegador, evidencias.
- **bug-report.yml:** reporte de defecto. Campos: ID, TC origen, HU afectada, severidad, prioridad, reproducibilidad, pasos para reproducir, esperado vs obtenido, ambiente, logs, workaround, evidencia.

## Sistema de etiquetas

Todas las etiquetas se aplican simultaneamente al Issue:

| Etiqueta | Valores | Proposito |
|---|---|---|
| Tipo | test-case, bug | Distinguir naturaleza del Issue |
| HU | HU-01 | Asociar al backlog |
| Prioridad | priority:alta, priority:media, priority:baja | Orden de ejecucion / correccion |
| Severidad | severity:critical, severity:major, severity:minor, severity:trivial | Impacto del bug si aplica |
| Estado | status:pending, status:in-progress, status:passed, status:failed, status:blocked, status:skipped | Estado en el board |
| Tipo de prueba | test:functional | Categoria de la prueba (en este plan, siempre functional) |
| Ambiente | env:dev, env:qa, env:staging | Ambiente donde se ejecuto |

## Milestone

Se crea un milestone en GitHub con titulo:

> **Proyecto-Final — HU-01 Radicar PQRS**

Fecha objetivo: cierre del sprint de implementacion. Todos los TC y bugs asociados a esta HU se agrupan bajo este milestone.

## Indice de casos de prueba

Se mantiene un indice navegable en el repositorio (a definir su ubicacion exacta, pero se sugiere `Proyecto-Final/docs/casos-de-prueba/indice.md` cuando se ejecute la fase 9 del plan). El indice tiene una tabla con: ID, descripcion corta, prioridad, estado actual, link al Issue de GitHub.

## Roles

| Rol | Responsabilidad | Integrante(s) |
|---|---|---|
| Lider de Pruebas | Coordinacion del plan, revision de casos y criterios de aceptacion | Criollo Homez Julian Felipe |
| Analista de Pruebas | Diseño y ejecucion de casos, reporte de defectos | Avila Cortes Julian David, Vargas Clavijo Brian Steven |
| Revisor de Documentos | Revision del documento final antes de entrega | Rocha Ramirez Santiago |

## Procedimiento por TC

1. **Diseño:** crear Issue con plantilla test-case.yml. Asignar etiquetas. Linkear al milestone.
2. **Priorizacion:** mover a "Por ejecutar" en el board. Asignar a un analista.
3. **Ejecucion:** el analista cambia el estado a "En ejecucion", ejecuta los pasos, captura evidencias.
4. **Resultado:** comenta el Issue con resultado obtenido + evidencias adjuntas. Cambia etiqueta a status:passed o status:failed.
5. **Si Fail:** crea Issue con bug-report.yml linkeado (Closes #NN... o Related to #NN). Linkea al milestone.
6. **Cierre:** una vez documentado, cerrar el Issue. El board lo mueve a la columna "Cerrado".

## Procedimiento por BUG

1. Crear Issue con plantilla bug-report.yml.
2. Linkear al TC origen y a la HU afectada.
3. Asignar severidad y prioridad.
4. Triage por el Lider de Pruebas (puede reclasificar severidad/prioridad).
5. Asignar al dev responsable del modulo afectado segun ownership.
6. El dev corrige y comenta el Issue con el fix (link al PR).
7. Cuando el PR mergea, se vuelve a ejecutar el TC para verificar.
8. Si pasa: cerrar el bug Issue + actualizar el TC origen.
