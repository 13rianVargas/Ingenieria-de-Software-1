# 6. Especificación de Casos de Uso

Esta sección detalla los 7 Casos de Uso del MVP (CU-01 a CU-07) y conserva como referencia post-MVP el CU-08 (marcado fuera de alcance).

---

## CU-01: Gestionar Registro de Cliente

### 1. Descripción

Permite registrar automáticamente a un ciudadano en el sistema cuando radica una PQRS por primera vez y aún no existe en la base de datos. **En el MVP no hay registro manual independiente:** el registro ocurre exclusivamente como `include` desde CU-03 (Radicar PQRS), sin pantalla "Registrarse" separada. El contexto del proyecto lo permite ("validar la existencia del Cliente en la base de datos; en caso de no existir, el sistema deberá registrarlo").

### 2. Actores

* **Cliente:** Persona natural cuya identificación no está aún en la base de datos.
* **Sistema:** Envía el correo electrónico con las credenciales autogeneradas.

### 3. Precondiciones

* CU-03 (Radicar PQRS) está en ejecución y el flujo detectó que el número de identificación no existe.
* Los datos personales (tipo y número de identificación, nombre, correo, teléfono) ya fueron capturados en el formulario de radicación de CU-03.
* El dispositivo tiene conexión a internet.

### 4. Flujo Principal (Registro Automático durante Radicación)

1. CU-03 detecta que el número de identificación del usuario no existe en la base de datos.
2. El sistema valida los datos personales recibidos en el payload de la PQRS (campos no vacíos, formato de correo, formato de teléfono).
3. El sistema almacena el nuevo usuario con rol `cliente`.
4. El sistema autogenera una contraseña segura (mínimo 6 caracteres, 1 mayúscula, 1 minúscula, 1 número) y la asocia a la cuenta (hash BCrypt).
5. El Sistema envía un correo electrónico al Cliente con sus credenciales de acceso y el número de radicado de la PQRS.
6. El control regresa a CU-03 (paso 7 del Flujo Principal de CU-03) sin interrumpir la radicación.

### 5. Flujos Alternativos

* **Flujo Excepción 1 (Cliente ya registrado):**
    En el paso 1, si el sistema detecta que el correo o número de identificación ya existe asociado a otra cuenta, **no** crea un nuevo registro. El flujo continúa en CU-03 reutilizando los datos del usuario existente. No se envía correo de credenciales.

* **Flujo Excepción 2 (Falla de persistencia):**
    En el paso 3, si la inserción en la base de datos falla, el sistema aborta la radicación completa (rollback de CU-03) e informa al usuario que "No fue posible completar el registro. Intente más tarde." El error queda registrado en `auditoria`.

### 6. Diagrama del Caso de Uso

En el diagrama de vista de casos de uso (`docs/diagramas/arquitectura/1-vista-casos-uso.puml`, render PNG en [`../diagramas/arquitectura/1-vista-casos-uso.png`](../diagramas/arquitectura/1-vista-casos-uso.png)) CU-01 aparece exclusivamente como destino del `<<include>>` desde CU-03. No hay flecha directa del actor Cliente hacia CU-01.

### 7. Fuera de Alcance MVP

El registro manual desde una pantalla independiente "Registrarse" en la App Móvil queda **fuera del alcance del MVP**. El mockup existente en `Taller-4/mockup/Registro.html` se conserva como referencia histórica para una posible iteración futura post-MVP, pero **no se implementa** en la entrega actual ni se traza en RF/diagramas del proyecto.

Decisión tomada para reducir alcance de implementación de software y enfocar el equipo en el flujo crítico de radicación. El contexto original del cliente lo permite explícitamente.

---

## CU-02: Autenticarse en el Sistema

### 1. Descripción
Permite a los usuarios (Clientes en la App Móvil y Gestores en la Aplicación Web) acceder de forma segura a sus respectivas cuentas para realizar operaciones en el sistema.

### 2. Actores
* **Cliente:** Actor que ingresa a la App Móvil.
* **Gestor de PQRS:** Actor que ingresa a la Aplicación Web.

