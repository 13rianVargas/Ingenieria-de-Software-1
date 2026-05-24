# Proyecto-Final/database

Modulo de base de datos del sistema PQRS. **PostgreSQL 15 en Neon** (cloud, compartido por todo el equipo). Migraciones gestionadas por **Flyway via GitHub Actions** (nadie las corre manualmente en su maquina).

Owner: **Brian Vargas** (`@13rianVargas`).

Reglas operativas detalladas en [`AGENTS.md`](./AGENTS.md).

---

## Arquitectura

| Recurso | Quien lo gestiona |
|---|---|
| Proyecto Neon `pqrs` (cuenta + branch) | Brian (admin) |
| `DATABASE_URL_DIRECT` (rol `neondb_owner`, para Flyway) | GitHub Secret — solo CI |
| `DATABASE_URL` (rol `pqrs_app`, pooled, para backend) | Brian comparte por canal privado |
| Aplicacion de migraciones | GitHub Action `db-migrate` automatica al mergear |
| Lectura/escritura de datos en runtime | Todos los devs/backend con `pqrs_app` |

**Una sola BD compartida.** Datos comunes para los 4 devs. Si necesitas datos aislados para experimentar destructivo, crea tu propio branch Neon (gratis).

---

## Para devs (frontend / backend) — setup en 2 minutos

**NO necesitas instalar Flyway, Docker, ni Postgres local.** Solo:

