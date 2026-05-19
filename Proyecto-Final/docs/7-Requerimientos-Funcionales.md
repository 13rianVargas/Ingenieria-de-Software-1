# Documento de Descripción de los Requerimientos Funcionales

## Control del Documento

| Campo | Descripción |
| :--- | :--- |
| **Nombre del proyecto:** | Sistema de Gestión de PQRS — SuperMarket |
| **Nombre del equipo:** | Fábrica de Desarrollo Konrad |
| **Estado del documento:** | Aprobado |
| **Autores:** | Estudiantes de Ingeniería de Sistemas |

## Historial de Versiones

| Versión | Fecha | Descripción Cambio |
| :--- | :--- | :--- |
| 01 | 12/05/2026 | Creación inicial de los requerimientos funcionales mapeados a los Casos de Uso. |
| 02 | 12/05/2026 | Reestructuración a 12 Requerimientos Funcionales estrictos basados en las 12 funcionalidades principales del sistema, mapeados a los 8 Casos de Uso existentes (Opción 1). |
| 03 | 18/05/2026 | Conversión a formato híbrido: cada RF incluye Historia de Usuario y Criterios de Aceptación además del flujo de eventos detallado. |

---

## 1. Actores del Sistema

| Actor | Descripción | Requerimientos Asociados |
| :--- | :--- | :--- |
| **Cliente (Ciudadano)** | Actor principal. Persona natural que utiliza la App Móvil para registrar, consultar y radicar sus PQRS. | RF-01, RF-03, RF-04, RF-05 |
| **Gestor de PQRS** | Empleado de SuperMarket que utiliza la Aplicación Web para gestionar, tramitar y revisar las solicitudes ingresadas. | RF-06, RF-07, RF-08, RF-09, RF-10, RF-11 |
| **Sistema Notificador** | Actor secundario/automático encargado de disparar eventos como el envío de correos electrónicos y generación de contraseñas. | RF-02, RF-12 |

---

## 2. Glosario de Términos

| Término | Descripción |
| :--- | :--- |
| **PQRS** | Peticiones, Quejas, Reclamos o Sugerencias. Motivo principal del contacto del cliente con SuperMarket. |
| **Radicado** | Número único autogenerado por el sistema utilizado para hacer seguimiento a una PQRS. |
| **Anexo** | Documento complementario (exclusivamente en formato PDF) adjunto a la PQRS por el Cliente. |
| **Estado del Radicado** | Condición en la que se encuentra la PQRS (Nuevo, En proceso, Resuelto, Rechazado). |
| **Bandeja de Entrada** | Vista de la Aplicación Web donde el Gestor visualiza el listado general de todas las PQRS. |

---

## 3. Especificación de Requerimientos Funcionales

### RF-01: Radicar PQRS

**Historia de Usuario:**
> Como Cliente, quiero radicar una nueva PQRS desde la App Móvil con un anexo PDF opcional, para que SuperMarket reciba y atienda mi solicitud con un número de radicado único.

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-01 |
| **Nombre** | Radicar PQRS |
| **Resumen** | Permite diligenciar el formulario e información de la PQRS (tipo, comentarios y anexo en PDF). Si el usuario está autenticado, autocompleta sus datos; sino, se ingresan manualmente. |
| **Actor** | Cliente |
| **Caso de Uso Asociado** | CU-03: Radicar PQRS |
| **Precondición** | El Cliente tiene acceso a la App Móvil. |
| **Postcondición** | La PQRS se guarda con estado "Nuevo", se asigna un radicado único y se almacena el PDF. |

**Criterios de Aceptación:**
- Dado un Cliente autenticado, cuando selecciona "Radicar Nueva PQRS", entonces el formulario aparece con los datos personales precargados e inmodificables.
- Dado un formulario con tipo, comentarios y anexo PDF válidos, cuando el Cliente presiona "Radicar", entonces el sistema genera un radicado con formato `PQRS-YYYY-NNNNNN` y guarda la PQRS con estado "Nuevo".
- Dado un anexo con extensión distinta a `.pdf` o tamaño superior a 5 MB, cuando el Cliente intenta adjuntarlo, entonces el sistema rechaza el archivo y muestra "Formato no válido. Solo se admiten archivos PDF de máximo 5MB."
- Dado un Cliente no autenticado, cuando radica una PQRS, entonces el formulario exige diligenciar los datos personales obligatorios y se desencadena RF-02 si la identificación es nueva.

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Cliente selecciona "Radicar Nueva PQRS". | Despliega formulario. Si está autenticado, autocompleta los datos personales. |
| 2 | El Cliente diligencia la PQRS (Tipo de radicado y Comentarios). | Valida dinámicamente los campos. |
| 3 | El Cliente selecciona "Adjuntar Anexo" y carga un archivo PDF. | Valida que el formato sea estrictamente `.pdf`. |
| 4 | El Cliente presiona el botón "Radicar". | Verifica completitud obligatoria, genera radicado y almacena la PQRS. |

