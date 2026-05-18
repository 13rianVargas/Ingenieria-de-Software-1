# schema/

Carpeta de referencia humana del DDL. **NO se ejecuta** automaticamente.

El DDL real que aplica Flyway vive en `../migrations/V{N}__*.sql`.

Esta carpeta queda como espacio para:

- Documentar el DDL consolidado (snapshot de todas las migraciones aplicadas) si se quiere generar manualmente.
- Diagramas auxiliares fuera del MER principal.
- Notas tecnicas sobre decisiones de schema.

Para ver el schema actual aplicado, conectarse a la BD y correr:

```bash
docker compose exec postgres pg_dump -U pqrs -d pqrs_dev --schema-only
```
