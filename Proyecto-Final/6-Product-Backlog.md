### Product Backlog

| ID | Epic | User Story | Prioridad (MoSCoW) | Valor de Negocio | Estimación (Fibonacci) | Criterios de Aceptación | Dependencias | Responsable | Estado | Sprint Asignado |
|---|---|---|---|---|---|---|---|---|---|---|
| HU-01 | App Móvil | Como cliente, quiero radicar una PQRS adjuntando un anexo PDF para dejar soporte de mi solicitud. | Must Have | Alto | 5 | - Formulario de radicación completo.<br>- Carga de archivo PDF opcional/obligatoria.<br>- Validar peso y formato del PDF. | Ninguna | Equipo Dev | Pendiente | Sprint 1 |
| HU-02 | App Móvil | Como sistema, quiero registrar automáticamente al cliente si no existe durante la radicación para agilizar el proceso. | Must Have | Alto | 2 | - Validar existencia por número de identificación.<br>- Insertar cliente en BD si no existe.<br>- Generar contraseña aleatoria. | Ninguna | Equipo Dev | Pendiente | Sprint 1 |
| HU-03 | App Móvil | Como cliente, quiero autenticarme en la App con mi identificación y contraseña para acceder a mis radicados. | Must Have | Alto | 3 | - Validar credenciales contra BD.<br>- Iniciar sesión segura. | Ninguna | Equipo Dev | Pendiente | Sprint 1 |
| HU-04 | App Móvil | Como cliente, quiero consultar mi historial de radicados para conocer el estado de mis PQRS. | Must Have | Alto | 3 | - Mostrar listado de PQRS del cliente logueado.<br>- Mostrar ID, fecha, tipo, estado y justificación. | HU-03 | Equipo Dev | Pendiente | Sprint 1 |
| HU-05 | App Móvil | Como cliente, quiero filtrar mis radicados por número de radicado para encontrar una solicitud específica rápidamente. | Should Have | Medio | 1 | - Filtro de búsqueda funcional en la vista de historial. | HU-04 | Equipo Dev | Pendiente | Sprint 2 |
| HU-06 | App Web | Como gestor, quiero autenticarme en la aplicación web para acceder al panel de administración. | Must Have | Alto | 2 | - Validar credenciales de gestor contra BD.<br>- Iniciar sesión segura. | Ninguna | Equipo Dev | Pendiente | Sprint 2 |
| HU-07 | App Web | Como gestor, quiero consultar la bandeja de radicados para ver todas las PQRS registradas en el sistema. | Must Have | Alto | 3 | - Mostrar listado general de todas las PQRS.<br>- Mostrar toda la información relevante de la PQRS. | HU-06 | Equipo Dev | Pendiente | Sprint 2|
| HU-08 | App Web | Como gestor, quiero filtrar la bandeja de radicados por tipo y estado para organizar mi trabajo de gestión. | Should Have | Medio | 2 | - Filtros de búsqueda combinados funcionales en la vista general. | HU-07 | Equipo Dev | Pendiente | Sprint 2 |
| HU-09 | App Web | Como gestor, quiero descargar el anexo de una PQRS para revisar la evidencia enviada por el cliente. | Should Have | Alto | 2 | - Botón de descarga funcional que obtenga el PDF del servidor. | HU-07 | Equipo Dev | Pendiente | Sprint 2 |
| HU-10 | App Web | Como gestor, quiero gestionar el estado de una PQRS ingresando una justificación para dar trámite a la solicitud. | Must Have | Alto | 2 | - Permitir cambio de estado (Nuevo, En proceso, Resuelto, Rechazado).<br>- Requerir justificación obligatoria. | HU-07 | Equipo Dev | Pendiente | Sprint 2 |
| HU-11 | App Web | Como gestor, quiero generar un reporte en PDF de los radicados (consultados/filtrados) para tener un registro exportable. | Should Have | Medio | 5 | - Generar archivo PDF con la tabla visible.<br>- Excluir columna de link/anexo en el PDF. | HU-07 | Equipo Dev | Pendiente | Sprint 2-3 |
| HU-12 | Notificación | Como sistema, quiero enviar un correo de confirmación al cliente tras radicar una PQRS para informarle su número de radicado y credenciales. | Must Have | Alto | 5 | - Enviar correo con formato establecido.<br>- Incluir N° de radicado y contraseña autogenerada (si aplica). | HU-01 | Equipo Dev | Pendiente | Sprint 3 |


### Resumen por Sprint

| Sprint | Historias | Puntos Totales | |
| ------ | --------- | -------------- |-------------- |
| Sprint 1 | HU-01, HU-02, HU-03, HU-04 | 12 |  
| Sprint 2 | HU-05, HU-06, HU-07, HU-8, HU-9, HU-10 , HU-11 | 12 |
| Sprint 3 | HU-11, HU-12 | 8 |
| **Total** | **12 HU** | **32 SP** |