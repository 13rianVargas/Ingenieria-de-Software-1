# Cumplimiento de Requerimientos No Funcionales (PQRS)

Mapeo detallado de cada RNF definido en [`8-Requerimientos-No-Funcionales.md`](./8-Requerimientos-No-Funcionales.md) a las decisiones arquitectónicas plasmadas en [`9-Arquitectura-PQRS.md`](./9-Arquitectura-PQRS.md) y los diagramas asociados.

> El Proyecto-Final maneja 3 RNF focalizados al alcance PQRS.

## Historial de Versiones

| Versión | Fecha | Descripción Cambio |
| :--- | :--- | :--- |
| 01 | 13/05/2026 | Creación inicial del documento de cumplimiento RNF, mapeando los 3 RNF a las vistas arquitectónicas. |
| 02 | 19/05/2026 | Revisión preparación SRS: actualización de RNF-02 para reflejar la decisión de modelo de datos (CHECK enum en `usuario.rol` en lugar de tabla `rol` catálogo), pasada general de acentuación ortográfica para coherencia con `7-RF.md` y `8-RNF.md`, suma de historial. |

---

## 1. RNF-01: Arquitectura Tecnológica y Persistencia

**Descripción breve:** El sistema debe construirse sobre un stack open source aprobado: BD relacional libre, ORM, servidor de aplicaciones avalado, dos interfaces (App Móvil + App Web), lenguajes/frameworks estándar.

### ¿Cómo se aborda arquitectónicamente?

- **Vista Lógica:** Componentes separados `pqrs-frontend-mobile` y `pqrs-frontend-web` aseguran las dos interfaces independientes exigidas. Cluster Spring Boot expone API REST que ambos consumen.
- **Vista de Desarrollo:** El paquete `infrastructure/persistencia/` implementa los puertos del dominio vía JPA + Hibernate. Esto satisface el criterio "ORM obligatorio" del RNF-01. La estructura hexagonal aísla el dominio de la tecnología de persistencia: si se cambia PostgreSQL por otro motor compatible (MySQL, MariaDB), solo cambia el adapter sin tocar el dominio.
- **Vista Física:** Cluster Servidores App corre Spring Boot con Tomcat embebido (servidor de aplicaciones avalado). BD primaria PostgreSQL 15+ en TCP 5432 con licencia BSD.
- **Stack confirmado:**
  - Backend: Java OpenJDK 17 + Spring Boot 3.x.
  - Frontend: Angular 20 + Ionic 8 + Tailwind.
  - BD: PostgreSQL 15+.
  - Servidor: Tomcat embebido + Nginx como reverse proxy.
  - Build backend: Maven.
  - Build frontend: Angular CLI + pnpm.

### Criterios de aceptación (verificación)

| # | Criterio | Componente que lo cumple |
|---|---|---|
| 1 | BD en motor libre (PostgreSQL, MySQL, ...) | Vista Física — PostgreSQL 15+ TCP 5432 |
| 2 | ORM (Hibernate, iBatis, ...) | Vista Desarrollo — `infrastructure/persistencia/` con JPA/Hibernate |
| 3 | Servidor de aplicaciones avalado | Vista Física — Tomcat embebido en Spring Boot |
| 4 | Dos interfaces (Móvil + Web) | Vista Lógica — `pqrs-frontend-mobile` + `pqrs-frontend-web` |
| 5 | Lenguajes/frameworks estándar | Stack: Java/Spring (backend), TypeScript/Angular (frontend) |

---

## 2. RNF-02: Seguridad, Autenticación y Control de Accesos

**Descripción breve:** Toda interacción privilegiada debe estar protegida. Contraseñas almacenadas con hash irreversible (BCrypt o Argon2). Módulo de seguridad basado en roles. La App Móvil solo consulta PQRS propias si la sesión del Cliente fue validada. La Web deniega acceso a no autenticados.

### ¿Cómo se aborda arquitectónicamente?

- **Vista Lógica:** El componente `shared/security` aísla todas las responsabilidades de autenticación y autorización. Centraliza validación de criterios de complejidad de claves, generación de JWT, y verificación de roles.
- **Vista de Desarrollo:** Paquete `shared/security` con clases `JwtFilter`, `BcryptPasswordEncoder`, `RoleGuard`. El interceptor JWT corre antes de cada controller; rechaza requests sin token válido. `RoleGuard` (Spring `@PreAuthorize`) restringe endpoints por rol.
- **Vista Física:** Comunicación exclusivamente HTTPS desde el balanceador hacia los clientes (TCP 443). Conexión JDBC a la BD usa SSL.
- **Vista de Datos:** En la entidad `usuario`, el atributo de contraseña es `clave_hash` (VARCHAR(255)), indicando que se almacena el hash BCrypt. El atributo `usuario.rol` (CHECK enum) define los perfiles permitidos (`cliente`, `gestor`, `admin`) sin requerir una tabla catálogo separada — decisión tomada para reducir joins en queries frecuentes (bandeja, autorización) y porque el conjunto de roles es cerrado y conocido de antemano.
- **Vista de Procesos:** En el flujo Tramitar PQRS, `shared/security` valida el rol Gestor antes de cada operación de tramitación. En Radicar PQRS, si el cliente está anónimo, se autogenera clave aleatoria que se cifra con BCrypt antes de persistir.

