# AGENT.md — Reglas para Claude dentro de Proyecto-Final

Este archivo aplica solo a `Proyecto-Final/`. Reglas globales del repositorio: `AGENTS.md` raiz.

## Antes de tocar codigo

1. Leer [`CONTRIBUTING.md`](./CONTRIBUTING.md).
2. Identificar a que modulo pertenece el cambio (database, backend, frontend web, frontend mobile, core compartido).
3. Verificar que el owner del modulo este enterado (en duda, preguntar al usuario).
4. Si el cambio toca `core/`, `shared/`, `theme/` o config root del frontend: requiere coordinacion entre Santi y Juli Avila.

## Reglas de commits

- Conventional Commits **sin scopes**.
- Ingles, minusculas, sin punto final.
- Sin atribucion de IA (`Co-Authored-By: Claude` y similares estan prohibidos).
- Un commit = un cambio logico. No mezclar refactor con feature.

## Reglas de ramas

- Nunca commit directo a `main` ni `develop`.
- Crear rama segun tipo: `feature/*`, `bugfix/*`, `chore/*`, `docs/*`, `test/*`, `hotfix/*`, `release/*`.
- PR siempre hacia `develop` (excepto `hotfix/*` y `release/*` que van a ambos).

## Stack y herramientas

- Package manager: **pnpm only**. Nunca correr `npm install` ni `yarn install`.
- Frontend: Angular 20 + Ionic 8 + Tailwind.
- Backend: Spring Boot 3.x + Java 17 + Maven.
- DB: PostgreSQL 15 + Flyway.
- Tests front: Karma + Jasmine (default Ionic).
- Lint front: ESLint via `pnpm run lint`.

## Verificaciones automaticas

- `commitlint` valida titulo del PR y todos los commits del PR — falla si lleva scope o tipo invalido.
- `frontend-ci` corre lint + Karma + ng build en PRs que tocan `frontend/`.
- `backend-ci` corre Maven verify cuando exista `pom.xml`.
- Hooks locales opcionales en `Proyecto-Final/frontend/pqrs-app/.husky/`. Setup: `git config core.hooksPath Proyecto-Final/frontend/pqrs-app/.husky`.

## Dominio

**PQRS — Peticiones, Quejas, Reclamos, Sugerencias.**

Fuente: `Proyecto-Final/1-Funcionalidades.md`. Talleres 6/7 trabajaron sobre E-Commerce Konrad como guia. Sus artefactos se portan a PQRS dentro de `Proyecto-Final/docs/`. Los talleres no se modifican.

## Prohibido

- Implementar codigo de otros modulos sin que el owner lo apruebe.
- Commitear lockfiles npm/yarn.
- Commitear archivos Office (`.htm`, `.doc`, `.docx`).
- Modificar talleres ya entregados sin instruccion explicita del usuario.
- Crear archivos nuevos en raiz del repo (deben ir dentro de un modulo).
- Sumar dependencias al frontend sin avisar — package manager dual rompe lockfile.
