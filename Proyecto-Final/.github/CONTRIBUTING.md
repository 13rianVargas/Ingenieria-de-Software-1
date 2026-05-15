# Guia de contribucion — Proyecto-Final (PQRS)

Este documento aplica a todo el codigo dentro de `Proyecto-Final/`. Para reglas globales del repositorio academico (talleres, documentacion general) ver [`.github/CONTRIBUTING.md`](../../.github/CONTRIBUTING.md) en la raiz.

Inspirado en la guia de K-Forge.

---

## 1. Dominio del proyecto

**PQRS — Peticiones, Quejas, Reclamos y Sugerencias.**

Fuente oficial: [`docs/1-Funcionalidades.md`](../docs/1-Funcionalidades.md).

Los Talleres 6 y 7 trabajaron sobre un caso de estudio diferente (E-Commerce Konrad) como guia metodologica. Sus artefactos se portan al dominio PQRS dentro de `Proyecto-Final/docs/`. Los talleres no se modifican.

---

## 2. Stack tecnologico

| Capa | Tecnologia |
|---|---|
| Frontend Web y Mobile | Angular 20 + Ionic 8 + Tailwind CSS |
| Backend | Java OpenJDK 17 + Spring Boot 3.x |
| Base de Datos | PostgreSQL 15+ |
| Migraciones DB | Flyway |
| Seguridad | BCrypt + JWT + HTTPS |
| Package manager (frontend) | **pnpm — npm prohibido** |
| Build backend | Maven |

---

## 3. Convencion para commits

Seguimos **Conventional Commits**. Formato:

```
type: short message in english
```

> Mensaje siempre en **ingles**, **minusculas**, sin punto final. **NO usar scopes entre parentesis.**

### Tipos validos

| Tipo | Descripcion |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Correccion de errores |
| `chore` | Mantenimiento (deps, configs, tooling) |
| `release` | Preparacion de version |
| `hotfix` | Correccion urgente en produccion |
| `docs` | Cambios en documentacion |
| `refactor` | Refactor sin cambiar comportamiento |
| `test` | Agregar o modificar tests |

### Ejemplos correctos

```
feat: add login screen for mobile
fix: resolve jwt token expiration bug
chore: update spring boot dependencies
docs: add branching guide to contributing
refactor: extract user validation logic
test: add integration tests for pqrs service
release: prepare version 1.0.0
hotfix: fix cors config in gateway
```

### Ejemplos incorrectos (con casos reales del repo)

| Ejemplo | Problema |
|---|---|
| `update` | No describe nada util |
| `cambios` | Ambiguo y no en ingles |
| `FEAT: Add product` | No usar mayusculas |
| `feat(agregacion): implementar login` | **No usar scopes** |
| `feat(frontend): migrate to pnpm` | **No usar scopes** |
| `feat: Add Product.` | No usar mayusculas ni punto final |
| `fix: fixed the bug` | Vago — que bug, donde |

Validacion automatica: `commitlint` corre en cada PR (config en [`.github/commitlint.config.js`](./commitlint.config.js)).

---

## 4. Estrategia de ramas — Git Flow

Casi todo sale de `develop`. Solo `hotfix/*` sale de `main`.

```mermaid
gitGraph
   commit id: "init"
   branch develop
   checkout develop
   commit id: "setup"
   branch feature/login
   checkout feature/login
   commit id: "feat: add login"
   checkout develop
   merge feature/login
   branch release/1.0.0
   checkout release/1.0.0
   checkout main
   merge release/1.0.0 tag: "v1.0.0"
   checkout develop
   merge release/1.0.0
   checkout main
   branch hotfix/fix-cors
   checkout hotfix/fix-cors
   commit id: "hotfix: fix cors"
   checkout main
   merge hotfix/fix-cors tag: "v1.0.1"
   checkout develop
   merge hotfix/fix-cors
```

### Tipos de rama

