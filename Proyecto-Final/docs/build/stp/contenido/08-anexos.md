# Anexos

## A1. Glosario

| Sigla | Significado |
|---|---|
| TC | Test Case (caso de prueba) |
| BUG | Bug report (reporte de defecto) |
| HU | Historia de Usuario |
| CU | Caso de Uso |
| RF | Requerimiento Funcional |
| RNF | Requerimiento No Funcional |
| PQRS | Peticion, Queja, Reclamo, Sugerencia |
| CC/CE/TI/PP | Cedula / Cedula Extranjeria / Tarjeta Identidad / Pasaporte |
| MER | Modelo Entidad Relación |
| SMTP | Simple Mail Transfer Protocol |
| JWT | JSON Web Token |
| NAS | Network Attached Storage |

## A2. Trazabilidad TC ↔ RF ↔ CU

| TC | HU | RF cubierto | CU cubierto |
|---|---|---|---|
| TC-001 | HU-01 | RF-01, RF-12 | CU-03 |
| TC-002 | HU-01 | RF-01, RF-02, RF-12 | CU-03, CU-01 |
| TC-003 | HU-01 | RF-01 | CU-03 |
| TC-004 | HU-01 | RF-01 | CU-03 |
| TC-005 | HU-01 | RF-01 | CU-03 |
| TC-006 | HU-01 | RF-01 | CU-03 |
| TC-007 | HU-01 | RF-01 | CU-03 |
| TC-008 | HU-01 | RF-01 | CU-03 |
| TC-009 | HU-01 | RF-01, RF-02 | CU-03, CU-01 |
| TC-010 | HU-01 | RF-01, RF-12 | CU-03 |

## A3. Referencias

- Requerimientos Funcionales del Proyecto-Final: `Proyecto-Final/docs/7-Requerimientos-Funcionales.md`.
- Requerimientos No Funcionales: `Proyecto-Final/docs/8-Requerimientos-No-Funcionales.md`.
- Casos de Uso: `Proyecto-Final/docs/casos-de-uso/`.
- Documento de Arquitectura: `Proyecto-Final/docs/9-Arquitectura-PQRS.md`.
- Modelo de Datos: sección 8 (Modelo Entidad-Relación) del SAD `Proyecto-Final/docs/9-Arquitectura-PQRS.md`.
- Plantillas de Issue: `.github/ISSUE_TEMPLATE/test-case.yml` y `bug-report.yml`.

## A4. Plan de evolucion

Una vez completada la ejecución de los 10 TC base, este plan podria expandirse para cubrir:

- HU-03 Autenticación de Cliente (Login).
- HU-04 Consultar Historial de Radicados.
- HU-05 Filtrar Radicados Propios.
- Pruebas de regresion cuando se sumen funcionalidades adicionales.
- Pruebas no funcionales (rendimiento, seguridad) si el proyecto continua mas alla del scope academico actual.

Esa evolucion queda fuera del Sprint 1 y se documenta solo como roadmap.
