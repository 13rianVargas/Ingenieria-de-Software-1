# Plan de Pruebas — Sistema PQRS

> Plan de pruebas funcional para la HU-01 Radicar PQRS del Proyecto-Final.

---

## 1. Resumen ejecutivo

Plan de pruebas funcional de caja negra para la **HU-01 Radicar PQRS** (5 SP, unica HU bajo implementacion en el Proyecto-Final). Cubre el flujo end-to-end desde que el ciudadano abre la App Movil hasta que el sistema confirma el radicado y dispara la notificacion por correo.

El documento detallado en formato `.docx` vive en `build/plan-pruebas-pqrs/` y se regenera con `python generar-docx.py` cuando se requiera entrega academica.

## 2. Alcance

Elemento bajo prueba:

| ID | Historia de Usuario | Modulo |
|---|---|---|
| HU-01 | Radicar PQRS | Mobile (Cliente) + Backend |

Funcionalidades cubiertas:

- Radicacion autenticada (cliente existente).
- Radicacion anonima (gatilla registro automatico de cliente CU-01).
- Adjuntar PDF (validacion tipo y tamaño).
- Generacion de radicado unico (formato `PQRS-YYYY-NNNNNN`).
- Disparo asincrono de correo de confirmacion.

Funcionalidades excluidas del plan (otras HU):

| HU | Razon de exclusion |
|---|---|
| HU-02 Registro Automatico | Se valida como flujo subsidiario de HU-01 (camino anonimo), no como HU independiente. |
| HU-03..HU-12 | Fuera del scope de implementacion del Proyecto-Final. |

## 3. Estrategia

Pruebas funcionales de **caja negra** exclusivamente. No se cubren pruebas unitarias ni de rendimiento ni de seguridad en este plan.

Tecnicas aplicadas:

| Tecnica | Aplicacion en HU-01 |
|---|---|
| Particion de equivalencias | Campos texto (asunto, descripcion), formato email, tipo PQRS valido vs invalido. |
| Analisis de valores limite | Tamaño asunto (1, 200, 201), tamaño adjunto (0, 5 MB, 5 MB + 1 byte). |
| Tabla de decisiones | Cliente autenticado vs anonimo, con/sin adjunto, SMTP disponible/caido. |
| Caso de uso extendido | Flujos alternativos: cliente ya existe, SMTP cae, BD falla en INSERT. |

## 4. Casos de prueba (10 base)

| ID | Descripcion | Tecnica | Esperado |
|---|---|---|---|
| TC-001 | Radicar con todos los campos validos, cliente autenticado | Caja negra | Radicado creado, numero generado, email enviado |
| TC-002 | Radicar con cliente anonimo (no existe en BD) | Caja negra | Usuario auto-registrado, clave autogenerada, radicado creado |
| TC-003 | Asunto vacio | Particion eq. invalida | Error de validacion en formulario |
| TC-004 | Asunto 201 caracteres (limite + 1) | Valor limite | Error de validacion |
| TC-005 | Adjunto que no es PDF (ej. imagen JPG) | Particion eq. invalida | Error tipo de archivo |
| TC-006 | Adjunto > 5 MB | Valor limite | Error tamaño |
| TC-007 | Sin adjunto (opcional) | Caja negra | Radicado creado sin anexo |
| TC-008 | Tipo PQRS invalido (ej. "otro") | Particion eq. invalida | Error |
| TC-009 | Email cliente ya existe en BD | Caja negra | Usa cuenta existente, no duplica |
| TC-010 | Falla SMTP al enviar correo | Caso uso extendido | Radicado creado igual, retry async |

Detalle completo de cada TC en GitHub Issues con plantilla `test-case.yml`. Cada TC se documenta como un Issue separado para trazabilidad.

## 5. Workflow GitHub

Estados de cada TC en el board:

```
Backlog → Por ejecutar → En ejecucion → Pass / Fail → Cerrado
```

Si un TC sale Fail, se abre un Issue con plantilla `bug-report.yml` linkeado al TC origen.

Labels:

- `test-case` — todos los TC.
- `HU-01` — historia de usuario asociada.
- `priority` (alta, media, baja).
- `severity` (critical, major, minor, trivial) — para bugs encontrados.
- `status` (pending, in-progress, passed, failed, blocked).
- `test:functional` — tipo de prueba (siempre funcional en este plan).
- `env` (dev, qa, staging) — ambiente donde se ejecuto.

Milestone: **"Proyecto-Final — HU-01 Radicar PQRS"**.

## 6. Criterios de aceptacion del plan

El plan se da por completado cuando:

- 100% de los TC ejecutados (`passed`, `failed` o `skipped`, ninguno en `pending`).
- 0 bugs abiertos con severidad `critical` o `major`.
- Bugs `minor` y `trivial` documentados con prioridad asignada.
- Cada Issue de tipo `test-case` tiene resultado obtenido + evidencia en comentario.

## 7. Resultado y ejecucion (entregable separado)

La **ejecucion real** (entregable #12 Ejecucion y Resultado de Pruebas) se documenta cuando HU-01 este implementada. Vive en:

- GitHub Issues (cada TC ejecutado, con resultado comentado + screenshots).
- `Proyecto-Final/docs/14-Resultado-Pruebas-HU-01.md` (reporte resumen).
- `Proyecto-Final/docs/build/resultado-pruebas-hu01/` (pipeline `.docx`).

## 8. Cobertura entregable

> Este documento es el entregable obligatorio **#11 Plan de Pruebas** del Proyecto-Final. El entregable #12 (Ejecucion y Resultado) se cierra despues de implementar el software, no en esta fase.

---

## Referencias

- Documento detallado en `.docx`: [`build/plan-pruebas-pqrs/`](./build/plan-pruebas-pqrs/) (regenerar con `python generar-docx.py`).
- Plantilla TC: [`.github/ISSUE_TEMPLATE/test-case.yml`](../../.github/ISSUE_TEMPLATE/test-case.yml).
- Plantilla BUG: [`.github/ISSUE_TEMPLATE/bug-report.yml`](../../.github/ISSUE_TEMPLATE/bug-report.yml).
- HU-01 detalle: [`docs/casos-de-uso/`](./casos-de-uso/) (CU-03 Radicar PQRS).
