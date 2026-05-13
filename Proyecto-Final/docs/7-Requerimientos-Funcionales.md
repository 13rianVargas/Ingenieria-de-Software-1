# Documento de Descripción de los Requerimientos Funcionales

## Control del Documento

| Campo | Descripción |
| :--- | :--- |
| **Nombre del proyecto:** | E-Commerce Comercial Konrad - Sistema de Gestión de PQRS |
| **Nombre del equipo:** | Fábrica de Desarrollo Konrad |
| **Estado del documento:** | Aprobado |
| **Autores:** | Estudiantes de Ingeniería de Sistemas |

## Historial de Versiones

| Versión | Fecha | Descripción Cambio |
| :--- | :--- | :--- |
| 01 | 12/05/2026 | Creación inicial de los requerimientos funcionales mapeados a los Casos de Uso. |
| 02 | 12/05/2026 | Reestructuración a 12 Requerimientos Funcionales estrictos basados en las 12 funcionalidades principales del sistema, mapeados a los 8 Casos de Uso existentes (Opción 1). |

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

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-01 |
| **Nombre** | Radicar PQRS |
| **Resumen** | Permite diligenciar el formulario e información de la PQRS (tipo, comentarios y anexo en PDF). Si el usuario está autenticado, autocompleta sus datos; sino, se ingresan manualmente. |
| **Actor** | Cliente |
| **Caso de Uso Asociado** | CU-03: Radicar PQRS |
| **Precondición** | El Cliente tiene acceso a la App Móvil. |
| **Postcondición** | La PQRS se guarda con estado "Nuevo", se asigna un radicado único y se almacena el PDF. |

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

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-02 |
| **Nombre** | Registro Automático de Cliente |
| **Resumen** | Si el cliente no existe en la base de datos al momento de radicar de forma anónima, el sistema lo registra automáticamente en el sistema de usuarios. |
| **Actor** | Sistema Notificador |
| **Caso de Uso Asociado** | CU-01: Gestionar Registro |
| **Precondición** | El Cliente completó exitosamente el formulario de radicación (RF-01) pero su identificación no existe en base de datos. |
| **Postcondición** | El cliente es creado en la BD de usuarios y se autogenera una clave temporal. |

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

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-03 |
| **Nombre** | Autenticación de Cliente |
| **Resumen** | Ingreso a la App Móvil usando el número de identificación y la contraseña (autogenerada enviada al correo o actualizada por él). |
| **Actor** | Cliente |
| **Caso de Uso Asociado** | CU-02: Autenticarse |
| **Precondición** | El cliente debe existir en la base de datos de usuarios de SuperMarket. |
| **Postcondición** | Se establece una sesión activa en el dispositivo móvil. |

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

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-04 |
| **Nombre** | Consultar Historial de Radicados |
| **Resumen** | Visualización del listado completo de PQRS que el cliente ha radicado en SuperMarket, mostrando sus estados y anexos. |
| **Actor** | Cliente |
| **Caso de Uso Asociado** | CU-04: Consultar PQRS Propias |
| **Precondición** | El Cliente debe estar autenticado (RF-03). |
| **Postcondición** | Se muestra la lista de radicados al Cliente en su App. |

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Cliente ingresa a la vista "Historial de PQRS". | Realiza consulta a la base de datos cruzando por la identificación del Cliente. |
| 2 | | Renderiza una lista con número de radicado, fecha, tipo, estado y justificación. |

---

### RF-05: Filtrar Radicados Propios

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-05 |
| **Nombre** | Filtrar Radicados Propios |
| **Resumen** | Búsqueda específica dentro del historial de radicados del cliente utilizando el número de radicado como criterio principal. |
| **Actor** | Cliente |
| **Caso de Uso Asociado** | CU-04: Consultar PQRS Propias |
| **Precondición** | El Cliente debe estar en la vista de Historial (RF-04). |
| **Postcondición** | La lista se acota a los radicados coincidentes. |

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Cliente digita un Número de Radicado en el buscador. | Captura la entrada. |
| 2 | El Cliente presiona "Buscar". | Ejecuta un filtro local o consulta a la base de datos limitando los resultados al número de radicado exacto. |

---

### RF-06: Autenticación de Gestor (Login)

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-06 |
| **Nombre** | Autenticación de Gestor |
| **Resumen** | Ingreso al panel de administración web mediante credenciales de usuario y contraseña asignadas corporativamente. |
| **Actor** | Gestor de PQRS |
| **Caso de Uso Asociado** | CU-02: Autenticarse |
| **Precondición** | El empleado debe estar registrado y activo como Gestor en el sistema. |
| **Postcondición** | Se establece sesión web y redirige a la Bandeja de Radicados. |

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Gestor abre la Aplicación Web e ingresa Usuario y Clave. | Verifica credenciales y permisos de rol "Gestor". |
| 2 | El Gestor hace clic en "Ingresar". | Genera sesión y muestra la Bandeja General. |

---

