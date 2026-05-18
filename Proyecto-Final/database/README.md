# Proyecto-Final/database

Modulo de base de datos del sistema PQRS. **PostgreSQL 15 + Flyway** sobre Docker Compose para desarrollo local.

Owner: **Brian Vargas** (`@13rianVargas`).

Reglas operativas detalladas en [`AGENTS.md`](./AGENTS.md).

---

## Setup local

Prerequisito: Docker Desktop o Docker Engine + Docker Compose v2.

```bash
cd Proyecto-Final/database

# 1. (Opcional) Copiar .env.example a .env si quieres credenciales distintas a las default
cp .env.example .env

# 2. Levantar Postgres + correr migraciones Flyway
docker compose up -d

# 3. Ver logs de Flyway para confirmar migraciones aplicadas
docker compose logs flyway
# Esperado: "Successfully applied 5 migrations to schema 'public'"
```

Tear down (incluye borrar el volumen y datos):

```bash
docker compose down -v
```

---

## Verificacion rapida

```bash
# Listar tablas creadas
docker compose exec postgres psql -U pqrs -d pqrs_dev -c "\dt"

# Ver estructura de la tabla usuario (incluyendo CHECK constraints)
docker compose exec postgres psql -U pqrs -d pqrs_dev -c "\d+ usuario"

# Contar filas por tabla
docker compose exec postgres psql -U pqrs -d pqrs_dev -c "
SELECT 'usuario' AS tabla, COUNT(*) FROM usuario
UNION ALL SELECT 'pqrs',         COUNT(*) FROM pqrs
UNION ALL SELECT 'tramite',      COUNT(*) FROM tramite
UNION ALL SELECT 'adjunto',      COUNT(*) FROM adjunto
UNION ALL SELECT 'notificacion', COUNT(*) FROM notificacion
UNION ALL SELECT 'auditoria',    COUNT(*) FROM auditoria;"
```

---

## Cargar datos demo (opcional, dev only)

```bash
docker compose exec -T postgres psql -U pqrs -d pqrs_dev < seeds/demo.sql
```

Crea 4 usuarios y 3 PQRS de ejemplo. NO ejecutar en produccion.

---

## Estructura del modulo

```
database/
├── README.md                 # este archivo
├── AGENTS.md                 # reglas operativas
├── CLAUDE.md                 # apunta a AGENTS.md
├── docker-compose.yml        # Postgres 15 + Flyway runner
├── .env.example              # variables de entorno
├── migrations/               # Flyway versionado (lo que se ejecuta)
│   ├── V1__usuarios.sql
│   ├── V2__pqrs.sql
│   ├── V3__tramites_adjuntos.sql
│   ├── V4__notificaciones.sql
│   └── V5__auditoria.sql
├── seeds/                    # datos demo dev only
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
| `adjunto` | Metadata de los PDF adjuntos (binario vive en NAS). |
| `notificacion` | Cola de correos transaccionales con retry. |
| `auditoria` | Log tecnico via AOP del backend. Toda operacion CRUD. |

---

## Conexion desde el backend

Cuando Juli Criollo cree el backend Spring Boot, debe configurar:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/pqrs_dev
    username: pqrs
    password: pqrs
  jpa:
    hibernate:
      ddl-auto: validate          # Flyway controla schema, JPA solo valida
  flyway:
    enabled: true
    locations: filesystem:../database/migrations
```

El `ddl-auto: validate` garantiza que JPA NO modifique el schema. Flyway es la unica fuente de verdad para migraciones.

---

## Reglas de migraciones

- **Naming:** `V{N}__descripcion_corta.sql` (kebab/snake_case, dos underscores entre numero y nombre).
- **Numeracion secuencial:** V1, V2, V3... Sin saltos.
- **Nunca editar una migracion ya mergeada.** Crear nueva. Flyway falla si detecta hash distinto.
- **Una migracion = un cambio logico.** No mezclar crear tabla con cambiar columna en el mismo archivo.
- **Comentarios obligatorios:** usar `COMMENT ON TABLE` y `COMMENT ON COLUMN` para campos no obvios.

---

## Troubleshooting

| Problema | Solucion |
|---|---|
| Flyway error "checksum mismatch" | Alguien edito una migracion mergeada. Crear nueva con el fix. NO editar la vieja. |
| Puerto 5432 ocupado | Otro Postgres corriendo local. Detenerlo o cambiar puerto en `docker-compose.yml`. |
| Datos corruptos en dev | `docker compose down -v && docker compose up -d` para recrear desde cero. |
| Cambio en columna requerido | Nueva migracion `V{N+1}__add_columna.sql` con `ALTER TABLE`. Nunca tocar la vieja. |
| Backend pide campo que no existe | Crear nueva migracion en este modulo, coordinar PR con Juli Criollo. |
