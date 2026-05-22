# PLAN-CICD — Continuous Integration & Deployment (Fase 2)

## 0. Contexto rápido

- **Owner**: Brian Vargas (`@13rianVargas`).
- **Branch**: `feature/cicd-improvements` (crear desde `develop`).
- **Estado actual**:
  - `.github/workflows/frontend-ci.yml`: lint + test + ng build. Activo.
  - `.github/workflows/backend-ci.yml`: placeholder (detecta ausencia de `pom.xml`, retorna success). Necesita activarse cuando backend Spring tenga código real (PLAN-BACK.md T-2.1 ya creó `pom.xml`).
  - `.github/workflows/commitlint.yml`: valida Conventional Commits. Activo.
  - `.github/workflows/db-migrate.yml`: Flyway → Neon. Activo.
  - Branch protection: 3 checks bloqueantes + 1 review.
- **Faltan**: mobile-ci, deploy backend, security scanning, Kanban GH Project, issue templates feature-request/user-story.
- **Definición Done**: 4 workflows operativos (incluido backend real + mobile-ci), Kanban Fase 2 activo, Dependabot habilitado.

---

## 1. Pre-requisitos

| Herramienta | Versión | Verificar |
|---|---|---|
| gh CLI | ≥ 2.40 | `gh --version` |
| GitHub Secrets configurados | — | `gh secret list` |
| Acceso admin al repo | Owner | tú (Brian) |

**Secrets necesarios** (verificar/crear):

```bash
gh secret list
```

Esperado:
- `DATABASE_URL_DIRECT` (post-rotación, T-DB.1).
- `RESEND_API_KEY` (Juli C crea cuenta Resend, comparte).
- `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET` (Juli C crea bucket Cloudflare R2).
- `JWT_SECRET` (Render genera al deploy o `openssl rand -base64 32`).

Si faltan, agregar:

```bash
gh secret set RESEND_API_KEY --body "re_..."
gh secret set R2_ACCESS_KEY_ID --body "..."
# etc.
```

---

## 2. Tareas en orden estricto

### T-5.1 Activar backend-ci real (~2 hrs)

**Objetivo**: backend-ci ejecuta `./mvnw verify` con Testcontainers contra Postgres en cada PR.

**Editar `.github/workflows/backend-ci.yml`**:

```yaml
name: backend-ci

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

concurrency:
  group: backend-ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    name: maven verify
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: Proyecto-Final/backend/pqrs

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Detect backend changes
        id: detect
        working-directory: ${{ github.workspace }}
        run: |
          if [ "${{ github.event_name }}" = "pull_request" ]; then
            BASE_SHA=$(git merge-base origin/${{ github.base_ref }} HEAD)
          else
            BASE_SHA=$(git rev-parse HEAD~1 2>/dev/null || git rev-parse HEAD)
          fi
          CHANGED=$(git diff --name-only "$BASE_SHA" HEAD)
          if echo "$CHANGED" | grep -qE '^Proyecto-Final/backend/|^\.github/workflows/backend-ci\.yml$'; then
            echo "run=true" >> "$GITHUB_OUTPUT"
          else
            echo "run=false" >> "$GITHUB_OUTPUT"
            echo "No backend changes — skip."
          fi

      - name: Skip if no changes
        if: steps.detect.outputs.run != 'true'
        run: echo "Backend unchanged, skipping verify."

      - name: Setup Java 17
        if: steps.detect.outputs.run == 'true'
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: temurin
          cache: maven

      - name: Maven verify (with Testcontainers)
        if: steps.detect.outputs.run == 'true'
        run: ./mvnw -B verify -Pcoverage

      - name: Upload JaCoCo coverage
        if: steps.detect.outputs.run == 'true'
        uses: actions/upload-artifact@v4
        with:
          name: backend-coverage
          path: Proyecto-Final/backend/pqrs/target/site/jacoco/

      - name: Check coverage ≥ 70 %
        if: steps.detect.outputs.run == 'true'
        run: |
          COVERAGE=$(grep -oP 'Total[^%]*\K\d+(?=%)' target/site/jacoco/index.html | head -1)
          echo "Coverage: ${COVERAGE}%"
          if [ "$COVERAGE" -lt 70 ]; then
            echo "Coverage ${COVERAGE}% below threshold 70%."
            exit 1
          fi
```

