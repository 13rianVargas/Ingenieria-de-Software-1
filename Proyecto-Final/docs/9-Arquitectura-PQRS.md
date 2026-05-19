# Arquitectura del Sistema PQRS — SuperMarket

> Documento de arquitectura del **Sistema de PQRS** para SuperMarket. Define las decisiones de fondo (capas hexagonales, BCrypt+JWT, replicación de BD, NAS para archivos, auditoría vía AOP) y las traza al dominio funcional del Proyecto-Final.

## Historial de Versiones

| Versión | Fecha | Descripción Cambio |
| :--- | :--- | :--- |
| 01 | 13/05/2026 | Creación inicial del documento de arquitectura multivista (4+1 + Vista de Datos) para el sistema PQRS de SuperMarket. |
| 02 | 18/05/2026 | Limpieza de referencias residuales al caso original Taller-6 (E-Commerce Konrad), eliminación de §6.3 "Diferencias con Taller-6", ajustes en referencias bibliográficas. |
| 03 | 18/05/2026 | Sincronización con BD V1: eliminación de mención a tabla `rol` catálogo, ajuste a CHECK enum en `usuario.rol`. |
| 04 | 19/05/2026 | Revisión preparación SAD/SRS: pasada general de acentuación ortográfica, eliminación del actor Administrador (rol futuro post-MVP, no contemplado en `0-Contexto-Proyecto-Final.md`), corrección de descripciones CU-01 ("anónimo" → "ID no existe en BD"), eliminación de nota sobre entregable opcional #14 (Especificación de Clases descartada esta entrega), suma de CU-04 a la tabla de CUs arquitectónicamente significativos, suma de historial. |

---

## 1. Introducción

### 1.1 Propósito

Describir la arquitectura del sistema PQRS usando el modelo **4+1 vistas** de Kruchten, extendido con Vista de Datos. Cada vista enfoca un aspecto distinto del sistema y conjuntamente cubren los requerimientos funcionales (RF-01 a RF-12) y no funcionales (RNF-01 a RNF-03) ya formalizados en `7-Requerimientos-Funcionales.md` y `8-Requerimientos-No-Funcionales.md`.

### 1.2 Alcance

- Radicación de PQRS (con anexo PDF, autenticado o anónimo).
- Registro automático de clientes nuevos al radicar.
- Autenticación de Cliente y Gestor.
- Consulta y filtrado de PQRS (propias y bandeja general).
- Tramitación de PQRS (cambio de estado con justificación obligatoria).
- Generación de reportes PDF de la bandeja.
- Notificaciones automáticas por correo.

**Fuera de alcance:** integraciones con sistemas externos de BI, reportes BAM en tiempo real, módulo de pagos y validación crediticia.

### 1.3 Glosario

| Término | Definición |
|---|---|
| **PQRS** | Petición, Queja, Reclamo o Sugerencia. Solicitud que el ciudadano radica ante SuperMarket. |
| **Radicado** | Número único autogenerado por el sistema para hacer seguimiento a una PQRS. Formato `PQRS-YYYY-NNNNNN`. |
| **Anexo** | Documento complementario (exclusivamente PDF) adjunto a una PQRS. |
| **Bandeja** | Vista web del Gestor con el listado general de todas las PQRS. |
| **Trámite** | Cada cambio de estado de una PQRS (con justificación + timestamp). Una PQRS tiene N trámites a lo largo de su vida. |
| **JWT** | JSON Web Token. Token firmado que mantiene la sesión del usuario tras el login. |
| **BCrypt** | Algoritmo de hashing de contraseñas. Estándar OWASP. |
| **NAS** | Network Attached Storage. Servidor de almacenamiento en red para los PDF adjuntos. |
| **AOP** | Aspect-Oriented Programming. Separa concerns transversales (auditoría, logging) del código de negocio. |
| **ORM** | Object-Relational Mapping. Capa entre objetos del dominio y tablas relacionales (JPA/Hibernate). |
| **SPA** | Single Page Application. Aplicación web que carga una sola HTML y actualiza contenido dinámicamente. |

