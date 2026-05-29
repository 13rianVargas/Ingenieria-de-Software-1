# AGENTS.md — Backend (PQRS)

Owner: **Juli Criollo** (`@julianhomezdev`). **Implementado por Brian** (28-may, Juli C no disponible).

Aplica a todo lo que viva en `Proyecto-Final/backend/`. Reglas globales en [`../AGENTS.md`](../AGENTS.md).

---

## ⚠️ ESTADO: IMPLEMENTADO Y DESPLEGADO (28-may-2026)

Backend completo y LIVE. Las secciones de "esqueleto/propuesta" más abajo son históricas.

- **URL producción**: `https://ingenieria-de-software-1-uxxj.onrender.com` (Render, free tier — hiberna 15 min idle, cold start ~50 s).
- **Código real**: `Proyecto-Final/backend/pqrs/` (NO `backend/` directo).
- **CU implementados**: CU-01..07 + RF-12. 35 tests JUnit, cobertura JaCoCo ~76%.
- **Storage adjuntos**: Cloudflare R2 (S3) — funciona. Sin R2 degrada a marcador `pending-r2://` sin romper radicado.
- **Correos**: **Gmail SMTP** (NO Resend — requería dominio). Worker async cada 30s procesa cola `notificacion`. Entrega a cualquier destinatario.

### Endpoints REALES

| Método | Ruta | Auth |
|---|---|---|
| POST | `/api/auth/login` → `{token, rol, expiraEn}` | público |
| POST | `/api/pqrs` (multipart: `pqrs` JSON + `anexo` PDF opcional) | cliente |
| GET | `/api/pqrs/mis?radicado=<opt>` → **array** (sin paginación) | cliente |
| GET | `/api/pqrs` (bandeja, `?estado&tipo&page&size`) → `{contenido,total,page,size}` | gestor/admin |
| GET | `/api/pqrs/{id}` → detalle + `tramites[]` + `adjuntos[]` | gestor/admin/cliente |
| GET | `/api/pqrs/{id}/anexo` → PDF bytes | gestor/admin/cliente |
| PUT | `/api/pqrs/{id}/estado` (`{estado, justificacion}`) | gestor/admin |
| GET | `/api/pqrs/reporte?estado&tipo` → PDF | gestor/admin |
| GET | `/swagger-ui.html`, `/v3/api-docs`, `/actuator/health` | público |

Demo users (pass `Demo2026!`): `cliente@demo.com`, `gestor@demo.com`, `brian@demo.com` (admin).

### Variables de entorno (Render dashboard)

| Var | Uso |
|---|---|
| `DATABASE_URL` | Neon pooled, formato bare `postgresql://user:pass@host/db?...` (DataSourceConfig lo parsea a JDBC) |
| `JWT_SECRET` | firma HS256 (≥32 chars) |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | Gmail + App Password (vacío = worker correos off) |
| `MAIL_FROM_NOMBRE` | nombre remitente |
| `R2_ENABLED` `R2_ENDPOINT` `R2_ACCESS_KEY_ID` `R2_SECRET_ACCESS_KEY` `R2_BUCKET` | Cloudflare R2 (vacío/false = LocalAlmacen marcador) |
| `MANAGEMENT_HEALTH_MAIL_ENABLED=false` | OBLIGATORIA: MailHealthIndicator cuelga `/actuator/health` (>2min) y tumba el deploy |

### Correr local

```bash
cd Proyecto-Final/backend/pqrs
set -a && source ../.env && set +a   # .env con DATABASE_URL (+ MAIL_*/R2_* opcional)
./mvnw spring-boot:run               # :8080
./mvnw verify -Pcoverage             # tests + JaCoCo (target/site/jacoco/)
```

### Gotchas (resueltos — no re-romper)