### Criterios de aceptación (verificación)

| # | Criterio | Componente que lo cumple |
|---|---|---|
| 1 | Contraseñas con hash irreversible (BCrypt/Argon2) | `shared/security/BcryptPasswordEncoder` |
| 2 | Módulo de seguridad con roles (Cliente, Gestor, Admin) | `shared/security/RoleGuard` + CHECK enum en `usuario.rol` |
| 3 | App Móvil solo consulta PQRS propias con sesión validada | `JwtFilter` + `RoleGuard` + filtro WHERE en `PqrsRepositoryAdapter` |
| 4 | App Web deniega acceso a Bandeja, Anexos, Reportes sin auth de Gestor | `@PreAuthorize("hasRole('gestor')")` en `PqrsController` y `ReporteController` |

---

## 3. RNF-03: Interoperabilidad, Integración y Comunicación

**Descripción breve:** Comunicación entre App Móvil/Web y backend mediante REST o SOAP. Notificaciones automáticas asíncronas (no bloquean respuesta). Respuestas con códigos HTTP estándar.

### ¿Cómo se aborda arquitectónicamente?

- **Vista Lógica:** El componente `pqrs-api` expone endpoints REST/JSON. Los frontends consumen vía `HttpClient` de Angular. No hay comunicación directa con la BD desde el frontend.
- **Vista de Procesos:** El flujo Radicar PQRS muestra que la notificación por correo se dispara en una **rama asíncrona** después de la respuesta 201 al cliente. Si el SMTP falla, el sistema reintenta sin afectar la respuesta UI. La tabla `notificacion` actúa como cola con estado para retry.
- **Vista de Desarrollo:** El paquete `infrastructure/integraciones/EmailAdapter` implementa el puerto `NotificacionPort` del dominio. La invocación al adapter se hace con `@Async` (Spring) o publicando un evento de dominio que un listener procesa fuera del request lifecycle.
- **Códigos HTTP estándar:** 201 Created (radicar), 200 OK (consultar/tramitar), 400 Bad Request (validación), 401 Unauthorized (sin token), 403 Forbidden (rol insuficiente), 404 Not Found, 500 Internal Server Error.
- **Preparado para SOAP:** Si en el futuro se requiere integración con sistemas BI externos, se puede agregar un paquete `api/soap/` sin tocar el dominio. La arquitectura hexagonal lo permite porque el dominio no está acoplado al protocolo de entrada.

### Criterios de aceptación (verificación)

| # | Criterio | Componente que lo cumple |
|---|---|---|
| 1 | Comunicación mediante REST o SOAP | `pqrs-api/rest/*` (REST sobre HTTPS) |
| 2 | Endpoints para radicación, historial, descarga PDF | `PqrsController.radicar()`, `.listarPropias()`, `.descargarAdjunto()` |
| 3 | Notificaciones asíncronas no bloqueantes | `EmailAdapter` con `@Async` + tabla `notificacion` como cola |
| 4 | Payloads estructurados con códigos de estado | Convención REST + `GlobalErrorHandler` en `shared/logging` |

---

## Resumen visual

| RNF | Vista principal | Componente clave | Mecanismo |
|---|---|---|---|
| RNF-01 Arquitectura | Lógica + Física | Stack open source + `infrastructure/persistencia` | OpenJDK + Spring Boot + Postgres + JPA + Angular + Ionic |
| RNF-02 Seguridad | Lógica + Datos | `shared/security` + `usuario.clave_hash` + CHECK enum `usuario.rol` | BCrypt + JWT + Roles + HTTPS |
| RNF-03 Interoperabilidad | Lógica + Procesos | `pqrs-api/rest` + `pqrs-notificaciones` (async) | REST/JSON sobre HTTPS + códigos HTTP estándar + envío asíncrono |

---

## Referencias cruzadas

- Documento de RNF: [`8-Requerimientos-No-Funcionales.md`](./8-Requerimientos-No-Funcionales.md).
- Vistas arquitectónicas: [`9-Arquitectura-PQRS.md`](./9-Arquitectura-PQRS.md).
- Diagramas: [`diagramas/arquitectura/`](./diagramas/arquitectura/).
- Modelo de datos: ver §8 (Modelo Entidad-Relación) del SAD [`9-Arquitectura-PQRS.md`](./9-Arquitectura-PQRS.md).
