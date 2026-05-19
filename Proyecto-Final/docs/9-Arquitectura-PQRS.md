# Arquitectura del Sistema PQRS — SuperMarket

> Documento de arquitectura del **Sistema de PQRS** para SuperMarket. Define las decisiones de fondo (capas hexagonales, BCrypt+JWT, replicacion de BD, NAS para archivos, auditoria via AOP) y las traza al dominio funcional del Proyecto-Final.

---

## 1. Introduccion

### 1.1 Proposito

Describir la arquitectura del sistema PQRS usando el modelo **4+1 vistas** de Kruchten, extendido con Vista de Datos. Cada vista enfoca un aspecto distinto del sistema y conjuntamente cubren los requerimientos funcionales (RF-01 a RF-12) y no funcionales (RNF-01 a RNF-03) ya formalizados en `7-Requerimientos-Funcionales.md` y `8-Requerimientos-No-Funcionales.md`.

### 1.2 Alcance

- Radicacion de PQRS (con anexo PDF, autenticado o anonimo).
- Registro automatico de clientes nuevos al radicar.
- Autenticacion de Cliente y Gestor.
- Consulta y filtrado de PQRS (propias y bandeja general).
- Tramitacion de PQRS (cambio de estado con justificacion obligatoria).
- Generacion de reportes PDF de la bandeja.
- Notificaciones automaticas por correo.

**Fuera de alcance:** integraciones con sistemas externos de BI, reportes BAM en tiempo real, modulo de pagos y validacion crediticia.

### 1.3 Glosario

| Termino | Definicion |
|---|---|
| **PQRS** | Peticion, Queja, Reclamo o Sugerencia. Solicitud que el ciudadano radica ante SuperMarket. |
| **Radicado** | Numero unico autogenerado por el sistema para hacer seguimiento a una PQRS. Formato `PQRS-YYYY-NNNNNN`. |
| **Anexo** | Documento complementario (exclusivamente PDF) adjunto a una PQRS. |
| **Bandeja** | Vista web del Gestor con el listado general de todas las PQRS. |
| **Tramite** | Cada cambio de estado de una PQRS (con justificacion + timestamp). Una PQRS tiene N tramites a lo largo de su vida. |
| **JWT** | JSON Web Token. Token firmado que mantiene la sesion del usuario tras el login. |
| **BCrypt** | Algoritmo de hashing de contraseñas. Estandar OWASP. |
| **NAS** | Network Attached Storage. Servidor de almacenamiento en red para los PDF adjuntos. |
| **AOP** | Aspect-Oriented Programming. Separa concerns transversales (auditoria, logging) del codigo de negocio. |
| **ORM** | Object-Relational Mapping. Capa entre objetos del dominio y tablas relacionales (JPA/Hibernate). |
| **SPA** | Single Page Application. Aplicacion web que carga una sola HTML y actualiza contenido dinamicamente. |

### 1.4 Objetivos arquitectonicos

1. **Seguridad** — Autenticacion robusta con roles, contraseñas cifradas con BCrypt, comunicaciones exclusivamente sobre HTTPS.
2. **Mantenibilidad** — Capas hexagonales para aislar dominio de infraestructura; auditoria centralizada via AOP.
3. **Disponibilidad razonable** — Replica de BD para failover y backup diario sin afectar produccion.
4. **Tecnologia libre de licenciamiento** — Stack 100% open source (OpenJDK + Spring Boot + PostgreSQL + Angular + Nginx).
5. **Interoperabilidad** — API REST con contratos JSON; preparada para exposicion SOAP futura si se requiere integracion B2B.
6. **Dos interfaces independientes** — App Mobile para el Cliente, App Web para el Gestor.

### 1.5 Restricciones arquitectonicas

- Stack 100% open source: Java OpenJDK 17 + Spring Boot 3.x (backend); Angular 20 + Ionic 8 + Tailwind (frontend); PostgreSQL 15+ (BD).
- Comunicaciones externas sobre HTTPS (TCP 443).
- Persistencia con ORM obligatoria (JPA / Hibernate).
- Servidor de aplicaciones avalado (Tomcat embebido de Spring Boot).
- Dos interfaces de presentacion: App Movil (Cliente) y App Web (Gestor).

---

## 2. Vista de Casos de Uso

Esta vista establece los CU arquitectonicamente significativos: aquellos que impactan decisiones de diseño, integraciones o mecanismos concurrentes.