1. **JDK 25**: Lombok ≥1.18.42 obligatorio (1.18.32 → `TypeTag UNKNOWN`). Mockito de clases concretas → surefire `net.bytebuddy.experimental=true`.
2. **DATABASE_URL bare**: `DataSourceConfig.java` parsea URI → JDBC + filtra `options=search_path` (Neon pooler lo rechaza). search_path pin a nivel rol.
3. **ddl-auto=none** (+ `hibernate.hbm2ddl.auto=none`): Flyway es source of truth. `validate` falla con SERIAL (Hibernate 6 espera bigint). IDs de entidades = `Integer` (schema es SERIAL).
4. **devtools removido**: interfería con DataSource bean custom.
5. **Render healthCheckPath** debe ser `/actuator/health` (no `/actuator/`).

---

## Stack

- **Java OpenJDK 17+** — LTS, requisito academico Taller-6.
- **Spring Boot 3.x** — framework principal.
- **Maven** — build y dependency management.
- **PostgreSQL 15** en **Neon** (cloud, compartido por el equipo) — managed by Brian, ver `../database/AGENTS.md`.
- **Flyway** — migraciones, autoejecutadas por Spring al boot.
- **JUnit 5 + Spring Boot Test** — unit + integration.
- **Testcontainers** — Postgres real en tests de integracion.
- **BCrypt** — hash de claves.
- **JWT** — tokens de sesion (RFC 7519).

---

## Estructura propuesta — Arquitectura Hexagonal

Basada en Vista de Implementacion del Taller-6, adaptada al dominio PQRS.

```
Proyecto-Final/backend/
├── AGENTS.md
├── README.md
├── pom.xml
├── docker-compose.yml          # backend + postgres para integration tests
├── src/
│   ├── main/
│   │   ├── java/co/edu/konrad/pqrs/
│   │   │   ├── PqrsApplication.java
│   │   │   ├── api/
│   │   │   │   └── rest/                  # Controllers REST
│   │   │   │       ├── PqrsController.java
│   │   │   │       ├── UsuarioController.java
│   │   │   │       └── AuthController.java
│   │   │   ├── domain/                    # Entidades + reglas de negocio puras
│   │   │   │   ├── model/
│   │   │   │   │   ├── Pqrs.java
│   │   │   │   │   ├── Usuario.java
│   │   │   │   │   └── EstadoPqrs.java
│   │   │   │   ├── service/               # Casos de uso / interactors
│   │   │   │   │   ├── RadicarPqrsService.java
│   │   │   │   │   └── TramitarPqrsService.java
│   │   │   │   └── port/                  # Interfaces (puertos)
│   │   │   │       ├── PqrsRepository.java
│   │   │   │       └── NotificacionPort.java
│   │   │   ├── infrastructure/
│   │   │   │   ├── persistencia/          # Adaptadores JPA
│   │   │   │   │   ├── PqrsJpaRepository.java
│   │   │   │   │   ├── PqrsEntity.java
│   │   │   │   │   └── PqrsRepositoryAdapter.java
│   │   │   │   └── integraciones/         # APIs externas (email, SMS)
│   │   │   │       └── EmailAdapter.java
│   │   │   └── shared/
│   │   │       ├── security/              # Spring Security + JWT + BCrypt
│   │   │       ├── auditoria/             # AOP para audit log
│   │   │       ├── logging/               # logback config + filters
│   │   │       └── exception/             # ExceptionHandler global
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-test.yml
│   │       └── db/migration/              # delegar a ../database/migrations/
│   └── test/
│       └── java/co/edu/konrad/pqrs/
│           ├── domain/                    # Unit tests puros
│           └── infrastructure/            # Integration tests con Testcontainers
```

Justificacion hexagonal:
- Aislar dominio puro (Java sin Spring) en `domain/`.
- Adaptadores en `infrastructure/` implementan puertos del dominio.
- Cambiar BD o framework no toca dominio.
- Tests de dominio son rapidos (sin contexto Spring).

---

## Reglas de codigo

