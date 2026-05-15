# Cumplimiento de Requerimientos No Funcionales (PQRS)

Mapeo detallado de cada RNF definido en [`8-Requerimientos-No-Funcionales.md`](./8-Requerimientos-No-Funcionales.md) a las decisiones arquitectonicas plasmadas en [`9-Arquitectura-PQRS.md`](./9-Arquitectura-PQRS.md) y los diagramas asociados.

> Documento adaptado del cumplimiento RNF del Taller-6 (E-Commerce Konrad). El Proyecto-Final maneja 3 RNF (vs. 7 del Taller-6). Esta version es focalizada al alcance PQRS.

---

## 1. RNF-01: Arquitectura Tecnologica y Persistencia

**Descripcion breve:** El sistema debe construirse sobre un stack open source aprobado: BD relacional libre, ORM, servidor de aplicaciones avalado, dos interfaces (App Movil + App Web), lenguajes/frameworks estandar.

### ¿Como se aborda arquitectonicamente?

- **Vista Logica:** Componentes separados `pqrs-frontend-mobile` y `pqrs-frontend-web` aseguran las dos interfaces independientes exigidas. Cluster Spring Boot expone API REST que ambos consumen.
- **Vista de Desarrollo:** El paquete `infrastructure/persistencia/` implementa los puertos del dominio via JPA + Hibernate. Esto satisface el criterio "ORM obligatorio" del RNF-01. La estructura hexagonal aisla el dominio de la tecnologia de persistencia: si se cambia PostgreSQL por otro motor compatible (MySQL, MariaDB), solo cambia el adapter sin tocar el dominio.
- **Vista Fisica:** Cluster Servidores App corre Spring Boot con Tomcat embebido (servidor de aplicaciones avalado). BD primaria PostgreSQL 15+ en TCP 5432 con licencia BSD.
- **Stack confirmado:**
  - Backend: Java OpenJDK 17 + Spring Boot 3.x.
  - Frontend: Angular 20 + Ionic 8 + Tailwind.
  - BD: PostgreSQL 15+.
  - Servidor: Tomcat embebido + Nginx como reverse proxy.
  - Build backend: Maven.
  - Build frontend: Angular CLI + pnpm.

### Criterios de aceptacion (verificacion)

| # | Criterio | Componente que lo cumple |
|---|---|---|
| 1 | BD en motor libre (PostgreSQL, MySQL, ...) | Vista Fisica — PostgreSQL 15+ TCP 5432 |
| 2 | ORM (Hibernate, iBatis, ...) | Vista Desarrollo — `infrastructure/persistencia/` con JPA/Hibernate |
| 3 | Servidor de aplicaciones avalado | Vista Fisica — Tomcat embebido en Spring Boot |
| 4 | Dos interfaces (Movil + Web) | Vista Logica — `pqrs-frontend-mobile` + `pqrs-frontend-web` |
| 5 | Lenguajes/frameworks estandar | Stack: Java/Spring (backend), TypeScript/Angular (frontend) |

---

## 2. RNF-02: Seguridad, Autenticacion y Control de Accesos

**Descripcion breve:** Toda interaccion privilegiada debe estar protegida. Contraseñas almacenadas con hash irreversible (BCrypt o Argon2). Modulo de seguridad basado en roles. La App Movil solo consulta PQRS propias si la sesion del Cliente fue validada. La Web denega acceso a no autenticados.

### ¿Como se aborda arquitectonicamente?

- **Vista Logica:** El componente `shared/security` aisla todas las responsabilidades de autenticacion y autorizacion. Centraliza validacion de criterios de complejidad de claves, generacion de JWT, y verificacion de roles.
- **Vista de Desarrollo:** Paquete `shared/security` con clases `JwtFilter`, `BcryptPasswordEncoder`, `RoleGuard`. El interceptor JWT corre antes de cada controller; rechaza requests sin token valido. `RoleGuard` (Spring `@PreAuthorize`) restringe endpoints por rol.
- **Vista Fisica:** Comunicacion exclusivamente HTTPS desde el balanceador hacia los clientes (TCP 443). Conexion JDBC a la BD usa SSL.
- **Vista de Datos:** En la entidad `usuario`, el atributo de contraseña es `clave_hash` (VARCHAR(255)), indicando que se almacena el hash BCrypt. El atributo `rol_id` referencia el catalogo `rol` que define los perfiles (cliente, gestor, admin).
- **Vista de Procesos:** En el flujo Tramitar PQRS, `shared/security` valida el rol Gestor antes de cada operacion de tramitacion. En Radicar PQRS, si el cliente esta anonimo, se autogenera clave aleatoria que se cifra con BCrypt antes de persistir.