| Rama | Para que | Crear desde | PR hacia | Eliminar |
|---|---|---|---|---|
| `main` | Codigo estable produccion | — | — | Nunca |
| `develop` | Integracion diaria | `main` | `main` (via release) | Nunca |
| `feature/*` | Nueva funcionalidad | `develop` | `develop` | Tras merge |
| `bugfix/*` | Bug no urgente | `develop` | `develop` | Tras merge |
| `chore/*` | Docs, CI/CD, deps, configs | `develop` | `develop` | Tras merge |
| `test/*` | Pruebas tecnicas | `develop` | `develop` (si aplica) | Tras merge o descartar |
| `release/*` | Preparar version | `develop` | `main` y `develop` | Tras merge a ambos |
| `hotfix/*` | Incidente urgente | `main` | `main` y `develop` | Tras merge a ambos |

### Nombres de rama

Formato: `<tipo>/<descripcion-en-kebab-case>`.

```
feature/database-schema-init
feature/auth-jwt-backend
bugfix/fix-radicar-validation
chore/update-angular-deps
hotfix/fix-cors-gateway
release/1.2.0
test/pqrs-service-integration
```

Incorrectos: `feat/login`, `mi-rama`, `feature/StudentDash`, `feature/changes`.

### Workflow minimo

```bash
# 1. Sincronizar develop
git checkout develop && git pull origin develop

# 2. Crear rama
git checkout -b feature/nombre-descriptivo

# 3. Commits atomicos
git add .
git commit -m "feat: add pqrs status filter"

# 4. Push y PR hacia develop
git push -u origin feature/nombre-descriptivo
gh pr create --base develop --fill
```

Para `release/*` y `hotfix/*`: abrir PR a `main` Y a `develop`.

---

## 5. Mapa de ownership

Cada modulo tiene responsable principal. Cuando tu PR toca codigo fuera de tu modulo, solicita revision manualmente al responsable.

| Persona | Modulo | Ruta |
|---|---|---|
| Brian Vargas (`@13rianVargas`) | Database + comodin | `Proyecto-Final/database/` |
| Juli Criollo (`@julianhomezdev`) | Backend (Spring Boot) | `Proyecto-Final/backend/` |
| Santiago RR (`@SantiagoRR17`) | Frontend Web | `Proyecto-Final/frontend/pqrs-app/src/app/web/` |
| Juli Avila (`@JulianAvila259`) | Frontend Mobile | `Proyecto-Final/frontend/pqrs-app/src/app/mobile/` |

### Archivos compartidos (avisar a Santi + Juli Avila)

- `Proyecto-Final/frontend/pqrs-app/src/app/core/`
- `Proyecto-Final/frontend/pqrs-app/src/app/shared/`
- `Proyecto-Final/frontend/pqrs-app/src/theme/`
- `Proyecto-Final/frontend/pqrs-app/package.json`
- `Proyecto-Final/frontend/pqrs-app/pnpm-lock.yaml`
- `Proyecto-Final/frontend/pqrs-app/angular.json`

### Regla de oro

Branch protection requiere 1 aprobacion sobre cada PR. Cuando toques codigo de otro modulo, asigna como reviewer al owner correspondiente — no esperes que el sistema lo haga por ti.

---

## 6. Versionamiento — SemVer

Formato `MAJOR.MINOR.PATCH`.

| Segmento | Cuando incrementar | Ejemplo |
|---|---|---|
| `MAJOR` | Cambios incompatibles | `1.0.0` → `2.0.0` |
| `MINOR` | Funcionalidad compatible | `1.0.0` → `1.1.0` |
| `PATCH` | Correcciones produccion | `1.1.0` → `1.1.1` |

Pre-release:

```
0.1.0-alpha.1    primera iteracion
0.1.0-beta.1     pruebas
0.1.0            stable
```

---

## 7. Pull Requests

- Titulo: convencion de commits, sin scope.
- Descripcion: usar plantilla `.github/pull_request_template.md`.
- Vincular issue si existe (`Closes #N`).
- Codigo debe pasar lint + tests + build (CI obligatorio).
- Al menos **1 aprobacion** de owner del modulo.
- Toca archivos compartidos? Confirmar review de ambos frontend devs.
- Branch protection bloquea merge si checks fallan.

---

## 8. Estandares de codigo

### TypeScript / Angular

