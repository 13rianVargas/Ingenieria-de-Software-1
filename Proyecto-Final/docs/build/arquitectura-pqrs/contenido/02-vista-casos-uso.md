# 2. Vista de Casos de Uso

La vista de casos de uso establece los requisitos funcionales arquitectonicamente significativos, es decir, los que tienen mayor impacto en las decisiones de diseño del sistema.

## 2.1 Actores

| Actor | Descripcion |
|---|---|
| Cliente (Ciudadano) | Persona natural que radica, consulta y filtra sus PQRS desde la App Movil. |
| Gestor de PQRS | Empleado de SuperMarket que tramita radicados desde la App Web (panel administrativo). |
| Administrador | Rol tecnico con acceso a parametrizacion del sistema y consulta de auditoria. |
| Sistema Notificador | Actor automatico que envia correos electronicos en eventos clave (radicacion, cambio de estado, contraseña autogenerada). |

## 2.2 Diagrama general de casos de uso

El diagrama completo vive en el archivo PlantUML `diagramas/arquitectura/1-vista-casos-uso.puml` del repositorio. Resumidamente, los actores se relacionan con los 8 casos de uso del sistema y con las relaciones de inclusion/extension hacia el sistema notificador.

## 2.3 Casos de uso arquitectonicamente significativos

Los siguientes casos de uso son significativos para la arquitectura porque impactan decisiones de diseño, integraciones o mecanismos concurrentes.

| ID | Caso de Uso | Impacto arquitectonico |
|---|---|---|
| CU-01 | Gestionar Registro Cliente | Trigger automatico desde radicar PQRS anonimo. Genera clave temporal cifrada con BCrypt. |
| CU-02 | Autenticarse (Login) | JWT mas Roles. Punto de entrada de seguridad para Cliente y Gestor. Justifica el modulo shared/security. |
| CU-03 | Radicar PQRS | Almacena PDF en NAS (no en BD), genera radicado unico, dispara correo asincrono. Justifica el adapter NAS y el envio asincrono. |
| CU-05 | Gestionar Bandeja Entrada | Paginacion y filtros sobre miles de PQRS. Requiere indices en BD y consultas optimizadas. |
| CU-06 | Tramitar PQRS | Persiste cambios de estado con justificacion. Genera entradas en la tabla tramite (log de negocio) y en auditoria (log tecnico generado por AOP). |
| CU-07 | Generar Reportes PDF | Render server-side de PDF (JasperReports o iText). Plantilla parametrizable. Descarga directa al navegador del Gestor. |

El listado completo de los 8 casos de uso, con sus especificaciones detalladas, vive en la carpeta `docs/casos-de-uso/` del repositorio.
