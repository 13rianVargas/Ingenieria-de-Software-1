# PLAN-BACK — Backend Spring Boot (Fase 2)

## 0. Contexto rápido

- **Owner**: Juli Criollo (`@julianhomezdev`).
- **Branch**: `feature/backend-core` (crear desde `develop`).
- **Estado actual**: scaffold Spring Boot 3.3 + JJWT 0.12.5 + Testcontainers en `Proyecto-Final/backend/pqrs/`. **Crítico**: scaffold roto — `application.yml` excluye DataSource/JPA/Flyway autoconfigure, `UsuarioControlador` sin `@RestController`, `ServicioRegistroUsuario` sin `@Service`, `CodificadorClave` sin impl, sin `SecurityConfig`, sin tests.
- **Path Java**: `co.edu.konrad.pqrs`.
- **Definición Done**: backend funcional con CU-01..07 + RF-12 desplegado en Render, tests JUnit ≥ 70 % coverage, Swagger UI accesible.
- **Bloquea a**: PLAN-WEB.md y PLAN-MOBILE.md (contrato endpoints REST).

---

## 1. Pre-requisitos

| Herramienta | Versión | Verificar |
|---|---|---|
| JDK Temurin | 17 | `java -version` |
| Maven Wrapper | bundled | `./mvnw -v` (en `Proyecto-Final/backend/pqrs/`) |
| Docker Desktop | ≥ 24 | `docker --version` (necesario para Testcontainers) |
| IDE | IntelliJ Community / VS Code + Java extension pack | — |
| `DATABASE_URL` pooled de Neon | (de Brian por WhatsApp) | `psql "$DATABASE_URL" -c "SELECT 1;"` |

---

## 2. Tareas en orden estricto

### T-2.1 Fix scaffold roto (~2 hrs)

**Objetivo**: backend arranca, conecta a Neon, Swagger UI accesible.

**Paso 2.1.1 — Limpiar `application.yml` + borrar `application.properties` duplicado**

Reemplazar el contenido de `Proyecto-Final/backend/pqrs/src/main/resources/application.yml`:

```yaml
spring:
  application:
    name: pqrs
  datasource:
    url: ${DATABASE_URL}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 2
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate.dialect: org.hibernate.dialect.PostgreSQLDialect
      hibernate.jdbc.time_zone: UTC
    open-in-view: false
  flyway:
    enabled: false   # CI (db-migrate.yml) es la única fuente de verdad

server:
  port: ${PORT:8080}

springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    operationsSorter: method

jwt:
  secret: ${JWT_SECRET:dev-secret-must-be-overridden-32chars-min}
  expiration-ms: 28800000   # 8 horas

logging:
  level:
    co.edu.konrad: INFO
    org.springframework.security: WARN
```

Eliminar `Proyecto-Final/backend/pqrs/src/main/resources/application.properties` (está duplicado roto sin indentación).

**Paso 2.1.2 — Sumar dependencies faltantes a `pom.xml`**

Antes de la etiqueta `</dependencies>`, agregar:

```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.3.0</version>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
  <groupId>software.amazon.awssdk</groupId>
  <artifactId>s3</artifactId>
  <version>2.25.0</version>
</dependency>
<dependency>
  <groupId>org.aspectj</groupId>
  <artifactId>aspectjweaver</artifactId>
</dependency>
```

Verificar build:
```bash
cd Proyecto-Final/backend/pqrs && ./mvnw clean compile
```

**Paso 2.1.3 — Arreglar anotaciones Spring de `UsuarioControlador`**

Editar `Proyecto-Final/backend/pqrs/src/main/java/co/edu/konrad/pqrs/api/rest/UsuarioControlador.java`:

```java
package co.edu.konrad.pqrs.api.rest;

import co.edu.konrad.pqrs.domain.model.Usuario;
import co.edu.konrad.pqrs.domain.service.ServicioRegistroUsuario;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioControlador {

    private final ServicioRegistroUsuario servicioRegistro;

    public UsuarioControlador(ServicioRegistroUsuario servicioRegistro) {
        this.servicioRegistro = servicioRegistro;
    }

    @PostMapping("/registro")
    public ResponseEntity<RegistroUsuarioResponse> registrar(@Valid @RequestBody RegistroUsuarioRequest request) {
        Usuario usuario = new Usuario(
                request.tipoDoc(), request.numDoc(), request.nombres(),
                request.apellidos(), request.email(), request.telefono(), request.clave());
        Usuario registrado = servicioRegistro.registrar(usuario);
        return ResponseEntity.ok(RegistroUsuarioResponse.desde(registrado));
    }
}
```