### 2.1 Actores

| Actor | Descripcion |
|---|---|
| **Cliente (Ciudadano)** | Persona natural que radica, consulta y filtra sus PQRS desde la App Movil. |
| **Gestor de PQRS** | Empleado de SuperMarket que tramita radicados desde la App Web. |
| **Administrador** | Rol tecnico con acceso a parametrizacion y auditoria. |
| **Sistema Notificador** | Actor automatico que envia correos electronicos (radicacion, cambio de estado, contraseñas autogeneradas). |

### 2.2 Diagrama general

Ver [`diagramas/arquitectura/1-vista-casos-uso.puml`](./diagramas/arquitectura/1-vista-casos-uso.puml).

### 2.3 Casos de uso arquitectonicamente significativos

| CU | Nombre | Impacto arquitectonico |
|---|---|---|
| CU-01 | Gestionar Registro Cliente | Trigger automatico desde radicar PQRS anonimo. Genera clave temporal con BCrypt. |
| CU-02 | Autenticarse (Login) | JWT + Roles. Punto de entrada de seguridad para Cliente y Gestor. |
| CU-03 | Radicar PQRS | Almacena PDF en NAS (no en BD), genera radicado unico, dispara correo asincrono. |
| CU-05 | Gestionar Bandeja Entrada | Paginacion y filtros sobre miles de PQRS. Requiere indices y consultas optimizadas. |
| CU-06 | Tramitar PQRS | Persiste cambios de estado con justificacion. Genera entradas en tabla `tramite` (log de negocio) y `auditoria` (log tecnico). |
| CU-07 | Generar Reportes PDF | JasperReports o iText. Reporte parametrizable, descargable desde el navegador del Gestor. |

Listado completo de CU en [`docs/casos-de-uso/`](./casos-de-uso/).

---

## 3. Vista Logica

Describe la descomposicion del sistema en componentes desde una perspectiva estatica de responsabilidades.

### 3.1 Contenedores

Ver [`diagramas/arquitectura/2-vista-logica.puml`](./diagramas/arquitectura/2-vista-logica.puml).

**Frontend:**

- `pqrs-frontend-mobile` — App del Cliente. Angular + Ionic + Capacitor. Mobile-first. PWA por defecto, compilable a Android/iOS nativos.
- `pqrs-frontend-web` — App del Gestor. Angular + Ionic + Tailwind. Pensada para desktop (sidebar + tabla + dashboard).

**Backend:**

- `pqrs-api` — Controllers REST. Punto de entrada HTTP. Valida contratos JSON, delega al dominio.
- `pqrs-domain` — Entidades y reglas de negocio puras. Sin dependencia de Spring. Define puertos (interfaces) que la infraestructura implementa.
- `pqrs-notificaciones` — Cliente SMTP. Plantillas de correo para radicacion, cambios de estado, contraseñas autogeneradas. Envio asincrono.
- `pqrs-archivos` — Adaptador del NAS/FileSystem. Guarda y recupera PDF adjuntos.
- `shared/security` — Spring Security + JWT + BCrypt. Roles: cliente, gestor, admin.
- `shared/auditoria` — Aspecto AOP que registra cada operacion CRUD del dominio (que accion, que usuario, cuando).
- `shared/logging` — Logback configurado. Captura y persiste errores estructurados.

**Infraestructura externa:**

- PostgreSQL primario + replica (failover manual).
- NAS / FileSystem para adjuntos PDF.
- SMTP Gateway (Postfix, AWS SES, o equivalente).

### 3.2 Descripcion de capas del backend

| Capa | Responsabilidad |
|---|---|
| **API REST** | Endpoints HTTP. Valida payload JSON, autentica via JWT, delega al dominio. |
| **Dominio (puerto)** | Casos de uso del negocio: radicar, tramitar, autenticar, generar reporte. Sin dependencia de Spring. |
| **Persistencia (adaptador)** | Implementacion JPA de los puertos del dominio. Gestiona transacciones y mapeo objeto-relacional. |
| **Integraciones (adaptador)** | Implementacion de clientes externos: email, NAS, generador PDF. |
| **Cross-cutting (shared)** | Security, Auditoria, Logging. Se aplican via interceptores Spring y aspectos AOP. |

### 3.3 Especificacion de clases (cobertura entregable opcional)

