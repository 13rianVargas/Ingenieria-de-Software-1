# AGENTS.md — Database (PQRS)

Owner: **Brian Vargas** (`@13rianVargas`).

Aplica a todo lo que viva en `Proyecto-Final/database/`. Reglas globales en [`../AGENTS.md`](../AGENTS.md).

---

## Stack

- **PostgreSQL 15** — motor relacional.
- **Neon** — host cloud serverless del Postgres. Branch `dev` compartido por todo el equipo (free tier).
- **Flyway CLI** — migraciones versionadas via SQL plano. Instalable con `brew install flyway`.

Justificacion:
- Postgres por requisito academico + soporte JSON, full-text search, indices GIN.
- Neon sobre RDS/Supabase: free tier suficiente, branching tipo git, cold start tolerable para academico, sin tarjeta requerida.
- Flyway sobre Liquibase: SQL puro, sin XML/YAML, mas legible para review.
- **Sin Docker.** La BD vive en Neon. Si necesitas offline, instala Postgres local por tu cuenta.

---

## Estructura

```
Proyecto-Final/database/
├── AGENTS.md              # este archivo
├── README.md              # setup Neon + Flyway CLI
├── .env.example           # plantilla connection strings
├── flyway.conf            # config Flyway CLI
├── migrations/            # Flyway versionado
│   ├── V1__usuarios.sql
│   ├── V2__pqrs.sql
│   ├── V3__tramites_adjuntos.sql
│   ├── V4__notificaciones.sql
│   └── V5__auditoria.sql
├── seeds/
│   └── demo.sql
├── schema/                # referencia humana
│   └── README.md
└── er-diagram/            # apunta al MER en docs/
    └── README.md
```

---

## Reglas de migraciones

1. **Una migracion = un cambio logico.** No mezclar crear tabla + cambiar columna en el mismo archivo.
2. **Nunca editar migracion ya mergeada.** Crear nueva. Flyway falla si detecta hash distinto en migracion aplicada.
3. **Naming:** `V{N}__descripcion_corta.sql` (snake_case, dos underscores entre numero y nombre).
4. **Numeracion secuencial:** V1, V2, V3... No saltar numeros. Cuidado con conflictos cuando varias PRs corren en paralelo.
5. **Idempotencia opcional:** `CREATE TABLE IF NOT EXISTS` para reducir conflictos en dev local. Production = Flyway controla todo.
6. **Comentarios obligatorios:** `COMMENT ON TABLE` y `COMMENT ON COLUMN` para campos no obvios.

Ejemplo migracion:

```sql
-- V3__pqrs.sql
-- Crea tabla principal de PQRS con FK a usuarios.

CREATE TABLE pqrs (
    id              BIGSERIAL PRIMARY KEY,
    radicado        VARCHAR(20)  NOT NULL UNIQUE,
    tipo            VARCHAR(20)  NOT NULL CHECK (tipo IN ('peticion','queja','reclamo','sugerencia')),
    asunto          VARCHAR(200) NOT NULL,
    descripcion     TEXT         NOT NULL,
    estado          VARCHAR(20)  NOT NULL DEFAULT 'radicada',
    cliente_id      BIGINT       NOT NULL REFERENCES usuarios(id),
    gestor_id       BIGINT                REFERENCES usuarios(id),
    fecha_radicado  TIMESTAMP    NOT NULL DEFAULT NOW(),
    fecha_cierre    TIMESTAMP
);

COMMENT ON TABLE pqrs IS 'Radicados PQRS — un registro por solicitud del cliente.';
COMMENT ON COLUMN pqrs.radicado IS 'Numero publico visible al cliente, formato PQRS-YYYY-NNNNNN.';
COMMENT ON COLUMN pqrs.estado IS 'Estados validos: radicada, en_tramite, respondida, cerrada, anulada.';

CREATE INDEX idx_pqrs_estado ON pqrs(estado);
CREATE INDEX idx_pqrs_cliente ON pqrs(cliente_id);
```

---

## Modelo de datos PQRS (esqueleto)

Entidades minimas a modelar (revisar contra `../docs/casos-de-uso/`):

| Entidad | Proposito |
|---|---|
| `usuarios` | Cliente, Gestor, Admin. Campos: email, hash_clave (BCrypt), rol, estado |
| `roles` | Cliente, Gestor, Admin (catalogo) |
| `pqrs` | Radicado principal — descripcion, tipo, estado, FK cliente/gestor |
| `tramites` | Acciones del gestor sobre un PQRS — comentario, cambio estado, timestamp |
| `adjuntos` | Archivos asociados a PQRS — url, tipo, tamano. Binarios en NAS, no en BD |
| `auditoria` | Log de eventos para cumplir RNF — quien, que, cuando |
| `notificaciones` | Cola de envio email/SMS — destinatario, plantilla, estado |

Adaptar nombres y campos exactos al modelo Taller-6 portado a PQRS (`../docs/`).

---

## Setup (todos los devs)

1. Pedir a Brian el `.env` con `DATABASE_URL` (pooled) y `DATABASE_URL_DIRECT` (para migraciones).
2. Crear `.env` local en `Proyecto-Final/database/.env` (gitignored).
3. Verificar conexion:

   ```bash
   source .env
   psql "$DATABASE_URL_DIRECT" -c "\dt"
   ```

## Aplicar migraciones (solo Brian)

```bash
brew install flyway
cd Proyecto-Final/database
source .env
flyway -configFiles=flyway.conf migrate
```

Backend Spring Boot (cuando exista) corre con `spring.flyway.enabled=false` por defecto para evitar conflictos entre devs.

---

## Reglas operativas

- **No** crees `.sql` con nombre raro. Sigue `V{N}__descripcion.sql`.
- **No** edites migraciones ya mergeadas — crea nueva.
- **No** commitees dumps de produccion (`*.dump`, `*.sql.gz`) — `.gitignore` debe bloquearlos.
- **No** hardcodees credenciales en `docker-compose.yml`. Usa variables de entorno con valores default dummy.
- **Si** necesitas cambiar el modelo en runtime: nueva migracion, deploy, no `ALTER` manual.
- **Si** tu cambio impacta queries del backend: avisa a Juli Criollo, PR coordinado.

---

## Que hacer cuando

| Situacion | Accion |
|---|---|
| Tengo conflicto en numero de migracion con PR de otro dev | Renombrar mi `V{N}` al siguiente disponible, push force a mi branch |
| Backend pide un campo que no existe | Crear migracion `V{N+1}__add_campo.sql`, no editar la vieja |
| Necesito borrar data en dev | `seeds/` o script aparte en `tools/`, no via migracion |
| Cold start lento Neon | Normal: free tier suspende compute tras 5 min inactivo. Primer query ~1s |
| `connection refused` Neon | Verificar `sslmode=require` en URL y password actualizado |
| Quiero datos aislados sin afectar al equipo | Crear branch propio en Neon UI: Settings → Branches → New |
