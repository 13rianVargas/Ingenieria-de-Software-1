# AGENTS.md — Database (PQRS)

Owner: **Brian Vargas** (`@13rianVargas`).

Aplica a todo lo que viva en `Proyecto-Final/database/`. Reglas globales en [`../AGENTS.md`](../AGENTS.md).

---

## Stack

- **PostgreSQL 15+** — motor relacional.
- **Flyway** — migraciones versionadas via SQL plano.
- **Docker Compose** — Postgres local para desarrollo.

Justificacion:
- Postgres por requisito academico (Taller-6) + soporte JSON, full-text search, particionado.
- Flyway sobre Liquibase: SQL puro, sin XML/YAML, mas legible para review.

---

## Estructura propuesta

```
Proyecto-Final/database/
├── AGENTS.md              # este archivo
├── README.md              # como correr local
├── docker-compose.yml     # Postgres 15 con volumen
├── schema/                # DDL de referencia (no se ejecuta directo, doc humano)
│   ├── usuarios.sql
│   ├── pqrs.sql
│   └── tramites.sql
├── migrations/            # Flyway versionado (lo que se ejecuta)
│   ├── V1__init.sql
│   ├── V2__usuarios.sql
│   ├── V3__pqrs.sql
│   └── ...
├── seeds/                 # datos demo solo para dev
│   ├── usuarios_demo.sql
│   └── pqrs_demo.sql
└── er-diagram/            # diagrama entidad-relacion
    └── README.md          # link a Taller-6 Vista Datos adaptada PQRS
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

## Setup local

```bash
cd Proyecto-Final/database
docker compose up -d
# Aplicar migraciones (cuando exista pom.xml en backend, Flyway corre via Spring)
# Mientras tanto: psql manual
psql -h localhost -U pqrs -d pqrs_dev -f migrations/V1__init.sql
```

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
| Postgres local no arranca | `docker compose down -v && docker compose up -d` para recrear volumen |