> **Nota — entregable opcional #14:** Esta vista de desarrollo cubre tambien el entregable opcional **Especificacion de Clases**. La estructura de paquetes Java y los componentes Angular descritos en la Vista de Desarrollo (seccion 5) constituyen la especificacion de clases del sistema. No se genera un diagrama UML de clases separado para evitar redundancia con la vista hexagonal.

---

## 4. Vista de Procesos

Describe el comportamiento dinamico en tiempo de ejecucion: secuencias entre componentes y mecanismos asincronos.

### 4.1 Proceso: Radicar PQRS

Ver [`diagramas/arquitectura/3-vista-procesos-radicar.puml`](./diagramas/arquitectura/3-vista-procesos-radicar.puml).

Flujo clave:

1. Cliente envia formulario + PDF via `POST /api/pqrs`.
2. Si esta anonimo: dominio crea usuario automaticamente con clave aleatoria (CU-01).
3. PDF se persiste en NAS (no en BD).
4. Se genera radicado `PQRS-YYYY-NNNNNN` y se persiste la PQRS con estado `nuevo`.
5. Respuesta 201 inmediata al cliente.
6. **Asincrono:** Notif envia correo de confirmacion. Si SMTP falla, reintenta sin afectar la respuesta UI.

### 4.2 Proceso: Tramitar PQRS

Ver [`diagramas/arquitectura/3-vista-procesos-tramitar.puml`](./diagramas/arquitectura/3-vista-procesos-tramitar.puml).

Flujo clave:

1. Gestor autenticado abre Bandeja con filtros (`GET /api/pqrs?estado=nuevo`).
2. Selecciona PQRS, cambia estado, ingresa justificacion obligatoria.
3. `PUT /api/pqrs/{id}/tramitar` — el dominio valida justificacion no vacia.
4. Se actualiza `pqrs.estado` + se inserta `tramite` (estado_anterior, estado_nuevo, justificacion, timestamp, gestor_id).
5. AOP audita la operacion en `auditoria`.
6. **Asincrono:** Notif avisa al cliente del cambio.

### 4.3 Proceso: Generar Reporte PDF

Ver [`diagramas/arquitectura/3-vista-procesos-reporte.puml`](./diagramas/arquitectura/3-vista-procesos-reporte.puml).

Flujo clave:

1. Gestor aplica filtros (opcional) + click "Exportar PDF".
2. Backend consulta PQRS con filtros aplicados.
3. JasperReports/iText renderiza PDF con plantilla parametrizable.
4. Respuesta con `Content-Type: application/pdf` fuerza descarga.

---

## 5. Vista de Desarrollo

Describe la organizacion del codigo fuente en modulos, paquetes y dependencias.

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

### 5.3 Modulos clave

| Modulo / Paquete | Responsabilidad |
|---|---|
| `api/rest/` | Controllers REST. Valida entrada, delega al dominio. |
| `domain/model/` | Entidades puras: `Usuario`, `Pqrs`, `Tramite`, `Adjunto`. |
| `domain/service/` | Servicios de aplicacion: `RadicarPqrsService`, `TramitarPqrsService`, `GenerarReporteService`. |
| `domain/port/` | Interfaces (puertos) implementadas por la infraestructura. |
| `infrastructure/persistencia/` | Adaptadores JPA. Conecta con PostgreSQL. |
| `infrastructure/integraciones/` | Adaptadores: `EmailAdapter`, `NasAdjuntoAdapter`, `PdfReportAdapter`. |
| `shared/security/` | Autenticacion JWT, autorizacion por roles, hashing BCrypt. |
| `shared/auditoria/` | Aspecto AOP que intercepta CRUD y registra en `auditoria`. |
| `shared/logging/` | Manejador global de errores + logging estructurado. |
| `core/` (front) | Servicios HTTP, guards, interceptors, models compartidos. |

---

## 6. Vista Fisica (Despliegue)

Describe la distribucion del software en hardware y la red.

Ver [`diagramas/arquitectura/5-vista-fisica.puml`](./diagramas/arquitectura/5-vista-fisica.puml).

### 6.1 Topologia