**Caminos Alternativos y Excepciones**

| Sección | Descripción |
| :--- | :--- |
| **Caminos Alternativos** | **Cliente Anónimo:** Si no está logueado, diligencia los datos personales obligatorios manualmente. (Desencadena RF-02). |
| **Caminos de Excepción** | **E-01 - Formato inválido:** Si adjunta un formato diferente, muestra "Formato no válido. Solo se admiten archivos PDF". |

---

### RF-02: Registro Automático de Cliente

**Historia de Usuario:**
> Como Sistema, quiero registrar automáticamente al Cliente cuando radica una PQRS por primera vez, para evitar que el usuario tenga que crear cuenta manualmente antes de poder solicitar atención.

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-02 |
| **Nombre** | Registro Automático de Cliente |
| **Resumen** | Si el cliente no existe en la base de datos al momento de radicar de forma anónima, el sistema lo registra automáticamente en el sistema de usuarios. |
| **Actor** | Sistema Notificador |
| **Caso de Uso Asociado** | CU-01: Gestionar Registro |
| **Precondición** | El Cliente completó exitosamente el formulario de radicación (RF-01) pero su identificación no existe en base de datos. |
| **Postcondición** | El cliente es creado en la BD de usuarios y se autogenera una clave temporal. |

**Criterios de Aceptación:**
- Dado un payload de RF-01 con una identificación que no existe en BD, cuando se desencadena RF-02, entonces se crea un usuario con rol `cliente` y se genera una contraseña aleatoria (mínimo 6 caracteres, 1 mayúscula, 1 minúscula, 1 número).
- Dado un registro exitoso, cuando termina la inserción, entonces se almacena el hash BCrypt de la contraseña, nunca el texto plano.
- Dado un payload con identificación que ya existe, cuando se desencadena RF-02, entonces no se crea registro nuevo y la radicación continúa reutilizando los datos del usuario existente.
- Dado un fallo de persistencia, cuando la inserción falla, entonces la radicación completa (RF-01) hace rollback y se informa al Cliente que el registro no pudo completarse.

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | (Desencadenado por RF-01). | Consulta la identificación en la base de datos y verifica que no existe. |
| 2 | | Inserta un nuevo registro de usuario con los datos personales extraídos de la PQRS. |
| 3 | | Genera una contraseña aleatoria y la asocia al usuario. |

**Caminos Alternativos y Excepciones**

| Sección | Descripción |
| :--- | :--- |
| **Caminos de Excepción** | **E-01 - Falla de Registro:** Si hay un problema de base de datos, aborta la radicación e informa al cliente. |

---

### RF-03: Autenticación de Cliente (Login)

**Historia de Usuario:**
> Como Cliente registrado, quiero ingresar a la App Móvil con mi identificación y la contraseña recibida por correo, para acceder al historial y a las funcionalidades autenticadas del sistema.

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-03 |
| **Nombre** | Autenticación de Cliente |
| **Resumen** | Ingreso a la App Móvil usando el número de identificación y la contraseña (autogenerada enviada al correo o actualizada por él). |
| **Actor** | Cliente |
| **Caso de Uso Asociado** | CU-02: Autenticarse |
| **Precondición** | El cliente debe existir en la base de datos de usuarios de SuperMarket. |
| **Postcondición** | Se establece una sesión activa en el dispositivo móvil. |