### RF-07: Consultar Bandeja de Radicados

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-07 |
| **Nombre** | Consultar Bandeja de Radicados |
| **Resumen** | Visualización general del sistema de todas las PQRS registradas por los clientes de SuperMarket. |
| **Actor** | Gestor de PQRS |
| **Caso de Uso Asociado** | CU-05: Gestionar Bandeja |
| **Precondición** | El Gestor debe estar autenticado (RF-06). |
| **Postcondición** | El Gestor visualiza la tabla paginada de todos los radicados del sistema. |

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Gestor accede al menú "Bandeja de Entrada". | Realiza consulta global de todas las PQRS a la base de datos, ordenadas de más reciente a más antigua. |
| 2 | | Renderiza una tabla con columnas: Radicado, Fecha, Tipo, Comentarios, Anexos, Estado y Justificación. |

---

### RF-08: Filtrar Bandeja de Radicados

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-08 |
| **Nombre** | Filtrar Bandeja de Radicados |
| **Resumen** | Búsqueda de PQRS en la bandeja general utilizando combinaciones de filtros por "Tipo de radicado" y/o "Estado". |
| **Actor** | Gestor de PQRS |
| **Caso de Uso Asociado** | CU-05: Gestionar Bandeja |
| **Precondición** | El Gestor se encuentra visualizando la Bandeja General (RF-07). |
| **Postcondición** | La tabla se actualiza reflejando la vista filtrada. |

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Gestor selecciona uno o más valores en los menús desplegables de "Tipo" y/o "Estado". | Captura los criterios de filtrado seleccionados. |
| 2 | El Gestor hace clic en "Filtrar" o "Buscar". | Regenera la consulta SQL/ORM limitando la información al cruce de criterios y actualiza la tabla visible. |

---

### RF-09: Descargar Anexo de PQRS

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-09 |
| **Nombre** | Descargar Anexo de PQRS |
| **Resumen** | Acción que permite al Gestor obtener y descargar el documento PDF adjunto por el cliente en un radicado específico para revisarlo. |
| **Actor** | Gestor de PQRS |
| **Caso de Uso Asociado** | CU-06: Tramitar PQRS |
| **Precondición** | La PQRS en la bandeja debe contar con un documento asociado. |
| **Postcondición** | Se descarga un archivo `.pdf` en el equipo del Gestor. |

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Gestor ubica una PQRS y hace clic en el enlace/botón "Descargar Anexo". | Ubica el archivo físico/binario en el repositorio de documentos utilizando la ruta guardada. |
| 2 | | Transmite el archivo binario hacia el navegador del Gestor forzando la descarga del PDF. |

---

### RF-10: Gestionar Estado de PQRS

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-10 |
| **Nombre** | Gestionar Estado de PQRS |
| **Resumen** | Cambio del estado de un radicado (Nuevo, En proceso, Resuelto, Rechazado) exigiendo el ingreso obligatorio de una justificación por parte del Gestor. |
| **Actor** | Gestor de PQRS |
| **Caso de Uso Asociado** | CU-06: Tramitar PQRS |
| **Precondición** | El Gestor ha seleccionado una PQRS para gestionar. |
| **Postcondición** | El estado de la PQRS se actualiza en base de datos. |

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

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-11 |
| **Nombre** | Generar Reporte de Radicados |
| **Resumen** | Exportación de la vista actual de la bandeja de radicados (ya sea la general o una versión filtrada) a un documento PDF descargable. |
| **Actor** | Gestor de PQRS |
| **Caso de Uso Asociado** | CU-07: Generar Reportes |
| **Precondición** | El Gestor visualiza la bandeja con radicados y opcionalmente ha aplicado filtros (RF-08). |
| **Postcondición** | Un archivo reporte PDF es descargado por el Gestor. |

**Flujo Normal de Eventos**

| Paso | Acción del Actor | Respuesta del Sistema |
| :--- | :--- | :--- |
| 1 | El Gestor hace clic en el botón "Exportar a PDF". | Captura la data de las filas actualmente visibles (descartando la columna visual del link al anexo). |
| 2 | | Compila la data utilizando una librería de reportes (ej. JasperReports o iText) y construye el archivo PDF. |
| 3 | | Inicia la descarga automática del archivo `Reporte_Bandeja_PQRS.pdf`. |

---

### RF-12: Notificación de Confirmación (Correo)

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RF-12 |
| **Nombre** | Notificación de Confirmación (Correo) |
| **Resumen** | Envío automático de correo electrónico al cliente confirmando la radicación exitosa de su PQRS, incluyéndole su número de radicado (y su contraseña si fue registro nuevo). |
| **Actor** | Sistema Notificador |
| **Caso de Uso Asociado** | CU-03: Radicar PQRS (Punto de extensión) |
| **Precondición** | El sistema procesó y asignó un número de radicado a una PQRS (RF-01). |
| **Postcondición** | Se entrega un mensaje al servidor SMTP para ser enviado al cliente. |

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