### 3. Precondiciones
* El Cliente debe haber sido registrado previamente de forma automática durante una radicación (CU-01) y poseer sus credenciales recibidas por correo.
* El Gestor de PQRS debe tener una cuenta administrativa previamente creada en el módulo de seguridad.

### 4. Flujo Principal (Autenticación del Cliente)
1. El Cliente abre la App Móvil.
2. Selecciona la opción "Iniciar Sesión".
3. El sistema muestra los campos: "Número de Identificación" y "Contraseña".
4. El Cliente ingresa sus datos y presiona "Ingresar".
5. El sistema cifra la contraseña ingresada y la compara con la almacenada en la base de datos de SuperMarket.
6. El sistema valida las credenciales y el estado activo del usuario.
7. El sistema genera un token de sesión (autenticación exitosa).
8. El sistema redirige al Cliente a su pantalla de inicio (Historial de Radicados).

### 5. Flujos Alternativos

*   **Flujo Alternativo 1 (Autenticación del Gestor en Web):**
    1. El Gestor ingresa a la URL de la Aplicación Web.
    2. El sistema despliega un formulario de inicio de sesión (Usuario y Contraseña).
    3. El Gestor ingresa sus datos.
    4. El sistema valida que el usuario sea administrador y tenga permisos activos.
    5. Si es correcto, el sistema le concede acceso y lo redirige a la Bandeja de Radicados General.
*   **Flujo Excepción 1 (Credenciales Inválidas):**
    En el paso 6, si la contraseña es incorrecta o el usuario no existe, el sistema no concede acceso y despliega un mensaje de error: "Usuario o contraseña incorrectos", invitando al usuario a volver a intentar o a recuperar su contraseña.

### 6. Diagrama del Caso de Uso

CU-02 aparece en el diagrama general de casos de uso ([`../diagramas/arquitectura/1-vista-casos-uso.png`](../diagramas/arquitectura/1-vista-casos-uso.png)) accesible tanto por el actor Cliente como por el actor Gestor.
---

## CU-03: Radicar PQRS

### 1. Descripción
Es el proceso central (core) mediante el cual un Cliente ingresa una nueva Petición, Queja, Reclamo o Sugerencia en la App Móvil, pudiendo adjuntar documentación de soporte (PDF) de forma opcional, y el sistema genera automáticamente un número de radicado y lo notifica por correo electrónico.

### 2. Actores
* **Cliente:** Actor que inicia la radicación.
* **Sistema:** Actor encargado de enviar el correo electrónico confirmando el registro.

### 3. Precondiciones
* El Cliente debe estar dentro de la App Móvil, preferiblemente (pero no obligatoriamente) autenticado.
* El dispositivo debe tener conexión a internet estable para la subida del documento anexo (PDF).

### 4. Flujo Principal (Cliente Autenticado)
1. El Cliente (autenticado) selecciona la opción "Radicar Nueva PQRS".
2. El sistema despliega un formulario. Los datos del Cliente (Identificación, Nombre, Correo, Teléfono) ya aparecen autocompletados e inmodificables.
3. El Cliente diligencia la información de la PQRS (Tipo de radicado: Petición, Queja, Reclamo, Sugerencia) y los Comentarios (descripción de la situación).
4. El Cliente selecciona la opción "Adjuntar Anexo" y carga un archivo PDF desde su dispositivo móvil.
5. El Cliente presiona el botón "Radicar".
6. El sistema valida los datos obligatorios y el formato del archivo adjunto (.pdf).
7. El sistema genera un "Número de Radicado" único de forma automática y registra la "Fecha del radicado" con el timestamp actual.
8. El sistema guarda la PQRS en estado "Nuevo" y almacena el PDF en el servidor.
9. El Sistema dispara el envío de un correo electrónico de confirmación al Cliente.
10. El sistema notifica al Cliente en pantalla que la PQRS fue radicada exitosamente, mostrando el número de radicado.

### 5. Flujos Alternativos