### Criterios de aceptacion (verificacion)

| # | Criterio | Componente que lo cumple |
|---|---|---|
| 1 | Contraseñas con hash irreversible (BCrypt/Argon2) | `shared/security/BcryptPasswordEncoder` |
| 2 | Modulo de seguridad con roles (Cliente, Gestor PQRS) | `shared/security/RoleGuard` + tabla `rol` |
| 3 | App Movil solo consulta PQRS propias con sesion validada | `JwtFilter` + `RoleGuard` + filtro WHERE en `PqrsRepositoryAdapter` |
| 4 | App Web denega acceso a Bandeja, Anexos, Reportes sin auth de Gestor | `@PreAuthorize("hasRole('gestor')")` en `PqrsController` y `ReporteController` |

---

## 3. RNF-03: Interoperabilidad, Integracion y Comunicacion

**Descripcion breve:** Comunicacion entre App Movil/Web y backend mediante REST o SOAP. Notificaciones automaticas asincronas (no bloquean respuesta). Respuestas con codigos HTTP estandar.

### ¿Como se aborda arquitectonicamente?

- **Vista Logica:** El componente `pqrs-api` expone endpoints REST/JSON. Los frontends consumen via `HttpClient` de Angular. No hay comunicacion directa con la BD desde el frontend.
- **Vista de Procesos:** El flujo Radicar PQRS muestra que la notificacion por correo se dispara en una **rama asincrona** despues de la respuesta 201 al cliente. Si el SMTP falla, el sistema reintenta sin afectar la respuesta UI. La tabla `notificacion` actua como cola con estado para retry.
- **Vista de Desarrollo:** El paquete `infrastructure/integraciones/EmailAdapter` implementa el puerto `NotificacionPort` del dominio. La invocacion al adapter se hace con `@Async` (Spring) o publicando un evento de dominio que un listener procesa fuera del request lifecycle.
- **Codigos HTTP estandar:** 201 Created (radicar), 200 OK (consultar/tramitar), 400 Bad Request (validacion), 401 Unauthorized (sin token), 403 Forbidden (rol insuficiente), 404 Not Found, 500 Internal Server Error.
- **Preparado para SOAP:** Si en el futuro se requiere integracion con sistemas BI externos, se puede agregar un paquete `api/soap/` sin tocar el dominio. La arquitectura hexagonal lo permite porque el dominio no esta acoplado al protocolo de entrada.

### Criterios de aceptacion (verificacion)

| # | Criterio | Componente que lo cumple |
|---|---|---|
| 1 | Comunicacion mediante REST o SOAP | `pqrs-api/rest/*` (REST sobre HTTPS) |
| 2 | Endpoints para radicacion, historial, descarga PDF | `PqrsController.radicar()`, `.listarPropias()`, `.descargarAdjunto()` |
| 3 | Notificaciones asincronas no bloqueantes | `EmailAdapter` con `@Async` + tabla `notificacion` como cola |
| 4 | Payloads estructurados con codigos de estado | Convencion REST + `GlobalErrorHandler` en `shared/logging` |

---

## Resumen visual

| RNF | Vista principal | Componente clave | Mecanismo |
|---|---|---|---|
| RNF-01 Arquitectura | Logica + Fisica | Stack open source + `infrastructure/persistencia` | OpenJDK + Spring Boot + Postgres + JPA + Angular + Ionic |
| RNF-02 Seguridad | Logica + Datos | `shared/security` + `usuario.clave_hash` | BCrypt + JWT + Roles + HTTPS |
| RNF-03 Interoperabilidad | Logica + Procesos | `pqrs-api/rest` + `pqrs-notificaciones` (async) | REST/JSON sobre HTTPS + codigos HTTP estandar + envio asincrono |

---

## Referencias cruzadas

- Documento de RNF: [`8-Requerimientos-No-Funcionales.md`](./8-Requerimientos-No-Funcionales.md).
- Vistas arquitectonicas: [`9-Arquitectura-PQRS.md`](./9-Arquitectura-PQRS.md).
- Diagramas: [`diagramas/arquitectura/`](./diagramas/arquitectura/).
- Modelo de datos: [`11-Modelo-Entidad-Relacion.md`](./11-Modelo-Entidad-Relacion.md).