**Criterios de Aceptación:**
- Dado un Cliente registrado con credenciales válidas, cuando ingresa identificación y contraseña correctas, entonces el sistema genera un token JWT y redirige a la pantalla principal.
- Dado un Cliente con credenciales incorrectas, cuando intenta autenticarse, entonces el sistema muestra "Usuario o contraseña incorrectos" sin revelar cuál de los dos falló.
- Dado un usuario con rol distinto a `cliente`, cuando intenta autenticarse en la App Móvil, entonces el acceso es denegado aunque las credenciales sean válidas.

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Cliente accede al Login e ingresa su Identificación y Contraseña. | Valida credenciales contra la base de datos y rol de Cliente. |
| 2 | El Cliente presiona "Ingresar". | Genera token de sesión y redirige a la pantalla principal. |

**Caminos Alternativos y Excepciones**

| Sección | Descripción |
| :--- | :--- |
| **Caminos de Excepción** | **E-01 - Datos erróneos:** Muestra mensaje "Usuario o contraseña incorrectos". |

---

### RF-04: Consultar Historial de Radicados

**Historia de Usuario:**
> Como Cliente autenticado, quiero ver el listado completo de las PQRS que he radicado, para conocer el estado actual y el historial de cada una sin tener que llamar a SuperMarket.

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-04 |
| **Nombre** | Consultar Historial de Radicados |
| **Resumen** | Visualización del listado completo de PQRS que el cliente ha radicado en SuperMarket, mostrando sus estados y anexos. |
| **Actor** | Cliente |
| **Caso de Uso Asociado** | CU-04: Consultar PQRS Propias |
| **Precondición** | El Cliente debe estar autenticado (RF-03). |
| **Postcondición** | Se muestra la lista de radicados al Cliente en su App. |

**Criterios de Aceptación:**
- Dado un Cliente autenticado con PQRS radicadas, cuando ingresa a "Historial de PQRS", entonces el sistema lista únicamente las PQRS cuyo `cliente_id` corresponde al usuario en sesión.
- Dado un registro en el listado, cuando se renderiza, entonces incluye número de radicado, fecha, tipo, estado actual y justificación del último cambio de estado.
- Dado un Cliente sin radicados, cuando ingresa a "Historial de PQRS", entonces el sistema muestra un mensaje vacío informativo ("Aún no has radicado PQRS") y no listas vacías sin contexto.
- Dado el listado renderizado, cuando se ordena, entonces aparece de la PQRS más reciente a la más antigua.

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Cliente ingresa a la vista "Historial de PQRS". | Realiza consulta a la base de datos cruzando por la identificación del Cliente. |
| 2 | | Renderiza una lista con número de radicado, fecha, tipo, estado y justificación. |

---

### RF-05: Filtrar Radicados Propios

**Historia de Usuario:**
> Como Cliente, quiero buscar una PQRS específica por su número de radicado dentro de mi historial, para acceder rápidamente al detalle sin desplazarme por toda la lista.

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-05 |
| **Nombre** | Filtrar Radicados Propios |
| **Resumen** | Búsqueda específica dentro del historial de radicados del cliente utilizando el número de radicado como criterio principal. |
| **Actor** | Cliente |
| **Caso de Uso Asociado** | CU-04: Consultar PQRS Propias |
| **Precondición** | El Cliente debe estar en la vista de Historial (RF-04). |
| **Postcondición** | La lista se acota a los radicados coincidentes. |

**Criterios de Aceptación:**
- Dado un Cliente con varios radicados, cuando digita un número de radicado exacto y presiona "Buscar", entonces la lista se acota a la PQRS coincidente.
- Dado un número de radicado que no pertenece al Cliente, cuando intenta filtrar, entonces el sistema no expone resultados de otros clientes (la lista queda vacía).
- Dado un campo de búsqueda vacío, cuando se presiona "Buscar", entonces la lista vuelve a mostrar el historial completo.

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Cliente digita un Número de Radicado en el buscador. | Captura la entrada. |
| 2 | El Cliente presiona "Buscar". | Ejecuta un filtro local o consulta a la base de datos limitando los resultados al número de radicado exacto. |

---

### RF-06: Autenticación de Gestor (Login)

**Historia de Usuario:**
> Como Gestor de PQRS, quiero ingresar a la Aplicación Web con mis credenciales corporativas, para acceder a la bandeja y tramitar las solicitudes de los clientes.

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-06 |
| **Nombre** | Autenticación de Gestor |
| **Resumen** | Ingreso al panel de administración web mediante credenciales de usuario y contraseña asignadas corporativamente. |
| **Actor** | Gestor de PQRS |
| **Caso de Uso Asociado** | CU-02: Autenticarse |
| **Precondición** | El empleado debe estar registrado y activo como Gestor en el sistema. |
| **Postcondición** | Se establece sesión web y redirige a la Bandeja de Radicados. |