| Componente | Tecnologia | Puerto |
|---|---|---|
| Balanceador de Carga | Nginx o HAProxy | TCP 443 (HTTPS entrada) |
| Servidor Web Estatico | Nginx (sirve bundle Angular) | TCP 80/443 |
| Cluster Servidores App | Java Spring Boot embedded Tomcat | TCP 8080 (interno) |
| Base de Datos Primaria | PostgreSQL 15+ | TCP 5432 |
| Base de Datos Replica | PostgreSQL 15+ (standby) | TCP 5432 (replicacion async) |
| Almacenamiento NAS | NFS Share | TCP 2049 |
| SMTP Gateway | Postfix / AWS SES | SMTP TCP 587 (TLS) |

### 6.2 Propiedades de despliegue

- **HTTPS obligatorio.** Sin entrada TCP 80 (redirige a 443 en el balanceador).
- **Cluster sin estado.** Sesion mantenida por JWT, no por memoria del servidor. Permite escalar horizontal.
- **Replicacion BD asincrona.** Failover manual a replica en caida del primario.
- **Backup diario.** `pg_dump` corre en la replica, sin afectar el primario.
- **Adjuntos en NAS, no en BD.** Crecimiento del 200% en archivos no impacta tamaño de tablas.

---

## 7. Vista de Datos

> El modelo entidad-relacion completo y el diccionario de datos viven en [`11-Modelo-Entidad-Relacion.md`](./11-Modelo-Entidad-Relacion.md). Aqui solo se hace referencia a las entidades principales.

### 7.1 Entidades principales

| Entidad | Descripcion |
|---|---|
| `usuario` | Centraliza Cliente, Gestor y Admin. Discriminado por `rol`. |
| `rol` | Catalogo de roles. |
| `pqrs` | Cabecera de cada radicado. Estado, tipo, fechas, FK al cliente y al gestor asignado. |
| `tramite` | Log de cambios de estado de la PQRS. Una PQRS tiene N tramites. |
| `adjunto` | Metadata del PDF adjunto. El archivo binario vive en NAS. |
| `notificacion` | Cola de envio de correos. Estado para retry. |
| `auditoria` | Log tecnico generico de operaciones CRUD. Generado por AOP. |

### 7.2 Diferencia entre `tramite` y `auditoria`

- `tramite` = **log de negocio.** Visible al cliente (su PQRS paso a `en_proceso` con justificacion). Conocido por el dominio.
- `auditoria` = **log tecnico.** Interno, generado por AOP. Para forensics e investigacion (quien, cuando, que payload).

---

## 8. Trazabilidad RNF → Arquitectura

Mapeo de cada RNF (de `8-Requerimientos-No-Funcionales.md`) a las vistas, capas y componentes que lo realizan.

| RNF | Nombre | Vistas | Capa / Componente | Mecanismo |
|---|---|---|---|---|
| RNF-01 | Arquitectura Tecnologica y Persistencia | Logica, Desarrollo, Fisica, Datos | Stack completo + `infrastructure/persistencia/` | OpenJDK + Spring Boot + Postgres + Angular + Ionic + JPA/Hibernate + Nginx |
| RNF-02 | Seguridad, Autenticacion y Control de Accesos | Logica, Procesos, Datos | `shared/security`, `api/rest/auth`, `usuario.clave_hash`, `usuario.rol` | BCrypt para hash. JWT + Roles. HTTPS en balanceador. `RoleGuard` en endpoints. |
| RNF-03 | Interoperabilidad, Integracion y Comunicacion | Logica, Procesos, Casos Uso | `api/rest/`, `pqrs-notificaciones` | API REST/JSON sobre HTTPS. Notificaciones asincronas (no bloquean respuesta). Codigos HTTP estandar (201, 400, 401, 403, 404, 500). Preparado para sumar SOAP si requiere integracion BI futura. |

Detalle completo en [`10-Cumplimiento-RNF-PQRS.md`](./10-Cumplimiento-RNF-PQRS.md).

---

## 9. Referencias

1. P. Kruchten, "The 4+1 View Model of Architecture," _IEEE Software_, vol. 12, no. 6, pp. 42–50, nov. 1995.
2. C. A. Lopez Ospina, "Enunciado del Proyecto-Final — Sistema PQRS SuperMarket," Fundacion Universitaria Konrad Lorenz, Ingenieria de Software I, 2026.
3. Spring Boot Reference Documentation, [docs.spring.io/spring-boot](https://docs.spring.io/spring-boot/).
4. OWASP Authentication Cheat Sheet, [cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).
