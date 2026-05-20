# Especificación de Requerimientos No Funcionales

A continuación se presentan los requerimientos no funcionales (RNF) extraídos directamente del enunciado y contexto del sistema de información de PQRS para SuperMarket. Estos han sido acotados para soportar estrictamente las 12 funcionalidades obligatorias del MVP (de las 17 totales en `1-Funcionalidades.md`; las restantes 5 son mejoras opcionales fuera del alcance del MVP) y están estructurados con tablas Markdown + Quality Attribute Scenarios (formato Dado/Cuando/Entonces) para alineación con el resto del SRS.

## Historial de Versiones

| Versión | Fecha | Descripción Cambio |
| :--- | :--- | :--- |
| 01 | 12/05/2026 | Creación inicial con 3 RNF (Arquitectura, Seguridad, Interoperabilidad) en tablas HTML inline. |
| 02 | 19/05/2026 | Revisión preparación SRS: conversión de tablas HTML a Markdown (compatibilidad con pipeline DOCX), corrección de contradicción semántica en RNF-02 ("texto plano"), alineación de alcance a 12 funcionalidades del MVP, suma de Quality Attribute Scenarios estilo CA por RNF, suma de historial. |

---

## RNF-01: Arquitectura Tecnológica y Persistencia

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RNF-01 |
| **Prioridad** | Alta |
| **Nombre** | Arquitectura Tecnológica y Persistencia |
| **Categoría** | Arquitectura / Implementación |
| **Descripción** | El sistema debe construirse sobre una pila tecnológica (stack) específica aprobada por el cliente. Esto garantiza la compatibilidad con la infraestructura de SuperMarket, el no licenciamiento restrictivo de los datos y el uso de patrones de diseño modernos para la persistencia. |

**Criterios de Aceptación:**

1. El sistema debe alojar su base de datos obligatoriamente en un motor de licencia libre aprobado (PostgreSQL, MySQL, SQLServer Express u Oracle Express).
2. El código fuente backend debe implementar un Sistema de Mapeo Objeto-Relacional (ORM) como Hibernate, iBatis, o equivalente, para toda transacción con la base de datos.
3. El sistema debe ser desplegado en un Servidor Web o de Aplicaciones avalado (ej. Tomcat, JBoss, Glassfish, Apache, IIS).
4. El sistema debe ofrecer dos interfaces de presentación independientes: una **App Móvil** (orientada al Cliente) y una **Aplicación Web** (orientada al Gestor).
5. El código backend y web debe desarrollarse en lenguajes/frameworks estándar aprobados en el contexto (ej. PHP, .NET, Angular, JSF, SpringMVC, etc.).

**Quality Attribute Scenarios:**

- Dado un despliegue limpio del backend en el servidor de aplicaciones, cuando un nuevo desarrollador clona el repo y ejecuta el script de build, entonces el binario se genera usando exclusivamente herramientas open source y arranca sin licencias propietarias.
- Dado un endpoint del backend que persiste una entidad de dominio, cuando se invoca, entonces la escritura a la base de datos ocurre a través del ORM (no SQL inline) y la conexión apunta al motor relacional libre configurado.
- Dado un usuario Cliente y un usuario Gestor en sesiones simultáneas, cuando ambos consumen el sistema, entonces cada uno lo hace desde su interfaz dedicada (App Móvil vs. App Web) sin que una pueda suplantar a la otra.

**Documentación asociada:**

- Documento de Arquitectura ([`9-Arquitectura-PQRS.md`](./9-Arquitectura-PQRS.md)) y su Vista de Implementación.
- Script de Base de Datos y Modelo Entidad-Relación (sección 8 del SAD, [`9-Arquitectura-PQRS.md`](./9-Arquitectura-PQRS.md)).
- Cumplimiento detallado ([`10-Cumplimiento-RNF-PQRS.md`](./10-Cumplimiento-RNF-PQRS.md) §RNF-01).

---

## RNF-02: Seguridad, Autenticación y Control de Accesos

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RNF-02 |
| **Prioridad** | Alta |
| **Nombre** | Seguridad, Autenticación y Control de Accesos |
| **Categoría** | Seguridad |
| **Descripción** | Toda la interacción con el sistema que requiera privilegios (como visualizar el historial de PQRS o la bandeja de entrada) debe estar protegida. Se debe garantizar que las contraseñas, tanto las autogeneradas por el sistema como las creadas por el usuario, se almacenen de forma irrecuperable (cifradas con hash criptográfico), **nunca en texto plano**. |

**Criterios de Aceptación:**

