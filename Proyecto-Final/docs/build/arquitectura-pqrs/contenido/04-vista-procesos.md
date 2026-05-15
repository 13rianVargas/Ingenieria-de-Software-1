# 4. Vista de Procesos

La vista de procesos describe el comportamiento dinamico del sistema en tiempo de ejecucion: secuencias entre componentes, interacciones entre actores y mecanismos asincronos.

## 4.1 Proceso: Radicar PQRS

Diagrama de secuencia: `diagramas/arquitectura/3-vista-procesos-radicar.puml`.

Flujo principal:

1. El Cliente envia el formulario con datos y PDF adjunto via POST /api/pqrs (multipart/form-data).
2. Si el Cliente esta autenticado: shared/security valida el JWT y resuelve el userId.
3. Si el Cliente esta anonimo: el dominio crea un usuario automatico con clave aleatoria, cifrada con BCrypt (CU-01).
4. El PDF se persiste en NAS mediante el adapter pqrs-archivos. En BD solo queda la metadata (ruta, tamaño, mime).
5. Se genera el numero de radicado con formato PQRS-YYYY-NNNNNN y se persiste la PQRS con estado nuevo.
6. La respuesta 201 Created se devuelve inmediatamente al cliente con el numero de radicado y la fecha.

Rama asincrona (no bloquea la respuesta UI):

7. pqrs-notificaciones envia un correo al cliente con el numero de radicado y, si fue cliente nuevo, la clave autogenerada.
8. Si el SMTP falla, el sistema reintenta con backoff usando la tabla notificacion como cola.

## 4.2 Proceso: Tramitar PQRS

Diagrama de secuencia: `diagramas/arquitectura/3-vista-procesos-tramitar.puml`.

Flujo principal:

1. El Gestor abre la Bandeja con filtros opcionales: GET /api/pqrs?estado=nuevo.
2. shared/security valida que el rol del usuario sea gestor.
3. El dominio consulta el repositorio y devuelve una lista paginada.
4. El Gestor selecciona una PQRS, cambia su estado e ingresa la justificacion (obligatoria).
5. PUT /api/pqrs/{id}/tramitar envia el cambio.
6. El dominio valida que la justificacion no este vacia y actualiza pqrs.estado.
7. Se inserta un registro en la tabla tramite con estado_anterior, estado_nuevo, justificacion, gestor_id y timestamp.
8. shared/auditoria (AOP) registra la operacion en la tabla auditoria.

Rama asincrona:

9. pqrs-notificaciones avisa al cliente del cambio de estado con la justificacion.

## 4.3 Proceso: Generar Reporte PDF

Diagrama de secuencia: `diagramas/arquitectura/3-vista-procesos-reporte.puml`.

Flujo principal:

1. El Gestor aplica filtros opcionales sobre la bandeja y hace click en Exportar PDF.
2. POST /api/reportes/bandeja envia los filtros aplicados.
3. El dominio consulta las PQRS con join a tramite para incluir la justificacion del estado actual.
4. Se invoca el adapter pqrs-reportes (JasperReports o iText) con la plantilla y el dataset.
5. La respuesta lleva Content-Type application/pdf y Content-Disposition attachment, forzando la descarga directa en el navegador del Gestor.

La plantilla del PDF es parametrizable: logo, colores y nombre corporativo se cargan desde la BD, permitiendo cambios sin recompilar el codigo.