**Paso 2.1.4 — Anotar `ServicioRegistroUsuario` como `@Service` + extraer `CodificadorClave`**

Mover `CodificadorClave` a archivo propio `domain/port/CodificadorClave.java`:

```java
package co.edu.konrad.pqrs.domain.port;

public interface CodificadorClave {
    String codificar(String claveRaw);
}
```

Editar `ServicioRegistroUsuario.java`:

```java
package co.edu.konrad.pqrs.domain.service;

import co.edu.konrad.pqrs.domain.model.Usuario;
import co.edu.konrad.pqrs.domain.port.CodificadorClave;
import co.edu.konrad.pqrs.domain.port.UsuarioRepositorio;
import org.springframework.stereotype.Service;

@Service
public class ServicioRegistroUsuario {

    private final UsuarioRepositorio usuarioRepositorio;
    private final CodificadorClave codificadorClave;

    public ServicioRegistroUsuario(UsuarioRepositorio usuarioRepositorio, CodificadorClave codificadorClave) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.codificadorClave = codificadorClave;
    }

    public Usuario registrar(Usuario usuario) {
        if (usuarioRepositorio.existePorEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese correo");
        }
        String hash = codificadorClave.codificar(usuario.getClaveHash());
        Usuario conHash = new Usuario(
                usuario.getTipoDoc(), usuario.getNumDoc(), usuario.getNombres(),
                usuario.getApellidos(), usuario.getEmail(), usuario.getTelefono(), hash);
        return usuarioRepositorio.guardar(conHash);
    }
}
```

Crear impl `infrastructure/security/BcryptCodificadorClave.java`:

```java
package co.edu.konrad.pqrs.infrastructure.security;

import co.edu.konrad.pqrs.domain.port.CodificadorClave;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class BcryptCodificadorClave implements CodificadorClave {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Override
    public String codificar(String claveRaw) {
        return encoder.encode(claveRaw);
    }

    public boolean verifica(String claveRaw, String hashGuardado) {
        return encoder.matches(claveRaw, hashGuardado);
    }
}
```

**Paso 2.1.5 — Crear `SecurityConfig`**

`Proyecto-Final/backend/pqrs/src/main/java/co/edu/konrad/pqrs/infrastructure/security/SecurityConfig.java`:

```java
package co.edu.konrad.pqrs.infrastructure.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/pqrs/anonimo", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/actuator/health").permitAll()
                .requestMatchers("/api/pqrs/mis/**").hasRole("cliente")
                .requestMatchers("/api/pqrs/**").hasAnyRole("gestor", "admin", "cliente")
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
            "http://localhost:4200",
            "http://localhost:8100",
            "capacitor://localhost",
            "https://localhost",
            "https://<DOMINIO-WEB-PROD>"   // sustituir cuando Santi haga deploy
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

**Paso 2.1.6 — Verificación**

```bash
cd Proyecto-Final/backend/pqrs
DATABASE_URL="<DATABASE_URL pooled>" ./mvnw spring-boot:run
```

Esperado:
- Logs: `Tomcat started on port 8080`.
- `curl http://localhost:8080/actuator/health` → `{"status":"UP"}`.
- Navegador: `http://localhost:8080/swagger-ui.html` → UI Swagger.

**Commits granulares**:
1. `fix(backend): restore datasource autoconfigure and add full application config`
2. `chore(backend): add springdoc actuator s3 aspectj dependencies`
3. `fix(backend): add rest controller annotations to usuario endpoint`
4. `refactor(backend): extract codificador clave port and add bcrypt impl`
5. `feat(backend): add security config with jwt filter cors`

---

### T-2.2 CU-02 Autenticación JWT (~3 hrs)

**Objetivo**: `POST /api/auth/login` retorna JWT válido. Filter valida tokens en endpoints protegidos.

**Archivos a crear**:

- `domain/service/ServicioAutenticacion.java`
- `domain/model/Credenciales.java` (record `email`, `clave`)
- `domain/model/TokenSesion.java` (record `token`, `rol`, `expiraEn`)
- `infrastructure/security/JwtService.java`
- `infrastructure/security/JwtAuthenticationFilter.java`
- `api/rest/AuthController.java`
- `api/rest/LoginRequest.java`, `LoginResponse.java`

**Esqueleto `JwtService`** (usa JJWT 0.12.5):

```java
package co.edu.konrad.pqrs.infrastructure.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration-ms}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs = expirationMs;
    }

    public String generar(String email, String rol) {
        return Jwts.builder()
                .subject(email)
                .claim("rol", rol)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key)
                .compact();
    }

    public String extraerEmail(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
    }

    public String extraerRol(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().get("rol", String.class);
    }
}
```