**Profile JaCoCo en `pom.xml`** (Juli C agrega en PLAN-BACK.md):

```xml
<profiles>
  <profile>
    <id>coverage</id>
    <build>
      <plugins>
        <plugin>
          <groupId>org.jacoco</groupId>
          <artifactId>jacoco-maven-plugin</artifactId>
          <version>0.8.11</version>
          <executions>
            <execution><goals><goal>prepare-agent</goal></goals></execution>
            <execution><id>report</id><phase>verify</phase><goals><goal>report</goal></goals></execution>
          </executions>
        </plugin>
      </plugins>
    </build>
  </profile>
</profiles>
```

**Branch protection**: actualizar required check `maven verify` para que apunte al job correcto si cambió de nombre.

**Commit**: `ci: activate backend-ci with maven verify testcontainers and jacoco coverage`

---

### T-5.2 Sumar mobile-ci (~3 hrs)

**Objetivo**: workflow valida que mobile build web bundle compila sin errores cuando hay cambios en `mobile/` o `capacitor.config.ts`. NO compila APK (eso es local en Android Studio).

**Crear `.github/workflows/mobile-ci.yml`**:

```yaml
name: mobile-ci

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

concurrency:
  group: mobile-ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    name: mobile web bundle
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: Proyecto-Final/frontend/pqrs-app

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Detect mobile changes
        id: detect
        working-directory: ${{ github.workspace }}
        run: |
          if [ "${{ github.event_name }}" = "pull_request" ]; then
            BASE_SHA=$(git merge-base origin/${{ github.base_ref }} HEAD)
          else
            BASE_SHA=$(git rev-parse HEAD~1 2>/dev/null || git rev-parse HEAD)
          fi
          CHANGED=$(git diff --name-only "$BASE_SHA" HEAD)
          if echo "$CHANGED" | grep -qE '^Proyecto-Final/frontend/pqrs-app/(src/app/mobile|capacitor\.config|android)|^\.github/workflows/mobile-ci\.yml$'; then
            echo "run=true" >> "$GITHUB_OUTPUT"
          else
            echo "run=false" >> "$GITHUB_OUTPUT"
          fi

      - name: Setup Node + pnpm
        if: steps.detect.outputs.run == 'true'
        uses: actions/setup-node@v4
        with: { node-version: 20 }

      - name: Install pnpm
        if: steps.detect.outputs.run == 'true'
        run: corepack enable && corepack prepare pnpm@latest --activate

      - name: Install deps
        if: steps.detect.outputs.run == 'true'
        run: pnpm install --frozen-lockfile

      - name: Build prod
        if: steps.detect.outputs.run == 'true'
        run: pnpm ng build --configuration=production

      - name: Verify capacitor sync would succeed
        if: steps.detect.outputs.run == 'true'
        run: pnpm exec cap sync android --deployment --no-build
```

**Commit**: `ci: add mobile-ci workflow for web bundle build verification`

---

### T-5.3 Documentar Render auto-deploy (~2 hrs)

**Objetivo**: backend Render se auto-despliega en cada push a `develop` (config Render dashboard, no GitHub Action).

**Crear `Proyecto-Final/docs/DEPLOY.md`**:

```markdown
# Deploy Backend en Render

## Setup inicial (Juli C, una sola vez)

1. Crear cuenta en https://render.com (gratis).
2. Dashboard → New → Web Service → Connect GitHub repo `Ingenieria-de-Software-1`.
3. Configuración:
   - Branch: `develop`
   - Root directory: `Proyecto-Final/backend/pqrs`
   - Runtime: Docker
   - Plan: Free
   - Auto-deploy: Yes
4. Environment variables (desde Render dashboard):
   - `DATABASE_URL` (pooled, Neon)
   - `JWT_SECRET` (generate value)
   - `RESEND_API_KEY`
   - `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET`
5. Health check path: `/actuator/health`.
6. Deploy → esperar 5-10 min.

## URL pública

Render genera URL tipo `https://pqrs-backend-XXXX.onrender.com`. Compartir con Santi + Juli A.

## Auto-deploy

Cada push a `develop` que toque `Proyecto-Final/backend/pqrs/**` dispara redeploy automático. Sin GitHub Action adicional.

## Sleep mode (free tier)

Después de 15 min sin tráfico, instancia hiberna. Primer request tarda ~50 s en despertar.