*   **Flujo Alternativo 1 (Cliente No Autenticado/Anónimo):**
    1. El usuario abre la App sin loguearse y selecciona "Radicar PQRS".
    2. El sistema despliega el formulario completo, obligando al usuario a digitar manualmente sus datos (Identificación, Nombre, Correo, Teléfono) junto con la información de la PQRS.
    3. Al presionar "Radicar", el sistema verifica si el usuario no existe. De ser así, se ejecuta un *include* al CU-01 (Registro Automático).
    4. Luego de registrar al usuario o validar su existencia, el flujo retoma en el paso 7 del Flujo Principal.

*   **Flujo Excepción 1 (Error al cargar el Anexo):**
    En el paso 6, si el usuario intenta adjuntar un archivo que no sea PDF o supera el límite de peso permitido, el sistema detiene la radicación y muestra un mensaje de error: "Formato no válido. Solo se admiten archivos PDF de máximo 5MB."

### 6. Diagrama del Caso de Uso

CU-03 es el caso de uso central del MVP. En el diagrama general ([`../diagramas/arquitectura/1-vista-casos-uso.png`](../diagramas/arquitectura/1-vista-casos-uso.png)) aparece accesible directamente por el actor Cliente y con relación `<<include>>` hacia CU-01 (Registro Automático).
---

## CU-04: Consultar PQRS Propias

### 1. Descripción
Permite a un Cliente autenticado visualizar el historial de todas las Peticiones, Quejas, Reclamos o Sugerencias (PQRS) que ha radicado a través del sistema, y buscar una solicitud específica utilizando filtros (ej. número de radicado).

### 2. Actores
* **Cliente:** Persona natural que consulta su historial.

### 3. Precondiciones
* El Cliente debe haber iniciado sesión exitosamente en la App Móvil (CU-02).
* El Cliente debe haber radicado al menos una PQRS previamente.

### 4. Flujo Principal (Listado General)
1. El Cliente inicia sesión y accede al panel principal de la App.
2. Selecciona la opción "Mis Radicados".
3. El sistema consulta en la Base de Datos todas las PQRS asociadas al número de identificación del Cliente.
4. El sistema presenta el listado ordenado cronológicamente (más recientes primero).
5. El Cliente visualiza la siguiente información por cada registro: Número de radicado, Fecha, Tipo (PQRS), Comentarios, enlace al Anexo, Estado actual (Nuevo, En proceso, Resuelto, Rechazado) y la Justificación del estado si aplica.

### 5. Flujos Alternativos

*   **Flujo Alternativo 1 (Filtrar por Número de Radicado):**
    1. El Cliente se encuentra en la pantalla "Mis Radicados".
    2. Ingresa un número específico en la barra de búsqueda o filtro "Número de Radicado".
    3. Presiona el botón de buscar.
    4. El sistema realiza una consulta a la BD filtrando el resultado por el identificador ingresado.
    5. El sistema muestra únicamente el registro coincidente, ocultando el resto del historial.
*   **Flujo Excepción 1 (Sin Historial de PQRS):**
    En el paso 3, si la base de datos no arroja resultados, el sistema muestra un mensaje amigable al Cliente: "Aún no tienes radicados registrados en el sistema.", y ofrece un botón de acceso rápido a "Radicar Nueva PQRS".

### 6. Diagrama del Caso de Uso

CU-04 aparece en el diagrama general ([`../diagramas/arquitectura/1-vista-casos-uso.png`](../diagramas/arquitectura/1-vista-casos-uso.png)) accesible por el actor Cliente y dependiente de CU-02 (autenticación).
---

## CU-05: Gestionar Bandeja de Entrada

### 1. Descripción
Proporciona al administrador del sistema (Gestor de PQRS) la funcionalidad para visualizar, desde la Aplicación Web, el listado general de todas las peticiones, quejas, reclamos o sugerencias ingresadas por todos los Clientes, y aplicar filtros avanzados para organizarlas.

### 2. Actores
* **Gestor de PQRS:** Usuario administrativo que atiende las solicitudes de la bandeja.