### 1.4 Objetivos arquitectónicos

1. **Seguridad** — Autenticación robusta con roles, contraseñas cifradas con BCrypt, comunicaciones exclusivamente sobre HTTPS.
2. **Mantenibilidad** — Capas hexagonales para aislar dominio de infraestructura; auditoría centralizada vía AOP.
3. **Disponibilidad razonable** — Réplica de BD para failover y backup diario sin afectar producción.
4. **Tecnología libre de licenciamiento** — Stack 100% open source (OpenJDK + Spring Boot + PostgreSQL + Angular + Nginx).
5. **Interoperabilidad** — API REST con contratos JSON; preparada para exposición SOAP futura si se requiere integración B2B.
6. **Dos interfaces independientes** — App Mobile para el Cliente, App Web para el Gestor.

### 1.5 Restricciones arquitectónicas

- Stack 100% open source: Java OpenJDK 17 + Spring Boot 3.x (backend); Angular 20 + Ionic 8 + Tailwind (frontend); PostgreSQL 15+ (BD).
- Comunicaciones externas sobre HTTPS (TCP 443).
- Persistencia con ORM obligatoria (JPA / Hibernate).
- Servidor de aplicaciones avalado (Tomcat embebido de Spring Boot).
- Dos interfaces de presentación: App Móvil (Cliente) y App Web (Gestor).

---

## 2. Vista de Casos de Uso

Esta vista establece los CU arquitectónicamente significativos: aquellos que impactan decisiones de diseño, integraciones o mecanismos concurrentes.

### 2.1 Actores

| Actor | Descripción |
|---|---|
| **Cliente (Ciudadano)** | Persona natural que radica, consulta y filtra sus PQRS desde la App Móvil. |
| **Gestor de PQRS** | Empleado de SuperMarket que tramita radicados desde la App Web. |
| **Sistema** | Actor automático que envía correos electrónicos (radicación, cambio de estado, contraseñas autogeneradas). |

> **Nota sobre Administrador:** El contexto del proyecto (`0-Contexto-Proyecto-Final.md`) no menciona un actor Administrador. El sistema reserva el rol `admin` en BD para administración futura (auditoría, parametrización) pero **no se modela como actor en el MVP**. Entrará al diagrama cuando el equipo planifique funcionalidades administrativas post-MVP.

### 2.2 Diagrama general

Ver [`diagramas/arquitectura/1-vista-casos-uso.puml`](./diagramas/arquitectura/1-vista-casos-uso.puml).

### 2.3 Casos de uso arquitectónicamente significativos

| CU | Nombre | Impacto arquitectónico |
|---|---|---|
| CU-01 | Gestionar Registro Cliente | Trigger automático desde radicar PQRS cuando el número de identificación no existe en BD. Genera clave temporal con BCrypt. |
| CU-02 | Autenticarse (Login) | JWT + Roles. Punto de entrada de seguridad para Cliente y Gestor. |
| CU-03 | Radicar PQRS | Almacena PDF en NAS (no en BD), genera radicado único, dispara correo asíncrono. |
| CU-04 | Consultar PQRS Propias | Consultas filtradas por `cliente_id` con índice dedicado. Pagina resultados. |
| CU-05 | Gestionar Bandeja Entrada | Paginación y filtros sobre miles de PQRS. Requiere índices y consultas optimizadas. |
| CU-06 | Tramitar PQRS | Persiste cambios de estado con justificación. Genera entradas en tabla `tramite` (log de negocio) y `auditoria` (log técnico). |
| CU-07 | Generar Reportes PDF | JasperReports o iText. Reporte parametrizable, descargable desde el navegador del Gestor. |

Listado completo de CU en [`docs/casos-de-uso/`](./casos-de-uso/). CU-08 (Gestionar Seguridad) queda fuera de alcance MVP.

---

## 3. Vista Lógica

Describe la descomposición del sistema en componentes desde una perspectiva estática de responsabilidades.

### 3.1 Contenedores

