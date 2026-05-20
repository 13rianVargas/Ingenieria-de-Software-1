# 9. Cumplimiento de Requerimientos No Funcionales

Mapeo detallado de cada RNF definido en el Documento Especifico de Requerimientos No Funcionales (3) a las decisiones arquitectónicas plasmadas en este documento y los diagramas asociados.

## 9.1 RNF-01: Arquitectura Tecnológica y Persistencia

descripción breve: el sistema debe construirse sobre un stack open source aprobado: BD relacional libre, ORM, servidor de aplicaciones avalado, dos interfaces (App Móvil mas App Web), lenguajes y frameworks estándar.

Como se aborda:

- Vista lógica: componentes separados pqrs-frontend-mobile y pqrs-frontend-web aseguran las dos interfaces independientes exigidas. Cluster Spring Boot expone API REST que ambos consumen.
- Vista de Desarrollo: el paquete infrastructure/persistencia/ implementa los puertos del dominio via JPA mas Hibernate. Satisface el criterio "ORM obligatorio".
- Vista física: cluster Servidores App corre Spring Boot con Tomcat embebido (servidor de aplicaciones avalado). BD primaria PostgreSQL 15+ en TCP 5432 con licencia BSD.

Criterios de aceptacion verificados:

| # | Criterio | Componente que lo cumple |
|---|---|---|
| 1 | BD en motor libre (PostgreSQL, MySQL, ...) | Vista física: PostgreSQL 15+ TCP 5432 |
| 2 | ORM (Hibernate, iBatis, ...) | Vista Desarrollo: infrastructure/persistencia/ con JPA/Hibernate |
| 3 | Servidor de aplicaciones avalado | Vista física: Tomcat embebido en Spring Boot |
| 4 | Dos interfaces (Móvil mas Web) | Vista lógica: pqrs-frontend-mobile mas pqrs-frontend-web |
| 5 | Lenguajes y frameworks estándar | Stack Java/Spring (backend), TypeScript/Angular (frontend) |

## 9.2 RNF-02: Seguridad, autenticación y Control de Accesos

descripción breve: toda interacción privilegiada debe estar protegida. Contraseñas almacenadas con hash irreversible (BCrypt o Argon2). Módulo de seguridad basado en roles. La App Móvil solo consulta PQRS propias si la sesion del Cliente fue validada. La Web denega acceso a no autenticados.

Como se aborda:

- Vista lógica: el componente shared/security aisla todas las responsabilidades de autenticación y autorización. Centraliza validacion de criterios de complejidad de claves, generación de JWT y verificación de roles.
- Vista de Desarrollo: paquete shared/security con clases JwtFilter, BcryptPasswordEncoder, RoleGuard. El interceptor JWT corre antes de cada controller; rechaza requests sin token valido. RoleGuard (anotacion @PreAuthorize de Spring) restringe endpoints por rol.
- Vista física: comunicación exclusivamente HTTPS desde el balanceador hacia los clientes (TCP 443). Conexión JDBC a la BD usa SSL.
- Vista de Datos: en la entidad usuario, el atributo de contraseña es clave_hash (VARCHAR(255)), indicando que se almacena el hash BCrypt. El atributo rol_id referencia el catalogo rol que define los perfiles (cliente, gestor, admin).
- Vista de Procesos: en Tramitar PQRS, shared/security valida el rol Gestor antes de cada operación. En Radicar PQRS anónimo, se autogenera clave aleatoria que se cifra con BCrypt antes de persistir.

Criterios de aceptacion verificados:

| # | Criterio | Componente que lo cumple |
|---|---|---|
| 1 | Contraseñas con hash irreversible (BCrypt/Argon2) | shared/security/BcryptPasswordEncoder |
| 2 | Módulo de seguridad con roles (Cliente, Gestor PQRS) | shared/security/RoleGuard mas tabla rol |
| 3 | App Móvil consulta PQRS propias solo con sesion validada | JwtFilter mas RoleGuard mas filtro WHERE en PqrsRepositoryAdapter |
| 4 | App Web denega acceso a Bandeja, Anexos, Reportes sin rol Gestor | @PreAuthorize("hasRole('gestor')") en PqrsController y ReporteController |

## 9.3 RNF-03: Interoperabilidad, Integracion y Comunicación

descripción breve: comunicación entre App Móvil/Web y backend mediante REST o SOAP. Notificaciónes automáticas asíncronas (no bloquean respuesta). Respuestas con códigos HTTP estándar.

Como se aborda:

- Vista lógica: el componente pqrs-api expone endpoints REST/JSON. Los frontends consumen via HttpClient de Angular. No hay comunicación directa con la BD desde el frontend.
- Vista de Procesos: el flujo Radicar PQRS muestra que la notificación por correo se dispara en una rama asíncrona despues de la respuesta 201 al cliente. Si el SMTP falla, el sistema reintenta sin afectar la respuesta UI. La tabla notificación actua como cola con estado para retry.
- Vista de Desarrollo: el paquete infrastructure/integraciones/EmailAdapter implementa el puerto NotificacionPort del dominio. La invocacion al adapter se hace con anotacion @Async de Spring o publicando un evento de dominio que un listener procesa fuera del request lifecycle.
- Códigos HTTP estándar: 201 Created (radicar), 200 OK (consultar/tramitar), 400 Bad Request (validacion), 401 Unauthorized (sin token), 403 Forbidden (rol insuficiente), 404 Not Found, 500 Internal Server Error.
- Preparado para SOAP: si en el futuro se requiere integracion con sistemas BI externos, se puede agregar un paquete api/soap/ sin tocar el dominio. La arquitectura hexagonal lo permite porque el dominio no esta acoplado al protocolo de entrada.

Criterios de aceptacion verificados:

| # | Criterio | Componente que lo cumple |
|---|---|---|
| 1 | Comunicación mediante REST o SOAP | pqrs-api/rest/* (REST sobre HTTPS) |
| 2 | Endpoints para radicación, historial, descarga PDF | PqrsController.radicar(), .listarPropias(), .descargarAdjunto() |
| 3 | Notificaciónes asíncronas no bloqueantes | EmailAdapter con @Async mas tabla notificación como cola |
| 4 | Payloads estructurados con códigos de estado HTTP | Convencion REST mas GlobalErrorHandler en shared/logging |

## 9.4 Resumen visual

| RNF | Vista principal | Componente clave | Mecanismo |
|---|---|---|---|
| RNF-01 Arquitectura | lógica mas física | Stack open source mas infrastructure/persistencia | OpenJDK mas Spring Boot mas Postgres mas JPA mas Angular mas Ionic |
| RNF-02 Seguridad | lógica mas Datos | shared/security mas usuario.clave_hash | BCrypt mas JWT mas Roles mas HTTPS |
| RNF-03 Interoperabilidad | lógica mas Procesos | pqrs-api/rest mas pqrs-notificaciónes (async) | REST/JSON sobre HTTPS mas códigos HTTP estándar mas envio asíncrono |