### 3. Precondiciones
* El Gestor debe estar autenticado (CU-02) con rol `gestor` en la Aplicación Web.
* El sistema debe contar con al menos una PQRS registrada en la base de datos para mostrar.

### 4. Flujo Principal (Listado General)
1. El Gestor ingresa a la Aplicación Web y se autentica correctamente.
2. El sistema lo redirige al panel principal (Dashboard).
3. Selecciona la opción "Bandeja de Radicados".
4. El sistema consulta en la Base de Datos todas las PQRS registradas.
5. El sistema presenta el listado general en formato de tabla, mostrando columnas de: Número de radicado, Fecha, Tipo (PQRS), Comentarios, Anexo (PDF), Estado y Justificación.
6. El Gestor puede paginar los resultados si la cantidad excede el límite visible.

### 5. Flujos Alternativos

*   **Flujo Alternativo 1 (Filtrado Combinado):**
    1. El Gestor de PQRS, estando en la Bandeja, visualiza los filtros de "Tipo de radicado" (Petición, Queja, Reclamo, Sugerencia) y "Estado" (Nuevo, En proceso, Resuelto, Rechazado).
    2. El Gestor selecciona uno o ambos filtros combinados.
    3. Hace clic en "Buscar/Filtrar".
    4. El sistema realiza una consulta a la BD aplicando los parámetros seleccionados.
    5. El sistema actualiza la tabla y muestra únicamente los resultados coincidentes.
*   **Flujo Excepción 1 (Sin Resultados para el Filtro):**
    En el paso 4 del Flujo Alternativo 1, si la base de datos no arroja registros coincidentes con los filtros aplicados, la tabla se vacía y muestra el mensaje: "No se encontraron radicados que coincidan con los criterios de búsqueda".

### 6. Diagrama del Caso de Uso

CU-05 aparece en el diagrama general ([`../diagramas/arquitectura/1-vista-casos-uso.png`](../diagramas/arquitectura/1-vista-casos-uso.png)) accesible por el actor Gestor y dependiente de CU-02 (autenticación con rol `gestor`).
---

## CU-06: Tramitar PQRS

### 1. Descripción
Permite a un Gestor de PQRS, desde la Aplicación Web, procesar una petición, queja, reclamo o sugerencia específica que ha ingresado a la bandeja. Esto implica descargar el anexo (PDF), actualizar el estado de la solicitud y justificar la decisión.

> **Nota MVP**: la notificación automática al Cliente sobre el cambio de estado corresponde a la funcionalidad #16 (`1-Funcionalidades.md`), clasificada como **mejora post-MVP**. CU-06 en el MVP termina con la persistencia del cambio de estado; el envío del correo entra al alcance cuando se aborde #16.

### 2. Actores
* **Gestor de PQRS:** Actor principal que evalúa y tramita.

### 3. Precondiciones
* El Gestor de PQRS debe estar autenticado en la Aplicación Web.
* El radicado a tramitar no debe encontrarse en estado "Resuelto" o "Rechazado" (estados finales).
* El Gestor debe visualizar la bandeja de radicados (CU-05).

### 4. Flujo Principal (Actualizar Estado y Justificar)
1. El Gestor de PQRS ingresa a la Bandeja de Radicados.
2. Identifica una solicitud en estado "Nuevo".
3. Hace clic sobre la opción "Ver detalle" y el sistema le muestra la información completa del radicado.
4. El Gestor hace clic en el enlace del "Anexo".
5. El sistema descarga o abre el documento PDF adjunto por el Cliente en el momento de la radicación.
6. El Gestor de PQRS analiza el contenido y determina el siguiente paso.
7. El Gestor selecciona la opción "Gestionar Estado".
8. El sistema despliega un menú desplegable con las opciones "Nuevo", "En proceso", "Resuelto" y "Rechazado", junto con un campo de texto obligatorio "Justificación".
9. El Gestor cambia el estado (ej. a "En proceso") y redacta la respuesta/justificación.
10. Hace clic en "Guardar Cambios".
11. El sistema actualiza el registro en la BD y almacena la justificación.
12. El sistema muestra un mensaje de éxito: "Estado actualizado correctamente".

