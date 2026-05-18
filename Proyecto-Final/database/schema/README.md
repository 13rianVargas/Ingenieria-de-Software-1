# schema/

Carpeta de referencia humana del DDL. **NO se ejecuta** automaticamente.

El DDL real que aplica Flyway vive en `../migrations/V{N}__*.sql`.

Esta carpeta queda como espacio para:

- Documentar el DDL consolidado (snapshot de todas las migraciones aplicadas) si se quiere generar manualmente.
- Diagramas auxiliares fuera del MER principal.
- Notas tecnicas sobre decisiones de schema.

Para ver el schema actual aplicado, conectarse a Neon y correr:

```bash
# Direct endpoint (Brian) o cualquier cliente Postgres apuntando a Neon
pg_dump "$DATABASE_URL_DIRECT" --schema-only
```