Ver [`diagramas/arquitectura/2-vista-logica.puml`](./diagramas/arquitectura/2-vista-logica.puml).

**Frontend:**

- `pqrs-frontend-mobile` — App del Cliente. Angular + Ionic + Capacitor. Mobile-first. PWA por defecto, compilable a Android/iOS nativos.
- `pqrs-frontend-web` — App del Gestor. Angular + Ionic + Tailwind. Pensada para desktop (sidebar + tabla + dashboard).

**Backend:**

- `pqrs-api` — Controllers REST. Punto de entrada HTTP. Valida contratos JSON, delega al dominio.
- `pqrs-domain` — Entidades y reglas de negocio puras. Sin dependencia de Spring. Define puertos (interfaces) que la infraestructura implementa.
- `pqrs-notificaciones` — Cliente SMTP. Plantillas de correo para radicación, cambios de estado, contraseñas autogeneradas. Envío asíncrono.
- `pqrs-archivos` — Adaptador del NAS/FileSystem. Guarda y recupera PDF adjuntos.
- `shared/security` — Spring Security + JWT + BCrypt. Roles: cliente, gestor, admin.
- `shared/auditoria` — Aspecto AOP que registra cada operación CRUD del dominio (qué acción, qué usuario, cuándo).
- `shared/logging` — Logback configurado. Captura y persiste errores estructurados.

**Infraestructura externa:**

- PostgreSQL primario + réplica (failover manual).
- NAS / FileSystem para adjuntos PDF.
- SMTP Gateway (Postfix, AWS SES, o equivalente).

### 3.2 Descripción de capas del backend

| Capa | Responsabilidad |
|---|---|
| **API REST** | Endpoints HTTP. Valida payload JSON, autentica vía JWT, delega al dominio. |
| **Dominio (puerto)** | Casos de uso del negocio: radicar, tramitar, autenticar, generar reporte. Sin dependencia de Spring. |
| **Persistencia (adaptador)** | Implementación JPA de los puertos del dominio. Gestiona transacciones y mapeo objeto-relacional. |
| **Integraciones (adaptador)** | Implementación de clientes externos: email, NAS, generador PDF. |
| **Cross-cutting (shared)** | Security, Auditoría, Logging. Se aplican vía interceptores Spring y aspectos AOP. |

---

## 4. Vista de Procesos

Describe el comportamiento dinámico en tiempo de ejecución: secuencias entre componentes y mecanismos asíncronos.

### 4.1 Proceso: Radicar PQRS

Ver [`diagramas/arquitectura/3-vista-procesos-radicar.puml`](./diagramas/arquitectura/3-vista-procesos-radicar.puml).

Flujo clave:

1. Cliente envía formulario + PDF vía `POST /api/pqrs`.
2. Si el número de identificación no existe en BD: el dominio crea el usuario automáticamente con clave aleatoria (CU-01).
3. PDF se persiste en NAS (no en BD).
4. Se genera radicado `PQRS-YYYY-NNNNNN` y se persiste la PQRS con estado `nuevo`.
5. Respuesta 201 inmediata al cliente.
6. **Asíncrono:** Notif envía correo de confirmación. Si SMTP falla, reintenta sin afectar la respuesta UI.

### 4.2 Proceso: Tramitar PQRS

Ver [`diagramas/arquitectura/3-vista-procesos-tramitar.puml`](./diagramas/arquitectura/3-vista-procesos-tramitar.puml).

Flujo clave:

1. Gestor autenticado abre Bandeja con filtros (`GET /api/pqrs?estado=nuevo`).
2. Selecciona PQRS, cambia estado, ingresa justificación obligatoria.
3. `PUT /api/pqrs/{id}/tramitar` — el dominio valida justificación no vacía.
4. Se actualiza `pqrs.estado` + se inserta `tramite` (estado_anterior, estado_nuevo, justificacion, timestamp, gestor_id).
5. AOP audita la operación en `auditoria`.
6. **Asíncrono:** Notif avisa al cliente del cambio.

### 4.3 Proceso: Generar Reporte PDF