### 5. Flujos Alternativos

*   **Flujo Excepción 1 (Intento sin Justificación):**
    En el paso 9, si el Gestor intenta actualizar a un estado distinto de "Nuevo" (como "Rechazado" o "Resuelto") pero deja en blanco el campo "Justificación", el sistema no le permite avanzar, marcando el campo en rojo con la advertencia: "La justificación es obligatoria para cambiar el estado."

### 6. Diagrama del Caso de Uso

CU-06 aparece en el diagrama general ([`../diagramas/arquitectura/1-vista-casos-uso.png`](../diagramas/arquitectura/1-vista-casos-uso.png)) accesible por el actor Gestor con relación de extensión hacia el flujo de notificación al Cliente.
---

## CU-07: Generar Reportes

### 1. Descripción
Permite al Gestor de PQRS, desde la Aplicación Web, exportar el listado de peticiones, quejas, reclamos y sugerencias consultadas o filtradas a un documento PDF. Este reporte sirve como registro y soporte de la gestión realizada, excluyendo información innecesaria como los enlaces a los anexos.

### 2. Actores
* **Gestor de PQRS:** Usuario administrativo que solicita la exportación.

### 3. Precondiciones
* El Gestor de PQRS debe estar autenticado en la Aplicación Web (CU-02).
* El Gestor debe encontrarse en la interfaz "Bandeja de Radicados" (CU-05).
* La tabla de resultados debe contener al menos un registro (filtrado o general) para exportar.

### 4. Flujo Principal (Generar Reporte de Bandeja)
1. El Gestor de PQRS se encuentra visualizando la Bandeja General con todos los radicados.
2. Hace clic en el botón "Generar Reporte PDF".
3. El sistema compila la información visible en la tabla de resultados (Número de Radicado, Fecha, Tipo, Comentarios, Estado, Justificación).
4. El sistema excluye la columna de enlaces a los Anexos.
5. El sistema utiliza una librería interna de generación PDF (ej. iText, JasperReports) y procesa los datos en un formato estructurado.
6. El navegador descarga automáticamente el archivo PDF generado en el dispositivo local del Gestor.

### 5. Flujos Alternativos

*   **Flujo Alternativo 1 (Reporte con Filtros Aplicados):**
    1. El Gestor aplica un filtro en la bandeja (ej. Estado "En proceso" o Tipo "Queja") según el CU-05.
    2. La tabla muestra los resultados restringidos por los filtros.
    3. Al hacer clic en "Generar Reporte PDF", el sistema procesa **únicamente** los registros que cumplen las condiciones del filtro en ese momento.
    4. Se genera el documento PDF, cuyo encabezado o subtítulo puede indicar los criterios filtrados (ej. "Reporte de Radicados - Quejas en Estado 'En Proceso'").
*   **Flujo Excepción 1 (Bandeja Vacía):**
    Si el Gestor aplica filtros que no devuelven resultados (la tabla está vacía) y hace clic en "Generar Reporte PDF", el sistema bloquea la acción o muestra una advertencia: "No hay registros disponibles para exportar con los filtros actuales."

### 6. Diagrama del Caso de Uso

CU-07 aparece en el diagrama general ([`../diagramas/arquitectura/1-vista-casos-uso.png`](../diagramas/arquitectura/1-vista-casos-uso.png)) accesible por el actor Gestor y dependiente de CU-05 (visualización de la bandeja).
---

## CU-08: Gestionar Seguridad de la Cuenta

> **⚠ Fuera de Alcance MVP.** Este caso de uso cubre HU-13 (Recuperar Contraseña), HU-14 (Cambiar Contraseña) y HU-15 (Cerrar Sesión), todas clasificadas como *"Supuesto de mejora"* en [`1-Funcionalidades.md`](../1-Funcionalidades.md). Se conserva la especificación como referencia para iteraciones post-MVP, pero **no se implementa** en la entrega actual ni se traza en el SRS principal.
>
> El MVP cubre 7 Casos de Uso (CU-01 a CU-07). CU-08 entra al alcance cuando el equipo aborde las funcionalidades 13, 14 y 15 en un sprint posterior.

