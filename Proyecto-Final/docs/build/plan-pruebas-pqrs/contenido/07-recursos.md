# Recursos

## Entregables del Plan de Pruebas

| Entregable | Descripcion | Ubicacion |
|---|---|---|
| Plan de Pruebas (documento) | Markdown fuente del plan | `Proyecto-Final/docs/12-Plan-Pruebas-PQRS.md` |
| Plan de Pruebas (`.docx`) | Documento formal entregable academico | `Proyecto-Final/docs/build/plan-pruebas-pqrs/plan-pruebas-pqrs.docx` (regenerar con generar-docx.py) |
| Casos de Prueba | Issues de GitHub con plantilla test-case.yml | GitHub Issues del repo, etiqueta test-case mas HU-01 |
| Reportes de Defecto | Issues de GitHub con plantilla bug-report.yml | GitHub Issues del repo, etiqueta bug mas HU-01 |
| Evidencias de Ejecucion | Capturas, logs, videos | Adjuntos en comentarios de cada Issue |
| Reporte final de resultados | Resumen ejecutivo al cerrar pruebas | `Proyecto-Final/docs/14-Resultado-Pruebas-HU-01.md` (fase 9) |

## Requerimientos de Entorno — Hardware

| Recurso | Especificacion minima |
|---|---|
| PC / Laptop por integrante | Cualquier maquina con navegador moderno |
| Dispositivo movil de prueba | Smartphone Android o iOS para validar la App Mobile |
| Conectividad | Acceso a internet estable para GitHub y al servidor donde corre la app |

## Requerimientos de Entorno — Software

| Software | Version | Uso |
|---|---|---|
| Git | 2.x | Versionado de fuentes y plantillas |
| GitHub CLI (gh) | 2.x | Gestion de etiquetas, hitos e Issues |
| Navegador web | Chrome / Firefox / Safari modernos | Acceso a GitHub Issues, Projects y la App Web del gestor |
| Postman o similar | Cualquiera | Validar la API REST directamente si se requiere triangular bugs |
| Cliente de correo | Cualquiera | Validar la recepcion de correos transaccionales |

## Herramientas de Prueba Requeridas

| Herramienta | Rol en el proceso de pruebas |
|---|---|
| GitHub Issues | Registro, seguimiento y trazabilidad de casos de prueba y reportes de defecto |
| GitHub Projects | Tablero kanban para visualizacion del estado del Test Run |
| GitHub Actions | Validaciones automaticas del repositorio en CI (no ejecuta los TC funcionales, pero si lint, unit tests y build del software) |

## Personal

| Rol | Responsabilidad | Integrante(s) |
|---|---|---|
| Lider de Pruebas | Coordinacion del plan, revision de casos y criterios de aceptacion | Criollo Homez Julian Felipe |
| Analista de Pruebas | Diseño y ejecucion de casos, reporte de defectos | Avila Cortes Julian David, Vargas Clavijo Brian Steven |
| Revisor de Documentos | Revision del documento final antes de entrega | Rocha Ramirez Santiago |

## Entrenamiento

Las necesidades de entrenamiento aplican tanto sobre el sistema como sobre el proceso de pruebas:

- **Sobre el sistema:** todos los integrantes deben conocer el comportamiento esperado de HU-01 antes de diseñar los TC. Se recomienda revisar los documentos: 1-Funcionalidades, 7-Requerimientos-Funcionales (RF-01, RF-02, RF-12), casos-de-uso/CU-03 y los mockups en docs/mockups.
- **Sobre el proceso:** los analistas deben conocer las plantillas test-case.yml y bug-report.yml, y el workflow en GitHub Projects (Backlog → Por ejecutar → En ejecucion → Pass/Fail → Cerrado).
