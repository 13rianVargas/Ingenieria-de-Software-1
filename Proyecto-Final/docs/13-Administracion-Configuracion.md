# Administracion de la Configuracion — Proyecto-Final

> Este documento resume la **estrategia de administracion de la configuracion** del repositorio del Proyecto-Final. Cubre el entregable opcional **#18 Administracion de Configuracion** y sirve como mapa de referencia rapida para que cualquier integrante del equipo encuentre como esta organizado el control de cambios, integracion continua, normas y politicas.
>
> No documenta nada nuevo: solo consolida lo que ya esta implementado en el repositorio.

---

## 1. Vision general

El Proyecto-Final usa un esquema integral de administracion de configuracion basado en **Git Flow**, **Conventional Commits**, **branch protection**, **GitHub Actions** y un conjunto de convenciones documentadas en `Proyecto-Final/.github/CONTRIBUTING.md` y los `AGENTS.md` por modulo.

El objetivo es que cuatro devs trabajen en paralelo sobre el mismo repo sin pisarse, con calidad enforzada server-side y un onboarding rapido para cualquier integrante nuevo.

---

## 2. Mapa de implementacion

| Categoria | Implementacion | Ubicacion |
|---|---|---|
| Control de versiones | Git Flow (`main`, `develop`, `feature/*`, `bugfix/*`, `chore/*`, `docs/*`, `hotfix/*`, `release/*`, `test/*`) | `Proyecto-Final/.github/CONTRIBUTING.md` seccion 4 |
| Branch protection | 1 review obligatoria mas 3 status checks (frontend-ci, backend-ci, commitlint) mas no force push mas no deletion | GitHub Settings: ramas `main` y `develop`. Snippet `gh api` en `CONTRIBUTING.md` seccion 11 |
| Convencion de commits | Conventional Commits **sin scopes**, en ingles, minusculas, sin punto final | `Proyecto-Final/frontend/pqrs-app/commitlint.config.js` |
| CI / CD | GitHub Actions con 3 workflows: lint mas tests mas build (frontend), maven verify (backend, placeholder), commitlint (validador de PR) | `.github/workflows/{frontend-ci,backend-ci,commitlint}.yml` |
| Lint del codigo | ESLint con plugins de Angular y TypeScript (frontend); SpotBugs / Checkstyle (backend, pendiente al implementar) | `Proyecto-Final/frontend/pqrs-app/.eslintrc.json` |
| Tests automaticos | Karma mas Jasmine (frontend); JUnit mas Spring Boot Test mas Testcontainers (backend, pendiente) | Config Karma en `karma.conf.js`; integration tests en `infrastructure/` cuando se cree backend |
| Hooks locales | husky-compat con `.husky/pre-commit` (lint-staged) y `.husky/commit-msg` (commitlint). Activar con `git config core.hooksPath` | `Proyecto-Final/frontend/pqrs-app/.husky/` |
| Package manager | **pnpm SIEMPRE**, npm prohibido. Enforcement via `preinstall` hook que bloquea npm install | `Proyecto-Final/frontend/pqrs-app/package.json` campo `scripts.preinstall` |
| Workspace frontend | `pnpm-workspace.yaml` con `onlyBuiltDependencies` para controlar build scripts de deps nativas | `Proyecto-Final/frontend/pqrs-app/pnpm-workspace.yaml` |
| Templates de PR | Plantilla universal con checklist obligatorio (titulo Conventional, tests pasan, lint clean, sin secretos, reviewer asignado, capturas si UI) | `.github/pull_request_template.md` |
| Templates de Issues | `test-case.yml` (caso de prueba) y `bug-report.yml` (reporte de defecto) | `.github/ISSUE_TEMPLATE/` |
| Ownership por modulo | Mapa de ownership: database, backend, web, mobile, compartidos | `Proyecto-Final/AGENTS.md` seccion 5 |
| Guia operativa por modulo | AGENTS.md por modulo con stack, patrones y reglas | `Proyecto-Final/{database,backend}/AGENTS.md` y `Proyecto-Final/frontend/pqrs-app/src/app/{web,mobile}/AGENTS.md` |
| Reglas para IA / Claude Code | CLAUDE.md por modulo que apunta al AGENTS.md hermano | `Proyecto-Final/CLAUDE.md` y `Proyecto-Final/{database,backend}/CLAUDE.md` y `frontend/pqrs-app/src/app/{web,mobile}/CLAUDE.md` |
| Gitignore | Bloquea Office artifacts (HTM/DOC/DOCX), lockfiles npm/yarn, node_modules, build outputs, IDEs, `.venv/`, `__pycache__/` | `.gitignore` raiz del repo |
| Pipelines de documentos | Generador `.docx` reusable basado en python-docx mas pyyaml | `Proyecto-Final/docs/build/{arquitectura-pqrs,plan-pruebas-pqrs}/` |

---

## 3. Roles y permisos

| Persona | Rol GitHub | Modulo principal |
|---|---|---|
| Brian Vargas (`@13rianVargas`) | Admin del repo | Database + comodin + documentacion |
| Juli Criollo (`@julianhomezdev`) | Maintainer | Backend (Spring Boot) |
| Santi (`@SantiagoRR17`) | Maintainer | Frontend Web (Angular) |
| Juli Avila (`@JulianAvila259`) | Maintainer | Frontend Mobile (Ionic + Capacitor) |

