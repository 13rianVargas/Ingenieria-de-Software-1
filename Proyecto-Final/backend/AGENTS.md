# AGENTS.md — Backend (PQRS)

Owner: **Juli Criollo** (`@julianhomezdev`).

Aplica a todo lo que viva en `Proyecto-Final/backend/`. Reglas globales en [`../AGENTS.md`](../AGENTS.md).

---

## Stack

- **Java OpenJDK 17+** — LTS, requisito academico Taller-6.
- **Spring Boot 3.x** — framework principal.
- **Maven** — build y dependency management.
- **PostgreSQL 15+** — BD (managed by Brian, ver `../database/AGENTS.md`).
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
    url: ${DB_URL:jdbc:postgresql://localhost:5432/pqrs_dev}
    username: ${DB_USER:pqrs}
    password: ${DB_PASSWORD:pqrs}
  jpa:
    hibernate:
      ddl-auto: validate          # Flyway controla schema
  flyway:
    enabled: true
    locations: filesystem:../database/migrations

server:
  port: ${PORT:8080}

jwt:
  secret: ${JWT_SECRET:dummy-replace-in-prod}
  expiration-ms: ${JWT_EXP:3600000}
```

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
