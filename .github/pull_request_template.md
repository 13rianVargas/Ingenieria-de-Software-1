<!--
Plantilla universal para PRs del repositorio.
Lee la guia: Proyecto-Final/.github/CONTRIBUTING.md
-->

## Tipo de cambio

- [ ] feat — nueva funcionalidad
- [ ] fix — correccion de bug
- [ ] chore — mantenimiento (deps, CI, configs)
- [ ] docs — documentacion
- [ ] refactor — sin cambiar comportamiento
- [ ] test — agregar o modificar tests
- [ ] hotfix — urgente en produccion
- [ ] release — preparacion de version

## Descripcion

<!-- Que cambia y por que. Sin redundar con el titulo. -->

## Issue relacionado

<!-- Closes #N — si aplica. -->

## Checklist obligatorio

- [ ] Titulo del PR sigue Conventional Commits **sin scopes** (ej: `feat: add login`, no `feat(auth): add login`).
- [ ] Rama nace de `develop` (excepto `hotfix/*` que nace de `main`).
- [ ] Tests pasan localmente (`pnpm test` si toca frontend).
- [ ] Lint sin errores (`pnpm run lint`).
- [ ] Build pasa (`pnpm run build`).
- [ ] Sin credenciales hardcoded ni secretos.
- [ ] Sin `console.log` ni codigo comentado muerto.
- [ ] Reviewer asignado manualmente (owner del modulo afectado).
- [ ] Capturas adjuntas si el PR toca UI.

## Archivos compartidos

- [ ] N/A — solo toca mi modulo.
- [ ] Toca `core/`, `shared/`, `theme/`, `package.json`, `pnpm-lock.yaml` o `angular.json` → review de Santi + Juli Avila confirmada.

## Notas para el reviewer

<!-- Areas que necesitan atencion especial, decisiones de diseno, trade-offs. -->

---

## Fase 2 — Checklist específico

- [ ] Mi cambio respeta lo definido en mi `PLAN-*.md` (sección referencia: ___).
- [ ] No introduce hardcode de URLs/secrets (usa `environment.ts` o GH Secrets).
- [ ] Si toca backend: cobertura JaCoCo ≥ 70 % (CI verifica).
- [ ] Si toca frontend: build prod corre sin errores.
- [ ] Si toca mobile: `cap sync android` corre sin errores.
- [ ] Demo grabado o screenshot si el cambio afecta UI.
- [ ] Daily WhatsApp avisado del PR.