Ver [`diagramas/arquitectura/3-vista-procesos-reporte.puml`](./diagramas/arquitectura/3-vista-procesos-reporte.puml).

Flujo clave:

1. Gestor aplica filtros (opcional) + click "Exportar PDF".
2. Backend consulta PQRS con filtros aplicados.
3. JasperReports/iText renderiza PDF con plantilla parametrizable.
4. Respuesta con `Content-Type: application/pdf` fuerza descarga.

---

## 5. Vista de Desarrollo

Describe la organización del código fuente en módulos, paquetes y dependencias.

Ver [`diagramas/arquitectura/4-vista-desarrollo.puml`](./diagramas/arquitectura/4-vista-desarrollo.puml).

### 5.1 Estructura del backend (hexagonal)

```
backend/
├── api/
│   └── rest/                              # Controllers HTTP
├── domain/
│   ├── model/                             # POJOs puros (Usuario, Pqrs, Tramite, ...)
│   ├── service/                           # Casos de uso (RadicarPqrsService, ...)
│   └── port/                              # Interfaces (PqrsRepository, NotificacionPort, ...)
├── infrastructure/
│   ├── persistencia/                      # JPA Adapters
│   └── integraciones/                     # Email, NAS, PDF Adapters
└── shared/
    ├── security/                          # JWT + BCrypt + Roles
    ├── auditoria/                         # AOP Aspect
    └── logging/                           # GlobalErrorHandler
```

**Regla de oro:** `domain/` NO importa Spring ni JPA. Define interfaces que la `infrastructure/` implementa. Esto permite testear el dominio sin contexto Spring y cambiar la persistencia sin tocar reglas de negocio.

### 5.2 Estructura del frontend

```
frontend/pqrs-app/src/app/
├── core/                                  # Servicios singleton (auth, pqrs, guards, interceptors)
├── shared/                                # Componentes reutilizables
├── web/                                   # Pages exclusivas del Gestor
│   ├── login/
│   ├── dashboard/
│   └── tramite/
└── mobile/                                # Pages exclusivas del Cliente
    ├── login/
    ├── radicar/
    ├── historial/
    └── detalle/
```

### 5.3 Módulos clave

| Módulo / Paquete | Responsabilidad |
|---|---|
| `api/rest/` | Controllers REST. Valida entrada, delega al dominio. |
| `domain/model/` | Entidades puras: `Usuario`, `Pqrs`, `Tramite`, `Adjunto`. |
| `domain/service/` | Servicios de aplicación: `RadicarPqrsService`, `TramitarPqrsService`, `GenerarReporteService`. |
| `domain/port/` | Interfaces (puertos) implementadas por la infraestructura. |
| `infrastructure/persistencia/` | Adaptadores JPA. Conecta con PostgreSQL. |
| `infrastructure/integraciones/` | Adaptadores: `EmailAdapter`, `NasAdjuntoAdapter`, `PdfReportAdapter`. |
| `shared/security/` | Autenticación JWT, autorización por roles, hashing BCrypt. |
| `shared/auditoria/` | Aspecto AOP que intercepta CRUD y registra en `auditoria`. |
| `shared/logging/` | Manejador global de errores + logging estructurado. |
| `core/` (front) | Servicios HTTP, guards, interceptors, models compartidos. |

---

## 6. Vista Física (Despliegue)

Describe la distribución del software en hardware y la red.

Ver [`diagramas/arquitectura/5-vista-fisica.puml`](./diagramas/arquitectura/5-vista-fisica.puml).

### 6.1 Topología

| Componente | Tecnología | Puerto |
|---|---|---|
| Balanceador de Carga | Nginx o HAProxy | TCP 443 (HTTPS entrada) |
| Servidor Web Estático | Nginx (sirve bundle Angular) | TCP 80/443 |
| Cluster Servidores App | Java Spring Boot embedded Tomcat | TCP 8080 (interno) |
| Base de Datos Primaria | PostgreSQL 15+ | TCP 5432 |
| Base de Datos Réplica | PostgreSQL 15+ (standby) | TCP 5432 (replicación async) |
| Almacenamiento NAS | NFS Share | TCP 2049 |
| SMTP Gateway | Postfix / AWS SES | SMTP TCP 587 (TLS) |