| Elemento | Convencion |
|---|---|
| Clases, componentes | PascalCase |
| Metodos, funciones, variables | camelCase |
| Constantes | UPPER_SNAKE_CASE |
| Modulos, archivos | kebab-case.ts |
| Indentacion | 2 espacios |
| Imports sin usar | Eliminar siempre |
| `console.log` | Eliminar antes del PR |
| `any` | Evitar — usar tipos especificos |
| Credenciales | Nunca en codigo — usar `environment.ts` con valores dummy |

ESLint config: `Proyecto-Final/frontend/pqrs-app/.eslintrc.json`. Corre `pnpm run lint` antes de commit.

### Java / Spring Boot

| Elemento | Convencion |
|---|---|
| Clases | PascalCase |
| Metodos, variables | camelCase |
| Constantes | UPPER_SNAKE_CASE |
| Paquetes | minusculas, sin guiones |
| Indentacion | 4 espacios |
| Anotaciones lombok | OK si reducen boilerplate |
| Credenciales | `application.yml` con perfiles + `.env` |

### SQL / Migraciones Flyway

- Archivos: `V{n}__descripcion_corta.sql` (snake_case).
- Una migracion = un cambio logico.
- Nunca editar migracion ya mergeada — crear nueva.
- Comentar tablas y columnas no obvias.

---

## 9. Package manager — pnpm only

Este repo **prohibe npm y yarn**. Solo `pnpm`.

Razones:
- Velocidad y eficiencia de disco (symlinks + content-addressable store).
- Workspace nativo.
- Seguridad: `onlyBuiltDependencies` controla scripts.

Enforcement:
- `package.json` tiene `"preinstall": "npx only-allow pnpm"` — corre `npm install` falla.
- `.gitignore` bloquea `package-lock.json` y `yarn.lock`.

Instalacion local:

```bash
npm install -g pnpm@9    # una sola vez
cd Proyecto-Final/frontend/pqrs-app
pnpm install
pnpm start
```

Si llegas de npm: borrar `node_modules/` y `package-lock.json` antes de `pnpm install`.

---

## 10. Hooks locales (opcional pero recomendado)

CI valida lint, tests, build y commitlint server-side. Para atrapar errores antes del push, activar hooks locales una sola vez:

```bash
# Desde la raiz del repo
git config core.hooksPath Proyecto-Final/frontend/pqrs-app/.husky
```

Hooks disponibles:

- `.husky/pre-commit` — corre `lint-staged` (ESLint --fix sobre archivos modificados).
- `.husky/commit-msg` — valida convencion de commit con `commitlint`.

Para desactivar temporal: `git commit --no-verify` (NO recomendado).

---

## 11. Branch protection (admin)

Configurar via GitHub UI (Settings → Branches → Add rule) o `gh api`:

```bash
# main
gh api -X PUT /repos/13rianVargas/Ingenieria-de-Software-1/branches/main/protection \
  -F required_status_checks.strict=true \
  -F 'required_status_checks.contexts[]=frontend-ci' \
  -F 'required_status_checks.contexts[]=commitlint' \
  -F required_pull_request_reviews.required_approving_review_count=1 \
  -F required_pull_request_reviews.dismiss_stale_reviews=true \
  -F enforce_admins=false \
  -F allow_force_pushes=false \
  -F allow_deletions=false \
  -F restrictions=null

# develop — mismo set
gh api -X PUT /repos/13rianVargas/Ingenieria-de-Software-1/branches/develop/protection \
  -F required_status_checks.strict=true \
  -F 'required_status_checks.contexts[]=frontend-ci' \
  -F 'required_status_checks.contexts[]=commitlint' \
  -F required_pull_request_reviews.required_approving_review_count=1 \
  -F required_pull_request_reviews.dismiss_stale_reviews=true \
  -F enforce_admins=false \
  -F allow_force_pushes=false \
  -F allow_deletions=false \
  -F restrictions=null
```

Activar solo despues de mergear los workflows CI (sino los status checks no existen y bloquean todo).

---

## 12. Reporte de bugs

Abrir Issue con plantilla `.github/ISSUE_TEMPLATE/bug-report.yml`. Incluir:

- Descripcion del problema.
- Pasos para reproducir.
- Comportamiento esperado vs actual.
- Capturas si aplica.
- Ambiente (browser, OS, version).

Casos de prueba: plantilla `.github/ISSUE_TEMPLATE/test-case.yml` (de Taller-7).