**`AuthController`**:

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final ServicioAutenticacion servicioAutenticacion;

    public AuthController(ServicioAutenticacion s) { this.servicioAutenticacion = s; }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        TokenSesion token = servicioAutenticacion.autenticar(new Credenciales(req.email(), req.clave()));
        return ResponseEntity.ok(new LoginResponse(token.token(), token.rol(), token.expiraEn()));
    }
}
```

**Test integración (`AuthControllerTest`)**:

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@AutoConfigureMockMvc
class AuthControllerTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", postgres::getJdbcUrl);
        r.add("spring.datasource.username", postgres::getUsername);
        r.add("spring.datasource.password", postgres::getPassword);
        r.add("spring.flyway.enabled", () -> "true");
    }

    @Autowired MockMvc mockMvc;

    @Test
    void loginExitoso() throws Exception {
        // Setup: insertar usuario seed.
        // Llamada: POST /api/auth/login con {email, clave}.
        // Verificar: HTTP 200 + body.token != null.
    }
}
```

**Verificación**:

```bash
./mvnw test -Dtest=AuthControllerTest
```

**Commits**:
1. `feat(backend): add jwt service and authentication filter`
2. `feat(backend): add login endpoint with auth controller`
3. `test(backend): add integration tests for auth login flow`

---

### T-2.3 CU-01 Registro automático (refactor existente, ~1 hr)

**Objetivo**: garantizar que el registro ocurre como `<<include>>` desde CU-03 (no endpoint público de creación de cuenta en MVP).

**Pasos**:

1. Mantener `UsuarioControlador` solo con endpoint `/api/usuarios/registro` accesible **solo desde el dominio** (uso interno). Cambiar `@RestController` a `@RestController` + restricción IP / network internal en `SecurityConfig` (o eliminar el endpoint REST y dejar el servicio interno).
2. Decisión recomendada: **eliminar el endpoint REST `/api/usuarios/registro`**. El registro se invoca desde `PqrsController.radicar()` (T-2.4) cuando el email no existe.
3. `ServicioRegistroUsuario.registrar()` queda como método interno del dominio.

**Commit**: `refactor(backend): scope user registration as internal service invoked from radicar flow`

---

### T-2.4 CU-03 Radicar PQRS (~6 hrs) — CRÍTICO STP

**Objetivo**: endpoint `POST /api/pqrs` recibe PQRS + PDF (multipart), retorna radicado.

**Archivos a crear**:

- `domain/model/Pqrs.java` (record o clase con `tipo`, `asunto`, `descripcion`, `clienteId`).
- `domain/model/EstadoPqrs.java` (enum NUEVO, EN_PROCESO, RESUELTO, RECHAZADO).
- `domain/model/TipoPqrs.java` (enum PETICION, QUEJA, RECLAMO, SUGERENCIA).
- `domain/port/PqrsRepositorio.java`.
- `domain/port/AlmacenAdjuntos.java`.
- `domain/port/NotificadorPort.java`.
- `domain/service/ServicioRadicarPqrs.java`.
- `infrastructure/persistencia/PqrsEntidad.java`, `PqrsJpaRepositorio.java`, `PqrsRepositorioAdaptador.java`.
- `infrastructure/integraciones/r2/R2AlmacenAdjuntos.java` (impl S3 contra Cloudflare R2).
- `api/rest/PqrsController.java`, `RadicarPqrsRequest.java`, `RadicarPqrsResponse.java`.

**Endpoint signature**:

```java
@PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<RadicarPqrsResponse> radicar(
    @Valid @RequestPart("pqrs") RadicarPqrsRequest pqrs,
    @RequestPart(value = "anexo", required = false) MultipartFile anexo,
    Authentication auth
) { ... }
```

**Lógica `ServicioRadicarPqrs`**:

1. Validar request (asunto 5-200, descripcion ≥ 20, tipo enum válido).
2. Validar anexo: solo `application/pdf`, máx 5 MB. Si no cumple, lanzar `AnexoInvalidoException`.
3. Determinar `clienteId`:
   - Si `auth` no null: usar `auth.getName()` (email) → buscar usuario → `clienteId`.
   - Si anónimo: validar `pqrs.email` no null → buscar usuario por email → si no existe, invocar `ServicioRegistroUsuario.registrar()` (T-2.3) → usar nuevo `clienteId`.
