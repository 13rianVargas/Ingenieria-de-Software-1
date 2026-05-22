# PLAN-DB — Base de Datos (Fase 2)

## 0. Contexto rápido

- **Owner**: Brian Vargas (`@13rianVargas`).
- **Branch**: `feature/database-seeds` (crear nuevo desde `develop`).
- **Estado actual**: 5 migraciones Flyway aplicadas a Neon vía GitHub Action `db-migrate.yml`. Schema completo (6 tablas + `flyway_schema_history`).
- **Tablas**: `usuario`, `pqrs`, `tramite`, `adjunto`, `notificacion`, `auditoria`.
- **Definición Done**: seeds cargadas, health checks documentados, coord con Juli C confirmada, GitHub Secret `DATABASE_URL_DIRECT` rotado.

---

## 1. Pre-requisitos

| Herramienta | Versión | Verificar |
|---|---|---|
| psql client | ≥ 14 | `psql --version` |
| gh CLI | ≥ 2.40 | `gh --version` |
| git-filter-repo | ≥ 2.45 | `git filter-repo --version` (instalar `brew install git-filter-repo` si falta) |
| Acceso a Neon dashboard | — | https://console.neon.tech, login con cuenta del proyecto |

---

## 2. Tareas en orden estricto

### T-DB.1 Rotar passwords Neon (T-0.1 del plan maestro)

**Objetivo**: invalidar credenciales del leak `409751b` para mitigar riesgo de seguridad.

**Pasos**:

1. Abrir Neon dashboard → proyecto PQRS → Settings → Roles.
2. Reset password de `neondb_owner` (rol Flyway directo).
3. Reset password de `pqrs_app` (rol pooled del backend).
4. Copiar nuevos connection strings:
   - `DATABASE_URL` (pooled, `pqrs_app`).
   - `DATABASE_URL_DIRECT` (direct, `neondb_owner`).
5. Actualizar GitHub Secret:
   ```bash
   gh secret set DATABASE_URL_DIRECT --body "postgresql://neondb_owner:<NEW_PASS>@<HOST>/neondb?sslmode=require"
   ```
6. Compartir `DATABASE_URL` pooled por **WhatsApp privado** a Juli C, Santi, Juli A. **NUNCA en commit ni issue público**.
7. Editar [`Proyecto-Final/AGENTS.md`](./AGENTS.md) §10.6 → marcar timestamp de rotación.

**Verificación**:

```bash
gh secret list --json name,updatedAt --jq '.[] | select(.name == "DATABASE_URL_DIRECT") | .updatedAt'
```

Debe retornar fecha de hoy.

**Commit message**: `docs: log neon password rotation timestamp`

---

### T-DB.2 Cleanup local del leak `.env` (T-0.2 del plan maestro)

**Objetivo**: borrar blob `.env` de la historia git local para evitar re-push accidental.

**Pasos**:

1. Verificar que stash con `.env` no exista:
   ```bash
   git stash list
   ```
   Si aparece `On <branch>: xd` u otro stash con cambios → `git stash drop stash@{N}` para cada uno.

2. Confirmar que el leak NO está en remoto:
   ```bash
   git fetch --all
   git log --all --remotes -- "**/.env"
   ```
   Esperado: vacío.

3. Si local aún tiene el blob (`git log --all -- "**/.env"` no-vacío):
   ```bash
   git filter-repo --invert-paths --path Proyecto-Final/database/.env --force
   ```

4. Re-añadir el remote (filter-repo lo borra):
   ```bash
   git remote add origin https://github.com/13rianVargas/Ingenieria-de-Software-1.git
   git fetch origin
   ```

5. Verificación final:
   ```bash
   git log --all -- "**/.env"
   ```
   Esperado: vacío.

**Sin commit** (es operación local de mantenimiento).

---

### T-DB.3 Crear `seeds/demo.sql` con hashes BCrypt reales

**Objetivo**: cambiar los hashes dummy `$2a$12$DummyHashReplaceWithRealBcryptHashForDevSeed` por hashes BCrypt reales para `Demo2026!` (la clave plana documentada).

**Pasos**:

1. Generar hash BCrypt cost 12 para `Demo2026!`:
   ```bash
   docker run --rm rcozdemir/htpasswd:latest -B -C 12 -n -b demo 'Demo2026!' | cut -d: -f2
   # Salida ejemplo: $2a$12$abc...xyz
   ```
   Alternativa: pedir a Juli C que ejecute en su consola Java:
   ```java
   System.out.println(new BCryptPasswordEncoder(12).encode("Demo2026!"));
   ```

2. Editar `Proyecto-Final/database/seeds/demo.sql`:
   - Reemplazar los 4 `$2a$12$DummyHashReplaceWithRealBcryptHashForDevSeed` por el hash real.
   - Comentar en línea siguiente: `-- clave plana: Demo2026!  (solo dev/demo, NUNCA en prod)`.

