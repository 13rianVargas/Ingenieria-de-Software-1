# Proyecto-Final/database

Modulo de base de datos del sistema PQRS. **PostgreSQL 15 en Neon** (cloud, compartido por todo el equipo) + **Flyway** para migraciones versionadas.

Owner: **Brian Vargas** (`@13rianVargas`).

Reglas operativas detalladas en [`AGENTS.md`](./AGENTS.md).

---

## Arquitectura de la BD

| Recurso | Quien lo gestiona |
|---|---|
| Proyecto Neon `pqrs` | Brian (admin) |
| Branch `dev` (compartido por el equipo) | Brian crea, todos consumen |
| Migraciones Flyway (correrlas) | Brian con rol `neondb_owner` |
| Lectura/escritura de datos | Todos los devs con rol `pqrs_app` |

**Una sola BD compartida.** Datos comunes para los 4 devs. Si necesitas datos aislados para experimentar destructivo, crea tu propio branch Neon (opcional, no requerido).

---

## Conexion (devs frontend/backend)

Brian comparte 2 connection strings via canal privado (WhatsApp o DM, **nunca git/Slack publico**):

1. **`DATABASE_URL`** — endpoint pooled, para Spring Boot en runtime.
2. **`DATABASE_URL_DIRECT`** — endpoint directo, solo si necesitas correr Flyway o `psql` manual.

Setup local:

```bash
cd Proyecto-Final/database
cp .env.example .env
# Editar .env con las URLs que te paso Brian
```

`.env` esta gitignored. Nunca commitear.

Para conectar con `psql`:

```bash
source .env   # cargar variables
psql "$DATABASE_URL_DIRECT" -c "SELECT current_database(), current_user;"
```

Para verificar el schema:

```bash
psql "$DATABASE_URL_DIRECT" -c "\dt"
```

---

## Aplicar migraciones (solo Brian)

Prerequisito: Flyway CLI instalado.

```bash
brew install flyway   # macOS
# o ver https://flywaydb.org/download para otros sistemas
```

Aplicar todas las migraciones pendientes:

```bash
cd Proyecto-Final/database
source .env   # cargar DATABASE_URL_DIRECT
flyway -configFiles=flyway.conf migrate
```

Verificar estado:

```bash
flyway -configFiles=flyway.conf info
```

Salida esperada: tabla con cada migracion `V{N}__*.sql` en estado `Success`.

### Que hacer si una migracion falla

1. Leer el error de Flyway (mensaje SQL exacto).
2. Corregir el `.sql` problematico **solo si NO se aplico aun** (estado `Pending`).
3. Si ya se aplico parcialmente y fallo: marcar como `Failed` y crear nueva migracion `V{N+1}__fix_*.sql` que repare. **Nunca editar la fallida** porque rompe checksum.

---

## Cargar datos demo (opcional)

```bash
source .env
psql "$DATABASE_URL_DIRECT" < seeds/demo.sql
```

Crea 4 usuarios y 3 PQRS de ejemplo. **NO ejecutar contra produccion** (cuando exista).

Para limpiar datos demo:

```bash
psql "$DATABASE_URL_DIRECT" -c "TRUNCATE auditoria, notificacion, adjunto, tramite, pqrs, usuario RESTART IDENTITY CASCADE;"
```

---

## Estructura del modulo

```
database/
├── README.md                 # este archivo
├── AGENTS.md                 # reglas operativas
├── CLAUDE.md                 # apunta a AGENTS.md
├── .env.example              # plantilla connection strings
├── flyway.conf               # config Flyway CLI
├── migrations/               # Flyway versionado (se ejecuta)
│   ├── V1__usuarios.sql
│   ├── V2__pqrs.sql
│   ├── V3__tramites_adjuntos.sql
│   ├── V4__notificaciones.sql
│   └── V5__auditoria.sql
├── seeds/                    # datos demo
│   └── demo.sql
├── schema/                   # referencia humana
│   └── README.md
└── er-diagram/               # apunta al MER en docs/
    └── README.md
```

---

## Modelo de datos

Especificacion completa en [`../docs/11-Modelo-Entidad-Relacion.md`](../docs/11-Modelo-Entidad-Relacion.md).

Resumen:

| Tabla | Proposito |
|---|---|
| `usuario` | Cliente, Gestor y Admin. Rol via CHECK constraint, sin tabla rol separada. |
| `pqrs` | Cabecera del radicado. Estado actual + FK al cliente y al gestor. |
| `tramite` | Log de negocio: cada cambio de estado de una PQRS. |
| `adjunto` | Metadata de los PDF adjuntos (binario vive en NAS, no en Neon). |
| `notificacion` | Cola de correos transaccionales con retry. |
| `auditoria` | Log tecnico via AOP del backend. Toda operacion CRUD. |

---

## Conexion desde el backend (Spring Boot)

Juli Criollo configura `application.yml`:

```yaml
spring:
  datasource:
    url: ${DATABASE_URL}              # pooled endpoint de Neon
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 10
  jpa:
    hibernate:
      ddl-auto: validate              # Flyway controla schema, JPA solo valida
    properties:
      hibernate.dialect: org.hibernate.dialect.PostgreSQLDialect
  flyway:
    enabled: false                    # Solo Brian aplica migraciones manualmente
                                      # Cambiar a true cuando equipo este coordinado
    locations: filesystem:../database/migrations
```

**Importante:** `spring.flyway.enabled=false` para evitar que cada dev que arranca el backend intente aplicar migraciones contra Neon (causa locks y conflictos). Solo Brian las aplica. Cuando el equipo este coordinado, pasar a `true` con perfil `local` solo.

---

## Reglas de migraciones

- **Naming:** `V{N}__descripcion_corta.sql` (snake_case, dos underscores entre numero y nombre).
- **Numeracion secuencial:** V1, V2, V3... Sin saltos. Cuidado con conflictos cuando varios PRs corren en paralelo.
- **Nunca editar una migracion ya aplicada.** Crear nueva. Flyway falla si detecta hash distinto.
- **Una migracion = un cambio logico.** No mezclar crear tabla con cambiar columna en el mismo archivo.
- **Comentarios obligatorios:** usar `COMMENT ON TABLE` y `COMMENT ON COLUMN` para campos no obvios.

---

## Troubleshooting

| Problema | Solucion |
|---|---|
| `connection refused` o `timeout` | Verifica `sslmode=require` en URL. Neon exige SSL. |
| `password authentication failed` | Pide el password actualizado a Brian. Pudo haber rotado. |
| Flyway: `checksum mismatch` | Alguien edito una migracion ya aplicada. Crear nueva con el fix. |
| Cold start lento (~1s primer query) | Normal: Neon free tier auto-suspende compute tras 5 min inactivo. |
| Storage warning >400MB | Borrar datos viejos de auditoria o crear branch nuevo. |
| Quiero datos aislados sin afectar al equipo | Crear branch Neon propio desde la UI: Settings → Branches → New branch. |

---

## Decisiones lockeadas

- **Sin tabla `rol` separada.** `usuario.rol` usa `CHECK IN ('cliente','gestor','admin')`. Simpler, sin join. Tradeoff aceptado: agregar rol nuevo = migracion.
- **Adjuntos en NAS, no en BD.** La metadata si vive en `adjunto`, el binario PDF vive en almacenamiento externo.
- **BCrypt cost 12** para hashing de claves.
- **Logs duales:** `tramite` (negocio, visible cliente) vs `auditoria` (tecnico, AOP).
- **Sin Docker local.** La BD es Neon compartida. Si necesitas desarrollo offline, crea tu propio Postgres local y apunta `DATABASE_URL` ahi.