1. **Pedir `DATABASE_URL` a Brian** (WhatsApp/DM). Te llega algo asi:
   ```
   DATABASE_URL=postgresql://pqrs_app:PASS@ep-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

2. **Crear `.env` local:**
   ```bash
   cd Proyecto-Final/database
   cp .env.example .env
   # Editar .env con la URL que te paso Brian
   ```
   El `.env` esta gitignored — nunca commitearlo.

3. **(Opcional) Confirmar acceso** con cualquier cliente Postgres:
   - **macOS:** `brew install postgresql` → `psql "$DATABASE_URL" -c "\dt"`
   - **Linux:** `apt install postgresql-client` → mismo psql
   - **Windows:** `scoop install postgresql` → mismo psql
   - **Cross-platform GUI (recomendado si no eres CLI):** [DBeaver](https://dbeaver.io/), [PgAdmin](https://www.pgadmin.org/), [TablePlus](https://tableplus.com/). Pega la `DATABASE_URL` como connection string.

4. **Backend Spring Boot (Juli Criollo):** configurar `application.yml` con `${DATABASE_URL}`, mantener `spring.flyway.enabled=false`. Detalle en [`../backend/AGENTS.md`](../backend/AGENTS.md).

5. **Frontend (Santi / Juli Avila):** no consume Neon directo; consume API REST del backend. Nada que configurar aqui.

---

## Para Brian (owner del modulo)

### Setup inicial (una sola vez)

1. **Crear cuenta Neon:** https://console.neon.tech (free tier, sin tarjeta).
2. **Crear proyecto** `pqrs` region `us-east-2` o cercana.
3. **Crear rol `pqrs_app`** en SQL Editor de Neon:
   ```sql
   CREATE ROLE pqrs_app WITH LOGIN PASSWORD 'GENERA_UNA_FUERTE';
   GRANT CONNECT ON DATABASE neondb TO pqrs_app;
   GRANT USAGE ON SCHEMA public TO pqrs_app;
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO pqrs_app;
   GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO pqrs_app;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO pqrs_app;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO pqrs_app;
   ```
4. **Copiar 2 connection strings** desde Neon Dashboard:
   - **Direct** (sin `-pooler`): para Flyway CLI.
   - **Pooled** (`-pooler` en host): para Spring Boot.
5. **Configurar GitHub Secret:**
   - GitHub repo → Settings → Secrets and variables → Actions → New repository secret.
   - Nombre: `DATABASE_URL_DIRECT`. Valor: el connection string direct (rol `neondb_owner`).
6. **Compartir `DATABASE_URL` (pooled, `pqrs_app`)** al equipo via canal privado.

### Aplicar migraciones

Automatico: al mergear PR que toque `migrations/**` a `develop` o `main`, el workflow `db-migrate` corre y aplica.

Manual (cuando quieras forzar): GitHub Actions tab → `db-migrate` → Run workflow. O via CLI:

```bash
gh workflow run db-migrate.yml
```

Verificar resultado en Actions tab. Debe terminar con `Successfully applied N migrations` y `info` muestra tabla con cada `V{N}__*.sql` en `Success`.

### Cargar seeds demo (manual, dev only)

```bash
# Con cualquier cliente Postgres apuntando al DIRECT endpoint
psql "$DATABASE_URL_DIRECT" < seeds/demo.sql
```

Para limpiar datos demo:

```bash
psql "$DATABASE_URL_DIRECT" -c "TRUNCATE auditoria, notificacion, adjunto, tramite, pqrs, usuario RESTART IDENTITY CASCADE;"
```

### (Opcional) Correr Flyway local para troubleshoot

Solo si necesitas debugear una migracion fallida sin esperar al CI. Flyway no acepta credenciales embebidas en URL, hay que parsear primero:

```bash
brew install flyway      # macOS
cd Proyecto-Final/database

# Parsear .env (formato libpq) a vars Flyway
URL="$DATABASE_URL_DIRECT"
export FLYWAY_USER=$(echo "$URL" | sed -E 's|^postgres(ql)?://([^:]+):.*|\2|')
export FLYWAY_PASSWORD=$(echo "$URL" | sed -E 's|^postgres(ql)?://[^:]+:([^@]+)@.*|\2|')
export FLYWAY_URL="jdbc:postgresql://$(echo "$URL" | sed -E 's|^postgres(ql)?://[^@]+@(.*)$|\2|')"

flyway -configFiles=flyway.conf migrate
```

No es parte del flujo normal — el CI es la fuente de verdad.

---

## Estructura del modulo

```
database/
├── README.md                 # este archivo
├── AGENTS.md                 # reglas operativas
├── CLAUDE.md                 # apunta a AGENTS.md
├── .env.example              # plantilla connection strings
├── flyway.conf               # config Flyway CLI (usado por CI y opcionalmente local)
├── migrations/               # Flyway versionado (lo que aplica GH Action)
│   ├── V1__usuarios.sql
│   ├── V2__pqrs.sql
│   ├── V3__tramites_adjuntos.sql
│   ├── V4__notificaciones.sql
│   └── V5__auditoria.sql
├── seeds/                    # datos demo dev only (manual, no via Flyway)
│   └── demo.sql
├── schema/                   # referencia humana (no ejecutable)
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

## Reglas de migraciones

- **Naming:** `V{N}__descripcion_corta.sql` (snake_case, dos underscores entre numero y nombre).
- **Numeracion secuencial:** V1, V2, V3... Sin saltos. Cuidado con conflictos cuando varios PRs corren en paralelo.
- **Nunca editar una migracion ya aplicada.** Crear nueva. Flyway falla con `checksum mismatch` si detecta hash distinto.
- **Una migracion = un cambio logico.** No mezclar crear tabla con cambiar columna en el mismo archivo.
- **Comentarios obligatorios:** usar `COMMENT ON TABLE` y `COMMENT ON COLUMN` para campos no obvios.

---

## Que pasa si una migracion falla

1. Logs en GitHub Actions tab → `db-migrate` → ultima ejecucion.
2. Si **NO se aplico aun** (estado `Pending` o validacion previa rechaza): commitear fix sobre el mismo `.sql` y re-mergear. Solo es valido si la migracion nunca entro a Neon.
3. Si **se aplico parcial o quedo en estado Failed**: crear nueva migracion `V{N+1}__fix_descripcion.sql` que repare el problema. **NUNCA editar la fallida** porque rompe checksum.
4. Si se desincronizo y Flyway no puede continuar: contactar a Brian para `repair` manual con `flyway repair`.

---

## Troubleshooting

| Problema | Solucion |
|---|---|
| `connection refused` o `timeout` | Verifica `sslmode=require` en URL. Neon exige SSL. |
| `password authentication failed` | Pide el password actualizado a Brian. Pudo haber rotado. |
| Cold start lento (~1s primer query) | Normal: Neon free tier auto-suspende compute tras 5 min inactivo. |
| `checksum mismatch` | Alguien edito una migracion ya aplicada. Crear nueva con el fix. |
| Quiero datos aislados sin afectar al equipo | Crear branch Neon propio: Neon UI → Settings → Branches → New branch. Update tu `.env` local con el nuevo connection string. |
| Workflow `db-migrate` no se dispara al mergear | Verificar que tu PR realmente toco `Proyecto-Final/database/migrations/**`. Si no, lanzar manual con `gh workflow run db-migrate.yml`. |
| Necesito un cliente Postgres pero no tengo Homebrew/apt | DBeaver (cross-platform GUI) — descarga directa sin package manager. |

## Health checks pre-demo

Ejecutar 5 min antes de la demo para pre-warm + validar:

```bash
# Conexión
psql "$DATABASE_URL_DIRECT" -c "SELECT 1;"

# 4 usuarios demo presentes
psql "$DATABASE_URL_DIRECT" -c "SELECT count(*) FROM usuario;"

# 3 PQRS demo presentes
psql "$DATABASE_URL_DIRECT" -c "SELECT count(*) FROM pqrs;"

# Flyway aplicado
psql "$DATABASE_URL_DIRECT" -c "SELECT version, success FROM flyway_schema_history ORDER BY installed_rank;"
```

Esperado: ≥ 5 versiones Flyway con `success = true`.

---

## Decisiones lockeadas

- **Sin tabla `rol` separada.** `usuario.rol` usa `CHECK IN ('cliente','gestor','admin')`. Simpler, sin join.
- **Adjuntos en NAS, no en BD.** Metadata si vive en `adjunto`, el binario PDF vive en almacenamiento externo.
- **BCrypt cost 12** para hashing de claves.
- **Logs duales:** `tramite` (negocio, visible cliente) vs `auditoria` (tecnico, AOP).
- **Sin Docker local.** La BD es Neon compartida. Si necesitas desarrollo offline, monta tu propio Postgres y apunta `DATABASE_URL` ahi.
- **Migraciones via GitHub Action.** Devs no instalan Flyway. Brian no aplica manual (excepto troubleshoot).
- **`spring.flyway.enabled=false` en backend.** Evita race conditions cuando varios devs arrancan backend.