1. Las contraseñas de todos los usuarios (Clientes y Gestores) deben cifrarse en la base de datos a través de un mecanismo o algoritmo unidireccional (hash criptográfico seguro como BCrypt o Argon2).
2. El sistema debe incorporar un módulo de seguridad basado en Roles o Perfiles (mínimo `cliente` y `gestor`, con `admin` adicional) que restrinja el acceso a las opciones y funcionalidades correspondientes.
3. La App Móvil solo debe permitir la consulta de PQRS propias si la sesión del Cliente fue validada correctamente mediante su número de identificación y contraseña (autenticación).
4. La Aplicación Web debe denegar el acceso a la Bandeja General, la descarga de Anexos y la Generación de Reportes a cualquier solicitud no autenticada como Gestor.

**Quality Attribute Scenarios:**

- Dado un usuario nuevo recién registrado, cuando el sistema le persiste su contraseña autogenerada, entonces el valor almacenado en `usuario.clave_hash` es un hash BCrypt (cost ≥ 10) y nunca contiene el texto plano de la contraseña, ni siquiera de forma temporal.
- Dado un Cliente autenticado intentando consultar la Bandeja General (endpoint exclusivo de Gestor), cuando llega la petición HTTP, entonces el sistema responde HTTP 403 sin exponer datos de otras PQRS.
- Dado un usuario que cierra sesión en la App Móvil, cuando intenta reusar el token JWT después del cierre, entonces el sistema rechaza el token y exige nueva autenticación.
- Dado un intento de fuerza bruta (más de 5 logins fallidos consecutivos por la misma identificación), cuando se detecta, entonces el sistema bloquea temporalmente nuevos intentos y registra el evento en auditoría.

**Documentación asociada:**

- Políticas de Cifrado y Seguridad de SuperMarket.
- Vista Lógica de Seguridad ([`9-Arquitectura-PQRS.md`](./9-Arquitectura-PQRS.md) §4 + §6).
- Cumplimiento detallado ([`10-Cumplimiento-RNF-PQRS.md`](./10-Cumplimiento-RNF-PQRS.md) §RNF-02).

---

## RNF-03: Interoperabilidad, Integración y Comunicación

| Propiedad | Detalle |
| :--- | :--- |
| **Identificador** | RNF-03 |
| **Prioridad** | Alta |
| **Nombre** | Interoperabilidad, Integración y Comunicación |
| **Categoría** | Interoperabilidad / Integración |
| **Descripción** | El sistema se estructura en capas separadas. Por consiguiente, la comunicación entre las interfaces cliente (App Móvil y Aplicación Web) y el Servidor de Aplicaciones (Backend) debe seguir un estándar de interoperabilidad web para garantizar que las radicaciones y peticiones se transaccionen de manera fiable. |

**Criterios de Aceptación:**

1. Toda la integración y el intercambio de datos entre la App Móvil (Cliente), la App Web (Gestor) y la capa de lógica de negocio (Servidor) debe realizarse exclusivamente mediante consumo de servicios web bajo el protocolo SOAP o REST.
2. El sistema backend debe exponer los *endpoints* necesarios para cubrir la radicación, consulta de historial, descarga de PDF (anexos) y tramitación.
3. Las notificaciones automáticas (confirmación de registro y nueva contraseña, cambio de estado de PQRS) deben dispararse de forma asíncrona sin bloquear las respuestas del servicio web al cliente.
4. Las respuestas de integración (payloads JSON/XML) deben estructurarse correctamente manejando códigos de estado HTTP estándar (200, 201, 400, 401, 403, 404, 500) para informar éxito o fallo de la operación a la interfaz de usuario.

**Quality Attribute Scenarios:**

- Dado un Cliente radicando una PQRS desde la App Móvil, cuando el formulario es enviado, entonces el backend responde con HTTP 201 + payload JSON con el número de radicado en menos de 2 segundos en condiciones normales de red.
- Dado un Cliente cuya identificación no existe en la BD radicando una PQRS, cuando el backend ejecuta el registro automático y dispara la notificación de credenciales por correo, entonces la respuesta HTTP al Cliente NO espera la confirmación del envío SMTP (asincronía total).
- Dado un endpoint inexistente o un payload malformado, cuando el cliente lo invoca, entonces el backend responde con el código HTTP semánticamente correcto (404 / 400) y no con 500 genérico.

**Documentación asociada:**

- Definición de API / Especificación OpenAPI (Swagger) o WSDL.
- Vista Física y de Despliegue ([`9-Arquitectura-PQRS.md`](./9-Arquitectura-PQRS.md) §6).
- Cumplimiento detallado ([`10-Cumplimiento-RNF-PQRS.md`](./10-Cumplimiento-RNF-PQRS.md) §RNF-03).