**Pre-warm pre-demo**: 5 min antes ejecutar:
```bash
curl https://pqrs-backend-XXXX.onrender.com/actuator/health
```

## Logs

Render dashboard → Service → Logs (live tail).
```

**Commit**: `docs: document render auto-deploy setup and pre-warm strategy`

---

### T-5.4 GitHub Project Kanban Fase 2 (~1 hr)

**Objetivo**: tablero visual para tracking de tareas T-1..T-5.x.

**Pasos**:

1. Crear Project:
```bash
gh project create --owner 13rianVargas --title "PQRS Fase 2 — MVP Implementation"
```

2. Sumar columnas (status options): Backlog, In Progress, Review, Done, Blocked.

3. Auto-add issues + PRs:
```bash
gh project edit <PROJECT_NUMBER> --workflows
```

Configurar workflow "Auto-add to project" desde UI → seleccionar issues + PRs del repo + filter `is:open`.

4. Crear issues por cada tarea T-X.Y de los 5 planes:

```bash
# Ejemplo para PLAN-BACK.md
for task in "T-2.1 fix scaffold" "T-2.2 CU-02 auth" "T-2.3 CU-01 registro" "T-2.4 CU-03 radicar" "T-2.5 CU-04 mis pqrs" "T-2.6 CU-05 bandeja" "T-2.7 CU-06 tramitar" "T-2.8 CU-07 reportes" "T-2.9 RF-12 notif" "T-2.10 deploy render"; do
  gh issue create --title "[backend] $task" --body "Ver PLAN-BACK.md sección correspondiente." --label "phase-2,backend" --assignee julianhomezdev
done
```

Repetir para PLAN-DB (Brian), PLAN-WEB (Santi), PLAN-MOBILE (Juli A), PLAN-CICD (Brian).

5. Crear labels:
```bash
gh label create "phase-2" --color "5319E7" --description "Tareas de Fase 2 implementación MVP"
gh label create "backend" --color "1D76DB"
gh label create "frontend-web" --color "0E8A16"
gh label create "frontend-mobile" --color "B60205"
gh label create "database" --color "FBCA04"
gh label create "cicd" --color "5319E7"
```

**Commit**: ninguno (operación GitHub).

**Documentar en `Proyecto-Final/AGENTS.md` §10.4**: link al Project board.

---

### T-5.5 Issue templates nuevos (~30 min)

**Objetivo**: sumar plantillas `feature-request.yml` y `user-story.yml`.

**Crear `.github/ISSUE_TEMPLATE/feature-request.yml`**:

```yaml
name: 🚀 Feature Request
description: Propuesta de nueva funcionalidad o mejora.
labels: ["feature-request", "phase-2"]
body:
  - type: markdown
    attributes:
      value: |
        Antes de abrir, verifica que la feature no esté ya cubierta en los `PLAN-*.md` del Proyecto-Final.

  - type: input
    id: titulo
    attributes:
      label: Título breve
      placeholder: "ej: Agregar filtro por fecha en bandeja"
    validations:
      required: true

  - type: textarea
    id: descripcion
    attributes:
      label: Descripción
      placeholder: "¿Qué problema resuelve? ¿Cómo se ve la solución?"
    validations:
      required: true

  - type: dropdown
    id: modulo
    attributes:
      label: Módulo afectado
      options:
        - backend
        - frontend-web
        - frontend-mobile
        - database
        - cicd
        - docs
    validations:
      required: true

  - type: textarea
    id: criterios
    attributes:
      label: Criterios de aceptación
      placeholder: "Dado X, cuando Y, entonces Z."
```

**Crear `.github/ISSUE_TEMPLATE/user-story.yml`**:

```yaml
name: 📖 Historia de Usuario
description: HU formato Connextra para el backlog.
labels: ["user-story", "phase-2"]
body:
  - type: input
    id: id
    attributes:
      label: ID (ej. HU-13)
    validations:
      required: true

  - type: textarea
    id: historia
    attributes:
      label: Historia de Usuario
      value: |
        **Como** <actor>,
        **Quiero** <acción>,
        **Para** <valor de negocio>.
    validations:
      required: true

  - type: textarea
    id: ca
    attributes:
      label: Criterios de Aceptación
      placeholder: |
        - Dado X, cuando Y, entonces Z.
        - ...
    validations:
      required: true

  - type: input
    id: sp
    attributes:
      label: Estimación (Story Points)
    validations:
      required: true