Branch protection esta configurada con `enforce_admins=false`, lo que permite que Brian (admin) pueda hacer bypass solo en emergencias documentadas. Toda otra operacion respeta las reglas estandar (PR + review + CI verde).

---

## 4. Flujo de cambios

```
1. Crear rama desde develop:  git checkout -b feature/algo
2. Commits atomicos:           git commit -m "feat: add login"
3. Push:                       git push -u origin feature/algo
4. PR a develop:               gh pr create --base develop --fill
5. CI corre 3 checks:          frontend-ci + backend-ci + commitlint
6. Reviewer asignado da OK
7. Merge a develop (squash o merge commit segun preferencia)
8. Branch local borrada:       git branch -d feature/algo
9. Cuando develop esta listo para release:
   PR develop → main (Brian o maintainer hace merge)
```

Para hotfix urgente en produccion: la rama nace de `main` y se mergea a `main` Y a `develop`.

---

## 5. Politica de seguridad de la configuracion

- **No se permite force push** a `main` ni a `develop` (configurado en branch protection).
- **No se permite borrar** `main` ni `develop` (configurado).
- **No se permite saltarse el CI** con `--no-verify` y push directo (la branch protection lo rechazaria de todas formas).
- **Hooks --no-verify** localmente solo se permiten en casos justificados; el CI server-side los atrapa igual.
- **Secretos** nunca se commitean. Valores reales viven en variables de entorno o `.env` (gitignored). Los archivos de configuracion versionados solo tienen placeholders dummy.

---

## 6. Versionamiento

Sigue **SemVer** (`MAJOR.MINOR.PATCH`).

| Segmento | Cuando incrementar |
|---|---|
| MAJOR | Cambios incompatibles con versiones anteriores |
| MINOR | Funcionalidad nueva compatible hacia atras |
| PATCH | Correcciones de errores en produccion |

Pre-release suffix segun ciclo: `1.0.0-alpha.1` → `1.0.0-beta.1` → `1.0.0-rc.1` → `1.0.0`.

El primer release del Proyecto-Final sera probablemente `0.1.0-alpha.1` al cerrar el Sprint 1.

---

## 7. Documentacion del proyecto

| Tipo | Ubicacion |
|---|---|
| Reglas del repo (commits, ramas, pnpm, etc.) | `.github/CONTRIBUTING.md` (global) + `Proyecto-Final/.github/CONTRIBUTING.md` (especifico Proyecto-Final) |
| Guia por modulo | `Proyecto-Final/{database,backend}/AGENTS.md` + `Proyecto-Final/frontend/pqrs-app/src/app/{web,mobile}/AGENTS.md` |
| Reglas para IA / agentes | `CLAUDE.md` al lado de cada `AGENTS.md` |
| Documentos academicos del Proyecto-Final | `Proyecto-Final/docs/0..14-*.md` |
| Pipelines `.docx` | `Proyecto-Final/docs/build/` |
| Diagramas fuente | `Proyecto-Final/docs/diagramas/` (PlantUML + PNG renderizados) |

---

## 8. Auditoria de cambios

El historial completo de cambios del repositorio vive en GitHub:

- **Commits:** `git log` o vista de commits en GitHub.
- **PRs:** historial completo de cambios revisados.
- **Issues:** registro de bugs y casos de prueba.
- **Releases:** tags semver cuando se cierre el primer release.

No se requiere herramienta externa de gestion de cambios: GitHub cubre todo el ciclo.

---

## 9. Onboarding rapido para nuevo integrante

1. Clonar el repo y `cd Proyecto-Final/`.
2. Leer `AGENTS.md` raiz del Proyecto-Final (5 min).
3. Leer `.github/CONTRIBUTING.md` (10 min).
4. Identificar modulo asignado y leer su `AGENTS.md` especifico.
5. Instalar pnpm: `npm install -g pnpm` (una sola vez).
6. Para frontend: `cd Proyecto-Final/frontend/pqrs-app && pnpm install && pnpm start`.
7. Para backend: cuando exista `pom.xml`, `./mvnw spring-boot:run`.
8. Para DB: cuando exista `docker-compose.yml`, `docker compose up -d`.
9. Crear rama desde develop y abrir PR cuando el cambio este listo.

---

## 10. Estado y mantenimiento

Este documento se actualiza cuando:

- Se modifica la estrategia de branching.
- Se agrega un nuevo workflow CI.
- Cambia el ownership de algun modulo.
- Se rota el admin del repositorio.
- Se cambia el package manager (extremadamente improbable).

Responsable de mantenerlo actualizado: **Brian Vargas** (admin).

---

## Referencias

- `Proyecto-Final/.github/CONTRIBUTING.md` — convenciones detalladas.
- `Proyecto-Final/AGENTS.md` — guia general del Proyecto-Final.
- `.github/workflows/` — workflows CI activos.
- `.github/CODEOWNERS` — (eliminado, se decidio que ownership manual era suficiente para el tamaño del equipo).