### 6.2 Propiedades de despliegue

- **HTTPS obligatorio.** Sin entrada TCP 80 (redirige a 443 en el balanceador).
- **Cluster sin estado.** Sesión mantenida por JWT, no por memoria del servidor. Permite escalar horizontal.
- **Replicación BD asíncrona.** Failover manual a réplica en caída del primario.
- **Backup diario.** `pg_dump` corre en la réplica, sin afectar el primario.
- **Adjuntos en NAS, no en BD.** Crecimiento del 200% en archivos no impacta tamaño de tablas.

---

## 7. Vista de Datos

> El modelo entidad-relación completo y el diccionario de datos viven en [`11-Modelo-Entidad-Relacion.md`](./11-Modelo-Entidad-Relacion.md). Aquí solo se hace referencia a las entidades principales.

### 7.1 Entidades principales

| Entidad | Descripción |
|---|---|
| `usuario` | Centraliza Cliente, Gestor y Admin. Discriminado por el atributo `rol` (CHECK enum). |
| `pqrs` | Cabecera de cada radicado. Estado, tipo, fechas, FK al cliente y al gestor asignado. |
| `tramite` | Log de cambios de estado de la PQRS. Una PQRS tiene N trámites. |
| `adjunto` | Metadata del PDF adjunto. El archivo binario vive en NAS. |
| `notificacion` | Cola de envío de correos. Estado para retry. |
| `auditoria` | Log técnico genérico de operaciones CRUD. Generado por AOP. |

### 7.2 Diferencia entre `tramite` y `auditoria`

- `tramite` = **log de negocio.** Visible al cliente (su PQRS pasó a `en_proceso` con justificación). Conocido por el dominio.
- `auditoria` = **log técnico.** Interno, generado por AOP. Para forensics e investigación (quién, cuándo, qué payload).

---

## 8. Trazabilidad RNF → Arquitectura

Mapeo de cada RNF (de `8-Requerimientos-No-Funcionales.md`) a las vistas, capas y componentes que lo realizan.

| RNF | Nombre | Vistas | Capa / Componente | Mecanismo |
|---|---|---|---|---|
| RNF-01 | Arquitectura Tecnológica y Persistencia | Lógica, Desarrollo, Física, Datos | Stack completo + `infrastructure/persistencia/` | OpenJDK + Spring Boot + Postgres + Angular + Ionic + JPA/Hibernate + Nginx |
| RNF-02 | Seguridad, Autenticación y Control de Accesos | Lógica, Procesos, Datos | `shared/security`, `api/rest/auth`, `usuario.clave_hash`, `usuario.rol` | BCrypt para hash. JWT + Roles. HTTPS en balanceador. `RoleGuard` en endpoints. |
| RNF-03 | Interoperabilidad, Integración y Comunicación | Lógica, Procesos, Casos Uso | `api/rest/`, `pqrs-notificaciones` | API REST/JSON sobre HTTPS. Notificaciones asíncronas (no bloquean respuesta). Códigos HTTP estándar (201, 400, 401, 403, 404, 500). Preparado para sumar SOAP si requiere integración BI futura. |

Detalle completo en [`10-Cumplimiento-RNF-PQRS.md`](./10-Cumplimiento-RNF-PQRS.md).

---

## 9. Referencias

1. P. Kruchten, "The 4+1 View Model of Architecture," _IEEE Software_, vol. 12, no. 6, pp. 42–50, nov. 1995.
2. C. A. Lopez Ospina, "Enunciado del Proyecto-Final — Sistema PQRS SuperMarket," Fundación Universitaria Konrad Lorenz, Ingeniería de Software I, 2026.
3. Spring Boot Reference Documentation, [docs.spring.io/spring-boot](https://docs.spring.io/spring-boot/).
4. OWASP Authentication Cheat Sheet, [cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).