**Criterios de Aceptación:**
- Dado un Gestor con credenciales válidas y rol `gestor`, cuando se autentica, entonces se establece sesión web (JWT) y la app redirige a la Bandeja General.
- Dado un usuario sin rol `gestor` (Cliente, por ejemplo), cuando intenta autenticarse en la Aplicación Web, entonces el acceso es denegado aunque las credenciales sean correctas.
- Dado un Gestor con credenciales erróneas, cuando intenta autenticarse, entonces el sistema muestra "Usuario o contraseña incorrectos" sin revelar cuál falló.

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Gestor abre la Aplicación Web e ingresa Usuario y Clave. | Verifica credenciales y permisos de rol "Gestor". |
| 2 | El Gestor hace clic en "Ingresar". | Genera sesión y muestra la Bandeja General. |

---

### RF-07: Consultar Bandeja de Radicados

**Historia de Usuario:**
> Como Gestor de PQRS, quiero ver el listado completo de todas las PQRS radicadas en el sistema, para identificar las solicitudes pendientes y priorizar mi trabajo.

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-07 |
| **Nombre** | Consultar Bandeja de Radicados |
| **Resumen** | Visualización general del sistema de todas las PQRS registradas por los clientes de SuperMarket. |
| **Actor** | Gestor de PQRS |
| **Caso de Uso Asociado** | CU-05: Gestionar Bandeja |
| **Precondición** | El Gestor debe estar autenticado (RF-06). |
| **Postcondición** | El Gestor visualiza la tabla paginada de todos los radicados del sistema. |

**Criterios de Aceptación:**
- Dado un Gestor autenticado, cuando ingresa a "Bandeja de Entrada", entonces el sistema lista todas las PQRS del sistema, ordenadas por fecha de radicación descendente.
- Dado la tabla renderizada, cuando se muestra una fila, entonces incluye Radicado, Fecha, Tipo, Comentarios (truncados), Anexos (indicador), Estado y Justificación.
- Dado un volumen alto de PQRS, cuando se carga la bandeja, entonces el sistema pagina los resultados (mínimo 20 por página) para evitar consultas gigantes.
- Dado un usuario sin rol `gestor`, cuando intenta acceder al endpoint de la bandeja, entonces el sistema responde HTTP 403.

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Gestor accede al menú "Bandeja de Entrada". | Realiza consulta global de todas las PQRS a la base de datos, ordenadas de más reciente a más antigua. |
| 2 | | Renderiza una tabla con columnas: Radicado, Fecha, Tipo, Comentarios, Anexos, Estado y Justificación. |

---

### RF-08: Filtrar Bandeja de Radicados

**Historia de Usuario:**
> Como Gestor de PQRS, quiero filtrar la bandeja por tipo y/o estado, para concentrarme en un subconjunto manejable (ej. solo "Quejas" en estado "Nuevo") y procesarlas en bloque.

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-08 |
| **Nombre** | Filtrar Bandeja de Radicados |
| **Resumen** | Búsqueda de PQRS en la bandeja general utilizando combinaciones de filtros por "Tipo de radicado" y/o "Estado". |
| **Actor** | Gestor de PQRS |
| **Caso de Uso Asociado** | CU-05: Gestionar Bandeja |
| **Precondición** | El Gestor se encuentra visualizando la Bandeja General (RF-07). |
| **Postcondición** | La tabla se actualiza reflejando la vista filtrada. |

**Criterios de Aceptación:**
- Dado un filtro por Tipo = "Queja", cuando el Gestor presiona "Filtrar", entonces la tabla muestra solo PQRS de tipo `queja`.
- Dado filtros combinados (Tipo = "Queja" + Estado = "Nuevo"), cuando se aplica, entonces el resultado intersecta ambos criterios.
- Dado un filtro sin resultados, cuando se aplica, entonces el sistema muestra un mensaje "Sin PQRS que coincidan con los filtros aplicados" en vez de tabla vacía sin contexto.
- Dado un filtro aplicado, cuando el Gestor presiona "Limpiar filtros", entonces la tabla vuelve a mostrar el listado completo de la bandeja.

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Gestor selecciona uno o más valores en los menús desplegables de "Tipo" y/o "Estado". | Captura los criterios de filtrado seleccionados. |
| 2 | El Gestor hace clic en "Filtrar" o "Buscar". | Regenera la consulta SQL/ORM limitando la información al cruce de criterios y actualiza la tabla visible. |