3. Verificar el SQL es válido:
   ```bash
   psql "$DATABASE_URL_DIRECT" -f Proyecto-Final/database/seeds/demo.sql --dry-run 2>&1 | head -10
   ```
   (Postgres no tiene `--dry-run` nativo; alternativa: `psql ... --single-transaction --set ON_ERROR_STOP=on` y luego rollback manual).

**Commit message**: `chore: replace dummy bcrypt hashes with real seeds for demo`

---

### T-DB.4 Cargar seeds en Neon

**Objetivo**: poblar BD con 4 usuarios + 3 PQRS demo + 1 tramite + adjuntos + notificaciones.

**Pasos**:

1. Conectarse a Neon con `DATABASE_URL_DIRECT`:
   ```bash
   psql "$DATABASE_URL_DIRECT" -f Proyecto-Final/database/seeds/demo.sql
   ```

2. Verificar:
   ```bash
   psql "$DATABASE_URL_DIRECT" -c "SELECT count(*) FROM usuario;"      # 4
   psql "$DATABASE_URL_DIRECT" -c "SELECT count(*) FROM pqrs;"          # 3
   psql "$DATABASE_URL_DIRECT" -c "SELECT count(*) FROM tramite;"       # 1
   psql "$DATABASE_URL_DIRECT" -c "SELECT email, rol FROM usuario;"
   ```

3. **NO COMMIT**. Es operación de runtime, no de código.

---

### T-DB.5 Documentar health checks

**Objetivo**: dejar comandos rápidos para verificar BD healthy antes de demo.

**Pasos**:

1. Editar `Proyecto-Final/database/README.md`, sumar sección "Health checks demo" al final:

   ```markdown
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
   ```

**Commit message**: `docs: document pre-demo health check commands for db`

---

### T-DB.6 Coordinar `DATABASE_URL` con backend (Juli C)

**Objetivo**: confirmar que el backend en `feature/backend-core` apunta a `${DATABASE_URL}` (pooled) y no hardcodea ningún URL.

**Pasos**:

1. Esperar a que Juli C termine T-2.1 (fix scaffold backend) en `feature/backend-core`.
2. Revisar PR de backend cuando esté abierto: confirmar `application.yml` tiene `spring.datasource.url: ${DATABASE_URL}`.
3. Aprobar PR si OK; pedir cambios si encuentra hardcode.

**Sin commit propio** (solo review).

---

### T-DB.7 Migración V6 (condicional, solo si backend pide cambio de schema)

**Objetivo**: agregar columnas o índices nuevos si Juli C los necesita durante CU-03..07.

**Pasos** (si aplica):

1. Crear `Proyecto-Final/database/migrations/V6__<descripcion>.sql`.
2. SQL forward-only (sin DROP, sin ALTER destructivo).
3. PR a `develop`. GitHub Action `db-migrate.yml` aplicará automáticamente al merge.

**Si NO aplica**: ignorar tarea.

**Commit message** (si aplica): `feat(db): V6 add <descripcion>`

---

## 3. Coordinación

- **Bloqueado por**: ninguna tarea de otros planes.
- **Bloquea a**:
  - PLAN-BACK.md (Juli C necesita `DATABASE_URL` pooled rotado para empezar).
  - PLAN-CICD.md T-5.1 (backend-ci necesita Postgres Testcontainers, no Neon directo).

---

## 4. Troubleshooting

| Error | Fix |
|---|---|
| `psql: FATAL: password authentication failed` | Password Neon rotada después del último `.env` del dev. Pedir nuevo `DATABASE_URL` a Brian por WhatsApp. |
| `flyway_schema_history` no existe | Workflow `db-migrate.yml` no ha corrido. Hacer push trivial a `develop` con cambio en `migrations/` o disparar manual desde GH Actions UI. |
| Seeds violan UNIQUE (email duplicado) | BD ya tenía datos. Limpiar antes: `psql "$DATABASE_URL_DIRECT" -c "TRUNCATE auditoria, notificacion, adjunto, tramite, pqrs, usuario CASCADE;"`. |
| BCrypt hash genera passwords distintas para el mismo plain | Normal. BCrypt usa salt aleatoria. Cualquier hash válido para `Demo2026!` funciona en login porque la verificación usa la salt embebida en el hash. |
| Neon cold start tarda > 5 s | Free tier. Pre-warm con `curl https://<app-render>/actuator/health` 5 min antes de demo. |
| `git filter-repo` no encontrado | `brew install git-filter-repo` (macOS) o `pip install git-filter-repo`. |

---

## 5. Definition of Done

- [ ] Passwords Neon rotadas.
- [ ] GitHub Secret `DATABASE_URL_DIRECT` actualizado con fecha de hoy.
- [ ] Stash con leak borrado.
- [ ] `seeds/demo.sql` tiene hashes BCrypt reales.
- [ ] Seeds cargadas en Neon (4 usuarios, 3 PQRS, 1 tramite).
- [ ] Health checks documentados en `database/README.md`.
- [ ] `AGENTS.md` §10.6 marcado con timestamp.
- [ ] Coord con Juli C sobre `application.yml` confirmada.
- [ ] PR `feature/database-seeds` mergeado a `develop`.