### 1. Descripción
Permite a los usuarios (Cliente o Gestor) administrar las credenciales de acceso a sus cuentas, brindándoles opciones para recuperar una contraseña olvidada, cambiar la contraseña autogenerada por una de su preferencia, y cerrar sesión de manera segura.

### 2. Actores
* **Cliente:** Actor que administra su acceso desde la App Móvil o Web.
* **Gestor de PQRS:** Actor que administra su acceso desde la Aplicación Web.
* **Sistema:** Actor encargado de enviar el correo electrónico de recuperación de contraseña.

### 3. Precondiciones
* Para *Cambiar Contraseña* y *Cerrar Sesión*, el usuario debe estar autenticado en el sistema (CU-02).
* Para *Recuperar Contraseña*, el usuario debe estar registrado en el sistema pero no autenticado.

### 4. Flujo Principal (Cambiar Contraseña)
1. El usuario (Cliente o Gestor) inicia sesión exitosamente en la App o Aplicación Web.
2. Accede a la opción "Mi Perfil" o "Configuración de Cuenta".
3. Selecciona la opción "Cambiar Contraseña".
4. El sistema despliega un formulario con tres campos: "Contraseña Actual", "Nueva Contraseña" y "Confirmar Nueva Contraseña".
5. El usuario diligencia los tres campos.
6. El sistema verifica que la contraseña actual sea correcta (comparando el hash con la BD).
7. El sistema verifica que la nueva contraseña cumpla con las políticas de seguridad (mínimo 6 caracteres, 1 mayúscula, 1 minúscula, 1 número) y coincida con el campo de confirmación.
8. El sistema cifra y actualiza la nueva contraseña en la base de datos.
9. El sistema muestra un mensaje de éxito: "Su contraseña ha sido actualizada correctamente".

### 5. Flujos Alternativos

*   **Flujo Alternativo 1 (Recuperar Contraseña Olvidada):**
    1. El usuario, desde la pantalla de Login, selecciona "Olvidé mi contraseña".
    2. El sistema solicita el "Número de Identificación" o "Correo Electrónico".
    3. El usuario ingresa el dato y presiona "Recuperar".
    4. El sistema busca al usuario en la BD. Si existe, genera un token temporal o una nueva contraseña autogenerada (como en el CU-01).
    5. El Sistema envía un correo electrónico al usuario con las instrucciones o la nueva credencial.
    6. El sistema informa en pantalla: "Se han enviado instrucciones a su correo electrónico registrado."
*   **Flujo Alternativo 2 (Cerrar Sesión):**
    1. El usuario (Cliente o Gestor), estando autenticado, hace clic en "Cerrar Sesión" o "Salir" desde el menú principal de la App/Web.
    2. El sistema invalida el token de sesión actual (o la cookie).
    3. El sistema redirige al usuario a la pantalla pública de Login o inicio.
*   **Flujo Excepción 1 (Contraseñas no coinciden al cambiar):**
    En el paso 7 del flujo principal, si la "Nueva Contraseña" y "Confirmar Nueva Contraseña" son diferentes, o no cumplen las políticas de complejidad (ej. muy corta, sin mayúscula), el sistema impide el cambio y muestra: "Las contraseñas no coinciden o no cumplen los requisitos de seguridad (mín. 6 caracteres, 1 mayúscula, 1 minúscula, 1 número)."

### 6. Diagrama del Caso de Uso

CU-08 **no aparece en el diagrama general del MVP** ([`../diagramas/arquitectura/1-vista-casos-uso.png`](../diagramas/arquitectura/1-vista-casos-uso.png)) por estar fuera de alcance. Se incorporará en el diagrama cuando el equipo planifique el sprint que aborde HU-13/14/15.