---

### RF-09: Descargar Anexo de PQRS

**Historia de Usuario:**
> Como Gestor de PQRS, quiero descargar el archivo PDF adjunto a una PQRS, para revisar la evidencia del Cliente antes de tomar una decisión sobre el trámite.

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-09 |
| **Nombre** | Descargar Anexo de PQRS |
| **Resumen** | Acción que permite al Gestor obtener y descargar el documento PDF adjunto por el cliente en un radicado específico para revisarlo. |
| **Actor** | Gestor de PQRS |
| **Caso de Uso Asociado** | CU-06: Tramitar PQRS |
| **Precondición** | La PQRS en la bandeja debe contar con un documento asociado. |
| **Postcondición** | Se descarga un archivo `.pdf` en el equipo del Gestor. |

**Criterios de Aceptación:**
- Dado una PQRS con anexo, cuando el Gestor hace clic en "Descargar Anexo", entonces el sistema entrega el archivo `.pdf` con su nombre original.
- Dado una PQRS sin anexo, cuando el Gestor mira la fila, entonces el botón "Descargar" aparece deshabilitado o ausente.
- Dado un archivo que no se encuentra en el NAS (registro huérfano), cuando el Gestor intenta descargar, entonces el sistema responde con error 404 y mensaje "El archivo no está disponible. Reporte al administrador."
- Dado un usuario sin rol `gestor` o `admin`, cuando intenta descargar un anexo ajeno, entonces el endpoint responde HTTP 403.

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Gestor ubica una PQRS y hace clic en el enlace/botón "Descargar Anexo". | Ubica el archivo físico/binario en el repositorio de documentos utilizando la ruta guardada. |
| 2 | | Transmite el archivo binario hacia el navegador del Gestor forzando la descarga del PDF. |

---

### RF-10: Gestionar Estado de PQRS

**Historia de Usuario:**
> Como Gestor de PQRS, quiero cambiar el estado de una PQRS con una justificación escrita, para que el ciclo de vida quede registrado y el Cliente entienda por qué se tomó cada decisión.

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-10 |
| **Nombre** | Gestionar Estado de PQRS |
| **Resumen** | Cambio del estado de un radicado (Nuevo, En proceso, Resuelto, Rechazado) exigiendo el ingreso obligatorio de una justificación por parte del Gestor. |
| **Actor** | Gestor de PQRS |
| **Caso de Uso Asociado** | CU-06: Tramitar PQRS |
| **Precondición** | El Gestor ha seleccionado una PQRS para gestionar. |
| **Postcondición** | El estado de la PQRS se actualiza en base de datos. |

**Criterios de Aceptación:**
- Dado una PQRS en estado "Nuevo", cuando el Gestor cambia el estado y diligencia justificación válida (>= 10 caracteres, no solo espacios), entonces el sistema persiste el cambio y crea un registro en `tramite` con el estado anterior y nuevo.
- Dado un campo de justificación vacío o solo con espacios, cuando el Gestor presiona "Guardar Cambios", entonces el sistema impide guardar y muestra "Para cambiar el estado, la justificación es obligatoria".
- Dado un cambio de estado a "Resuelto" o "Rechazado", cuando se persiste, entonces el sistema registra `fecha_cierre` con timestamp actual.
- Dado un usuario sin rol `gestor` o `admin`, cuando intenta cambiar estado, entonces el endpoint responde HTTP 403.

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Gestor cambia el selector de "Estado" de una PQRS (Ej. a "Resuelto"). | Habilita como obligatorio el campo de texto "Justificación". |
| 2 | El Gestor diligencia la justificación y presiona "Guardar Cambios". | Valida que la justificación no esté vacía ni contenga solo espacios en blanco. |
| 3 | | Persiste la nueva información en la base de datos. |

**Caminos Alternativos y Excepciones**

| Sección | Descripción |
| :--- | :--- |
| **Caminos de Excepción** | **E-01 - Justificación Vacía:** Impide guardar y resalta el campo indicando: "Para cambiar el estado, la justificación es obligatoria". |