| Elemento | Convencion |
|---|---|
| Clases | PascalCase |
| Metodos, variables | camelCase |
| Constantes | UPPER_SNAKE_CASE |
| Paquetes | minusculas, sin guiones, sin underscores |
| Indentacion | 4 espacios |
| Lombok | OK para `@Data`, `@Builder`, `@RequiredArgsConstructor` |
| Anotaciones de Spring | en clases infra, no en dominio |
| Imports sin usar | eliminar antes del PR |
| `System.out.println` | nunca — usar SLF4J logger |
| `throws Exception` | nunca — excepcion especifica o custom |

---

## Configuracion

`application.yml` con perfiles:

```yaml
spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}
  datasource:
    url: ${DATABASE_URL}                # pooled endpoint Neon
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 10
  jpa:
    hibernate:
      ddl-auto: validate                # Flyway controla schema, JPA solo valida
    properties:
      hibernate.dialect: org.hibernate.dialect.PostgreSQLDialect
  flyway:
    enabled: false                      # Solo Brian aplica migraciones (evita conflictos)
    locations: filesystem:../database/migrations

server:
  port: ${PORT:8080}

jwt:
  secret: ${JWT_SECRET:dummy-replace-in-prod}
  expiration-ms: ${JWT_EXP:3600000}
```

`DATABASE_URL` se obtiene pidiendole a Brian (compartido por canal privado).

**Nunca** hardcodear valores reales. Usa env vars con defaults dummy.

---

## Build local

```bash
cd Proyecto-Final/backend
./mvnw clean install          # build + tests
./mvnw spring-boot:run        # arranca en :8080
```

Para integration tests:

```bash
./mvnw verify -Pintegration   # Testcontainers levanta Postgres real
```

---

## Endpoints REST (esqueleto)

| Metodo | Path | Descripcion | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Login, retorna JWT | publico |
| `POST` | `/api/auth/register` | Registro cliente | publico |
| `GET` | `/api/pqrs` | Lista PQRS del usuario logueado | cliente, gestor, admin |
| `POST` | `/api/pqrs` | Radica nuevo PQRS | cliente |
| `GET` | `/api/pqrs/{id}` | Detalle | cliente owner / gestor / admin |
| `PUT` | `/api/pqrs/{id}/tramitar` | Cambia estado, agrega comentario | gestor |
| `GET` | `/api/reportes` | Reportes PDF | gestor, admin |

Contratos exactos coordinados con frontend (Santi + Juli Avila) via OpenAPI/Swagger.

---

## Tests

- **Unit (dominio):** sin contexto Spring, mocks manuales. Rapidos, < 1s.
- **Integration (infra):** `@SpringBootTest` + Testcontainers. Lentos pero realistas.
- **Coverage:** minimo 70% sobre `domain/`. `infrastructure/` no obligatorio.
- **Naming:** `MetodoBajoPrueba_Condicion_ResultadoEsperado()`. Ej: `radicarPqrs_clienteAutenticado_devuelveRadicado()`.

---

## Reglas operativas

- **No** acoplar dominio a Spring. `domain/` no debe importar `org.springframework.*`.
- **No** hacer queries SQL en controllers — eso es trabajo del repositorio.
- **No** retornar entities JPA en endpoints — siempre DTO.
- **No** crear migraciones en `backend/` — van en `../database/migrations/` (coordinar con Brian).
- **No** hardcodear secretos. Todo via env vars.
- **Si** necesitas nuevo endpoint: documenta contrato en Swagger antes de implementar.
- **Si** cambias esquema BD: PR coordinado con Brian (nueva migracion en database/).

---

## Que hacer cuando

| Situacion | Accion |
|---|---|
| Necesito un campo nuevo en BD | Pedir a Brian crear migracion, NO crearla yo |
| Frontend pide endpoint no documentado | Agregar contrato Swagger primero, despues implementar |
| CI Maven verify falla por test integration | Verificar Docker corriendo localmente, Testcontainers necesita Docker |
| Spring boot no arranca por Flyway | Revisar `../database/migrations/` — quizas alguna corrupta |
| JWT secret en codigo | Mover a env var, agregar a documentacion de setup |
