# 2. Vista de Casos de Uso

La vista de casos de uso establece los requisitos funcionales arquitectonicamente significativos, es decir, los que tienen mayor impacto en las decisiones de diseño del sistema.

## 2.1 Actores

| Actor | descripción |
|---|---|
| Cliente (Ciudadano) | Persona natural que radica, consulta y filtra sus PQRS desde la App Móvil. |
| Gestor de PQRS | Empleado de SuperMarket que tramita radicados desde la App Web (panel administrativo). |
| Administrador* | Rol técnico con acceso a parametrización del sistema y consulta de auditoría. *(Nota: Este actor está planificado para una futura implementación y se incluye en la arquitectura como previsión técnica, pero se encuentra fuera del alcance del MVP actual).* |
| Sistema | Actor automático que envía correos electrónicos en eventos clave (radicación, cambio de estado, contraseña autogenerada). |

## 2.2 Diagrama general de casos de uso

![Vista de Casos de Uso](../../../diagramas/arquitectura/1-vista-casos-uso.png)

El diagrama completo se basa en la definición de la Carpeta de Diagramas de Arquitectura (6). Resumidamente, los actores se relacionan con los 8 casos de uso del sistema y con las relaciónes de inclusión/extensión hacia el sistema.

## 2.3 Casos de uso arquitectonicamente significativos

Los siguientes casos de uso son significativos para la arquitectura porque impactan decisiones de diseño, integraciones o mecanismos concurrentes.

| ID | Caso de Uso | Impacto arquitectónico |
|---|---|---|
| CU-01 | Gestionar Registro Cliente | Trigger automático desde radicar PQRS anónimo. Genera clave temporal cifrada con BCrypt. |
| CU-02 | Autenticarse (Login) | JWT mas Roles. Punto de entrada de seguridad para Cliente y Gestor. Justifica el módulo shared/security. |
| CU-03 | Radicar PQRS | Almacena PDF en NAS (no en BD), genera radicado único, dispara correo asíncrono. Justifica el adapter NAS y el envio asíncrono. |
| CU-05 | Gestionar Bandeja Entrada | Paginación y filtros sobre miles de PQRS. Requiere indices en BD y consultas optimizadas. |
| CU-06 | Tramitar PQRS | Persiste cambios de estado con justificación. Genera entradas en la tabla trámite (log de negocio) y en auditoría (log técnico generado por AOP). |
| CU-07 | Generar Reportes PDF | Render server-side de PDF (JasperReports o iText). Plantilla parametrizable. Descarga directa al navegador del Gestor. |

El listado completo de los 8 casos de uso, con sus especificaciones detalladas, vive en la carpeta `docs/casos-de-uso/` del repositorio.