---

### RF-11: Generar Reporte de Radicados (PDF)

**Historia de Usuario:**
> Como Gestor de PQRS, quiero exportar la vista actual de la bandeja a PDF, para compartirla con mi jefatura o archivarla como soporte de gestión sin depender de capturas de pantalla.

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-11 |
| **Nombre** | Generar Reporte de Radicados |
| **Resumen** | Exportación de la vista actual de la bandeja de radicados (ya sea la general o una versión filtrada) a un documento PDF descargable. |
| **Actor** | Gestor de PQRS |
| **Caso de Uso Asociado** | CU-07: Generar Reportes |
| **Precondición** | El Gestor visualiza la bandeja con radicados y opcionalmente ha aplicado filtros (RF-08). |
| **Postcondición** | Un archivo reporte PDF es descargado por el Gestor. |

**Criterios de Aceptación:**
- Dado una bandeja con filtros aplicados, cuando el Gestor presiona "Exportar a PDF", entonces el reporte contiene solo las filas que cumplen los filtros activos.
- Dado el reporte generado, cuando se descarga, entonces el archivo se llama `Reporte_Bandeja_PQRS.pdf` y excluye la columna del link al anexo (no aplica en PDF impreso).
- Dado un reporte exportado, cuando se abre, entonces incluye encabezado con fecha de generación, nombre del Gestor que lo generó y total de PQRS en el reporte.
- Dado una bandeja vacía o filtrada sin resultados, cuando el Gestor exporta, entonces el sistema avisa "No hay PQRS para exportar" en lugar de generar un PDF vacío.

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Gestor hace clic en el botón "Exportar a PDF". | Captura la data de las filas actualmente visibles (descartando la columna visual del link al anexo). |
| 2 | | Compila la data utilizando una librería de reportes (ej. JasperReports o iText) y construye el archivo PDF. |
| 3 | | Inicia la descarga automática del archivo `Reporte_Bandeja_PQRS.pdf`. |

---

### RF-12: Notificación de Confirmación (Correo)

**Historia de Usuario:**
> Como Sistema, quiero enviar un correo de confirmación al Cliente al radicar su PQRS, para que tenga constancia del número de radicado y, si fue registro nuevo, reciba sus credenciales de acceso.

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-12 |
| **Nombre** | Notificación de Confirmación (Correo) |
| **Resumen** | Envío automático de correo electrónico al cliente confirmando la radicación exitosa de su PQRS, incluyéndole su número de radicado (y su contraseña si fue registro nuevo). |
| **Actor** | Sistema Notificador |
| **Caso de Uso Asociado** | CU-03: Radicar PQRS (Punto de extensión) |
| **Precondición** | El sistema procesó y asignó un número de radicado a una PQRS (RF-01). |
| **Postcondición** | Se entrega un mensaje al servidor SMTP para ser enviado al cliente. |

**Criterios de Aceptación:**
- Dado una PQRS radicada exitosamente, cuando el sistema dispara la notificación, entonces el cuerpo del correo incluye número de radicado y fecha de radicación.
- Dado un Cliente recién creado vía RF-02, cuando se envía la notificación, entonces el correo adjunta también la contraseña autogenerada y un instructivo breve para ingresar a la App.
- Dado un fallo temporal del servidor SMTP, cuando el envío falla, entonces el sistema encola la notificación con estado `pendiente` y reintenta hasta 5 veces sin bloquear el flujo de radicación.
- Dado una notificación que falla 5 veces consecutivas, cuando se agota el retry, entonces se marca como `fallida` y se registra en auditoría para revisión manual del administrador.

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | (Automático post-radicación). | Construye el cuerpo del correo con el Número de Radicado y Fecha. |
| 2 | | Si fue cliente nuevo (vía RF-02), adjunta al cuerpo del correo la contraseña autogenerada y las instrucciones de ingreso. |
| 3 | | Invoca la API SMTP para enviar el correo a la dirección provista por el Cliente. |

**Caminos Alternativos y Excepciones**

| Sección | Descripción |
| :--- | :--- |
| **Caminos de Excepción** | **E-01 - Falla Servidor de Correos:** Si el servicio de correos está inactivo, el sistema encola la petición pero no detiene el flujo de la App; el usuario recibe confirmación visual en pantalla. |