4. Generar radicado: `PQRS-YYYY-NNNNNN` (year actual + sequence next).
5. Subir PDF a R2: path `pqrs/{year}/{month}/{radicado}-01.pdf`. Guardar URL en `adjunto`.
6. Persistir `pqrs` con estado `nuevo`.
7. Encolar notificación: insertar fila en `notificacion` con `tipo=radicado_creado`, `estado=pendiente`.
8. Retornar `RadicarPqrsResponse(radicado, fechaRadicado, estado)`.

**Generación de radicado**:

```java
@Component
public class GeneradorRadicado {
    private final JdbcTemplate jdbc;
    public String siguiente() {
        Integer next = jdbc.queryForObject("SELECT nextval('pqrs_radicado_seq')", Integer.class);
        return String.format("PQRS-%d-%06d", LocalDate.now().getYear(), next);
    }
}
```

Sequence ya existe en V2 migration.

**Tests**:

- `ServicioRadicarPqrsTest` (unit, sin Spring): mock `PqrsRepositorio`, `AlmacenAdjuntos`, `NotificadorPort`. Casos: feliz, anexo no PDF, anexo > 5 MB, cliente anónimo nuevo, cliente anónimo existente.
- `PqrsControllerIT` (integration con Testcontainers + LocalStack para S3): radicar happy path end-to-end.

**Commits**:
1. `feat(backend): add pqrs domain model with ports and adapters`
2. `feat(backend): add r2 storage adapter for pqrs attachments`
3. `feat(backend): add radicar pqrs endpoint with multipart upload`
4. `test(backend): add unit and integration tests for radicar pqrs`

---

### T-2.5 CU-04 Consultar PQRS propias (~1 hr)

**Endpoint**: `GET /api/pqrs/mis?radicado=<opt>`.

**Lógica**:
1. Extraer `clienteId` del `Authentication` (rol `cliente`).
2. Query: `SELECT * FROM pqrs WHERE cliente_id = ? AND (radicado = :rad OR :rad IS NULL) ORDER BY fecha_radicado DESC`.
3. Mapear a DTO `PqrsResumen(radicado, fecha, tipo, estado, justificacionUltima)`.

**Tests**: filtros vacíos, con radicado match, sin match.

**Commit**: `feat(backend): add list own pqrs endpoint with optional radicado filter`

---

### T-2.6 CU-05 Bandeja Gestor (~2 hrs)

**Endpoint**: `GET /api/pqrs?estado=<opt>&tipo=<opt>&page=0&size=20`.

**Anotación**: `@PreAuthorize("hasRole('gestor')")`.

**Lógica**: paginación + filtros opcionales sobre `estado` y `tipo`.

**Commit**: `feat(backend): add gestor bandeja endpoint with pagination and filters`

---

### T-2.7 CU-06 Tramitar PQRS (~2 hrs)

**Endpoint**: `PUT /api/pqrs/{id}/estado` body `{estado, justificacion}`.

**Lógica**:
1. Validar justificación ≥ 10 chars no solo espacios.
2. Insertar `tramite` con estado anterior + nuevo + gestor_id + timestamp.
3. Actualizar `pqrs.estado` y `fecha_cierre` si nuevo estado ∈ {resuelto, rechazado}.

**AOP audit aspect**: `@Aspect @Component AuditoriaAspect` intercepta métodos anotados con `@Auditable(accion="...")` y persiste en tabla `auditoria`.

**Commit**: `feat(backend): add tramitar pqrs endpoint with aop audit logging`

---

### T-2.8 CU-07 Reportes (~2 hrs)

**Endpoint**: `GET /api/pqrs/reporte?estado=<opt>&tipo=<opt>` retorna `application/pdf`.

**Lib**: iText 7 community o OpenPDF (BSD).

**Lógica**: query igual que bandeja, renderizar PDF con tabla columnas: Radicado, Fecha, Tipo, Estado, Justificación.

**Commit**: `feat(backend): add pdf report generation for gestor bandeja`

---

### T-2.9 RF-12 Notificaciones async (~2 hrs)

**Objetivo**: enviar correo confirmación al radicar.

**Pasos**:
1. Habilitar `@EnableAsync` en `PqrsApplication`.
2. Crear `infrastructure/integraciones/resend/ResendCliente.java` que hace `POST https://api.resend.com/emails` con header `Authorization: Bearer ${RESEND_API_KEY}`.
3. `@Async public void enviar(NotificacionPendiente n)` procesa cola.
4. Scheduler `@Scheduled(fixedDelay = 30000)` lee `notificacion WHERE estado='pendiente' AND intentos < 5` y envía. Marca `enviada` o incrementa `intentos`. Tras 5 fallos → `fallida`.