```

**Commits**:
1. `chore(github): add feature request issue template`
2. `chore(github): add user story issue template`

---

### T-5.6 PR template review (~30 min)

**Objetivo**: sumar checkboxes específicos Fase 2 al PR template existente.

**Editar `.github/pull_request_template.md`** — sumar al final:

```markdown
---

## Fase 2 — Checklist específico

- [ ] Mi cambio respeta lo definido en mi `PLAN-*.md` (sección referencia: ___).
- [ ] No introduce hardcode de URLs/secrets (usa `environment.ts` o GH Secrets).
- [ ] Si toca backend: cobertura JaCoCo ≥ 70 % (CI verifica).
- [ ] Si toca frontend: build prod corre sin errores.
- [ ] Si toca mobile: `cap sync android` corre sin errores.
- [ ] Demo grabado o screenshot si el cambio afecta UI.
- [ ] Daily WhatsApp avisado del PR.
```

**Commit**: `chore(github): extend pr template with phase 2 checklist`

---

### T-5.7 Dependabot config (~1 hr)

**Objetivo**: alerts automáticos de vulnerabilidades en deps.

**Crear `.github/dependabot.yml`**:

```yaml
version: 2
updates:
  - package-ecosystem: "maven"
    directory: "/Proyecto-Final/backend/pqrs"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "backend"

  - package-ecosystem: "npm"
    directory: "/Proyecto-Final/frontend/pqrs-app"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "frontend"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
    labels:
      - "dependencies"
      - "cicd"

  - package-ecosystem: "gradle"
    directory: "/Proyecto-Final/frontend/pqrs-app/android"
    schedule:
      interval: "monthly"
    labels:
      - "dependencies"
      - "frontend-mobile"
```

**Habilitar security alerts en repo**:

Settings → Security & analysis → Dependency alerts: Enable. Code scanning: Enable (CodeQL básico).

**Commit**: `chore(github): add dependabot config for maven npm github-actions gradle`

---

## 3. Coordinación

- **Bloqueado por**: PLAN-BACK.md T-2.1 (`pom.xml` con código real para T-5.1 backend-ci).
- **Bloquea a**: nadie directamente, pero T-5.1 falla bloquea merges a develop.

---

## 4. Troubleshooting

| Error | Fix |
|---|---|
| `gh project create` falla | Necesita scope `project` en gh auth. `gh auth refresh -s project`. |
| Backend-ci falla con "Docker not available" | Testcontainers requiere Docker en runner. `ubuntu-latest` lo trae. Si falla, verificar versión Testcontainers ≥ 1.19. |
| JaCoCo coverage tarda mucho | Excluir paquetes irrelevantes (DTOs, entities) en `pom.xml` profile coverage. |
| Render deploy falla con "Cannot find Dockerfile" | Verificar root directory en Render = `Proyecto-Final/backend/pqrs`. |
| Dependabot crea PRs constantes | Reducir `open-pull-requests-limit` o cambiar interval a "monthly". |
| Branch protection rechaza merge porque check renamed | Settings → Branches → develop → editar required checks, actualizar nombre. |

---

## 5. Definition of Done

- [ ] T-5.1 backend-ci ejecuta maven verify real con JaCoCo + Testcontainers.
- [ ] T-5.2 mobile-ci workflow operativo.
- [ ] T-5.3 `DEPLOY.md` documentado + Render configurado.
- [ ] T-5.4 GitHub Project Kanban Fase 2 con ~30 issues T-X.Y.
- [ ] T-5.5 templates feature-request + user-story creados.
- [ ] T-5.6 PR template actualizado con checklist Fase 2.
- [ ] T-5.7 Dependabot config + alerts habilitados.
- [ ] Branch protection actualizada con nuevos check names si aplica.
- [ ] PR `feature/cicd-improvements` mergeado a `develop`.

---

**Cronograma ajustado** (ver `PLAN-MAESTRO.md` §2): **T-5.4 Kanban GH Project es D1 prioritario** (22-may) para tracking de todo el equipo; T-5.1 backend-ci real en D3-D5 (cuando exista pom con tests); T-5.2 mobile-ci + T-5.5/T-5.6/T-5.7 en D6-D8; T-5.3 Render deploy docs en D9-D10. Total ~10 hrs distribuidas en 9 días.
