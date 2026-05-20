# 7. Product Backlog priorizado

---

## Backlog priorizado

| ID | Epic | User Story | Prioridad (MoSCoW) | Valor de Negocio | Estimación (Fibonacci) | Criterios de Aceptación | Dependencias | Responsable | Estado | Sprint Asignado |
|---|---|---|---|---|---|---|---|---|---|---|
| HU-01 | App Móvil | Como cliente, quiero radicar una PQRS adjuntando un anexo PDF para dejar soporte de mi solicitud. | Must Have | Alto | 5 | - Formulario de radicación completo.<br>- Carga de archivo PDF opcional.<br>- Validar peso (≤ 5 MB) y formato (.pdf) del anexo. | Ninguna | Equipo Dev | Pendiente | Sprint 1 |
| HU-02 | App Móvil | Como sistema, quiero registrar automáticamente al cliente si no existe durante la radicación para agilizar el proceso. | Must Have | Alto | 2 | - Validar existencia por número de identificación.<br>- Insertar cliente en BD si no existe.<br>- Generar contraseña aleatoria con BCrypt. | HU-01 | Equipo Dev | Pendiente | Sprint 1 |
| HU-03 | App Móvil | Como cliente, quiero autenticarme en la App con mi identificación y contraseña para acceder a mis radicados. | Must Have | Alto | 3 | - Validar credenciales contra BD.<br>- Iniciar sesión segura con JWT.<br>- Restringir acceso al rol `cliente`. | Ninguna | Equipo Dev | Pendiente | Sprint 1 |
| HU-04 | App Móvil | Como cliente, quiero consultar mi historial de radicados para conocer el estado de mis PQRS. | Must Have | Alto | 2 | - Mostrar listado de PQRS del cliente logueado.<br>- Mostrar ID, fecha, tipo, estado y justificación.<br>- Ordenado por fecha descendente. | HU-03 | Equipo Dev | Pendiente | Sprint 1 |
| HU-05 | App Móvil | Como cliente, quiero filtrar mis radicados por número de radicado para encontrar una solicitud específica rápidamente. | Should Have | Medio | 1 | - Filtro de búsqueda funcional en la vista de historial.<br>- Resultado acotado al cliente en sesión. | HU-04 | Equipo Dev | Pendiente | Sprint 2 |
| HU-06 | App Web | Como gestor, quiero autenticarme en la aplicación web para acceder al panel de administración. | Must Have | Alto | 2 | - Validar credenciales contra BD.<br>- Iniciar sesión segura con JWT.<br>- Restringir acceso al rol `gestor`. | Ninguna | Equipo Dev | Pendiente | Sprint 1 |
| HU-07 | App Web | Como gestor, quiero consultar la bandeja de radicados para ver todas las PQRS registradas en el sistema. | Must Have | Alto | 2 | - Mostrar listado general paginado de todas las PQRS.<br>- Mostrar toda la información relevante de cada PQRS. | HU-06 | Equipo Dev | Pendiente | Sprint 1 |
| HU-08 | App Web | Como gestor, quiero filtrar la bandeja de radicados por tipo y estado para organizar mi trabajo de gestión. | Should Have | Medio | 1 | - Filtros combinados (Tipo + Estado) funcionales en la vista general. | HU-07 | Equipo Dev | Pendiente | Sprint 2 |
| HU-09 | App Web | Como gestor, quiero descargar el anexo de una PQRS para revisar la evidencia enviada por el cliente. | Must Have | Alto | 2 | - Botón de descarga funcional que obtenga el PDF del servidor.<br>- Requerido antes de poder tramitar (HU-10). | HU-07 | Equipo Dev | Pendiente | Sprint 1 |
| HU-10 | App Web | Como gestor, quiero gestionar el estado de una PQRS ingresando una justificación para dar trámite a la solicitud. | Must Have | Alto | 2 | - Permitir cambio de estado (Nuevo, En proceso, Resuelto, Rechazado).<br>- Requerir justificación obligatoria (mínimo 10 caracteres). | HU-07, HU-09 | Equipo Dev | Pendiente | Sprint 1 |
| HU-11 | App Web | Como gestor, quiero generar un reporte en PDF de los radicados (consultados/filtrados) para tener un registro exportable. | Should Have | Medio | 5 | - Generar archivo PDF con la tabla visible.<br>- Excluir columna de link/anexo en el PDF.<br>- Incluir encabezado con fecha y total de PQRS. | HU-07, HU-08 | Equipo Dev | Pendiente | Sprint 2 |
| HU-12 | Notificación | Como sistema, quiero enviar un correo de confirmación al cliente tras radicar una PQRS para informarle su número de radicado y credenciales. | Must Have | Alto | 5 | - Enviar correo con plantilla definida.<br>- Incluir N° de radicado y contraseña autogenerada (si fue cliente nuevo).<br>- Envío asíncrono no bloqueante. | HU-01, HU-02 | Equipo Dev | Pendiente | Sprint 1 |

---

## Resumen por Sprint

| Sprint | Historias | Cantidad HU | Puntos Totales |
| :--- | :--- | :---: | :---: |
| **Sprint 1** | HU-01, HU-02, HU-03, HU-04, HU-06, HU-07, HU-09, HU-10, HU-12 | 9 | 25 SP |
| **Sprint 2** | HU-05, HU-08, HU-11 | 3 | 7 SP |
| **Total** | | **12 HU** | **32 SP** |

> **Nota de capacidad**: la capacidad estimada del equipo es de 12.4 SP/sprint (`5-Capacidad-de-Equipo.md`). Sprint 1 está ligeramente sobre capacidad nominal (25 vs. 24.8) — manejable redistribuyendo dedicación dentro del rango ±5%. Sprint 2 está holgado (7 vs 12.4) para absorber bugs o ajustes residuales de Sprint 1.

---

## Mejoras Post-MVP (fuera del compromiso del MVP)

Las 5 funcionalidades adicionales identificadas en [`1-Funcionalidades.md`](./1-Funcionalidades.md) (#13 Recuperar Contraseña, #14 Cambiar Contraseña, #15 Cerrar Sesión, #16 Notificación de Cambio de Estado, #17 Registro Manual) **no forman parte del backlog priorizado del MVP**. Entrarán al backlog cuando el equipo planifique sprints posteriores al MVP.