**Commit**: `feat(backend): add resend integration for async email notifications`

---

### T-2.10 Deploy en Render (~2 hrs)

**Archivos**:

- `Proyecto-Final/backend/pqrs/Dockerfile`:

```Dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
```

- `Proyecto-Final/backend/pqrs/render.yaml`:

```yaml
services:
  - type: web
    name: pqrs-backend
    runtime: docker
    plan: free
    dockerfilePath: ./Dockerfile
    dockerContext: ./
    envVars:
      - key: DATABASE_URL
        sync: false   # set manual en dashboard
      - key: JWT_SECRET
        generateValue: true
      - key: RESEND_API_KEY
        sync: false
      - key: R2_ACCESS_KEY_ID
        sync: false
      - key: R2_SECRET_ACCESS_KEY
        sync: false
      - key: R2_BUCKET
        value: pqrs-anexos
      - key: R2_ENDPOINT
        sync: false
    healthCheckPath: /actuator/health
```

**Pasos**:
1. Crear cuenta Render (Juli C).
2. New Web Service → Connect repo → seleccionar `feature/backend-core` (luego cambiar a `develop`).
3. Configurar env vars desde dashboard con valores reales.
4. Trigger deploy. Esperar build 5-10 min.
5. URL queda como `https://pqrs-backend-<hash>.onrender.com`.
6. Compartir URL con Santi y Juli A para sus environments.

**Commit**: `chore(backend): add dockerfile and render config for deploy`

---

## 3. Coordinación

- **Bloqueado por**: PLAN-DB.md T-DB.1 (passwords rotadas), T-DB.4 (seeds cargados).
- **Bloquea a**: PLAN-WEB.md, PLAN-MOBILE.md (necesitan URL backend Render + contrato endpoints).
- **Comunicar al merge de T-2.1**: ya pueden empezar T-3.2 (web) y T-4.3 (mobile) con localhost.
- **Comunicar al deploy T-2.10**: dar URL Render para ajustar `environment.prod.ts`.

---

## 4. Troubleshooting

| Error | Fix |
|---|---|
| `Cannot resolve placeholder 'DATABASE_URL'` | env var no inyectada. Local: `export DATABASE_URL=...`. Render: dashboard → env vars. |
| `Flyway migration checksum mismatch` | NO editar migraciones aplicadas. Crear V6 nueva. |
| Tests Testcontainers fallan con "Docker not running" | Iniciar Docker Desktop. |
| `@PreAuthorize` ignorado | Falta `@EnableMethodSecurity(prePostEnabled = true)` en `SecurityConfig`. |
| CORS bloquea frontend dev | Sumar origin a lista en `SecurityConfig.corsConfigurationSource()`. |
| Swagger UI vacío | Spring Boot 3 requiere `springdoc-openapi-starter-webmvc-ui` (no el viejo `springfox`). |
| Render free tier sleep tras 15 min | Pre-warm con curl 5 min antes de demo. |
| `R2_ENDPOINT` desconocido | URL Cloudflare R2: `https://<account-id>.r2.cloudflarestorage.com`. Account ID en Cloudflare dashboard → R2. |

---

## 5. Definition of Done

- [ ] T-2.1 scaffold backend arranca, conecta Neon, Swagger UI accesible.
- [ ] T-2.2 endpoint login devuelve JWT válido + tests.
- [ ] T-2.3 registro automático invocado desde radicar.
- [ ] T-2.4 endpoint radicar funciona end-to-end (auth + anónimo) con PDF en R2.
- [ ] T-2.5 endpoint mis PQRS funciona con filtro.
- [ ] T-2.6 endpoint bandeja funciona paginado + filtros.
- [ ] T-2.7 endpoint tramitar persiste tramite + actualiza pqrs + AOP audita.
- [ ] T-2.8 endpoint reporte retorna PDF.
- [ ] T-2.9 notificaciones async envían correo via Resend.
- [ ] T-2.10 backend desplegado en Render con health check 200.
- [ ] Coverage JaCoCo ≥ 70 %.
- [ ] PR `feature/backend-core` mergeado a `develop`.

---

**Cronograma ajustado** (ver `PLAN-MAESTRO.md` §2 para detalle por día): T-2.1 cabe en D1-D2 (22-23 may), T-2.2..T-2.4 en D3-D5 (24-26 may), T-2.5..T-2.7 en D6-D8 (27-29 may), T-2.8..T-2.10 en D9-D10 (30-31 may). Smoke tests D11 (1-jun). Demo D12 (2-jun). Total ~25 hrs distribuidas en 9 días (≈3 hrs/día).
