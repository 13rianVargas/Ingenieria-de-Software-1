# Guia de contribucion — Repositorio academico

Este repositorio contiene:

- **Talleres 3–7**: artefactos academicos entregados (Scrum, arquitectura, plan pruebas).
- **PSP-TSP-Expo**: material de exposicion.
- **Proyecto-Final**: implementacion del sistema PQRS.

Para reglas de la implementacion (commits, ramas, CI, ownership) ver [`Proyecto-Final/.github/CONTRIBUTING.md`](../Proyecto-Final/.github/CONTRIBUTING.md).

---

## Reglas globales del repositorio

### Lenguaje y formato

- Documentacion en **espanol**.
- Sin emojis en markdown tecnico.
- Markdown plano, sin HTML embedido cuando se pueda evitar.

### Commits

- **Conventional Commits sin scopes**. Detalle completo en `Proyecto-Final/.github/CONTRIBUTING.md`.
- Mensajes en **ingles, minusculas, sin punto final**.
- **Nunca atribuir IA** en commits (`Co-Authored-By: Claude`, etc. estan prohibidos).
- Conventional Commits en titulos de PR — validado por `commitlint` workflow.

### Talleres (artefactos academicos)

- Numeracion de archivos (`0-`, `1-`, `3.1-`) define orden de lectura. **No renumerar al insertar**.
- Diagramas: editar fuente (`.puml` / `.d2`), no solo el PNG.
- Casos de uso: ID y nombre sincronizados con `0-Resumen-Casos-Uso.md`.
- Cuando una HU/CU/RNF se toque, verificar referencias cruzadas (backlog, RNF, mockup, diagramas).
- Contexto fuente (`Contexto-Talleres.md`): no editar sin permiso.

### Archivos prohibidos en el repo

- Lockfiles npm/yarn (`package-lock.json`, `yarn.lock`) — solo `pnpm-lock.yaml`.
- Exportaciones Word (`*.htm`, `*_archivos/`, `*.doc`) — usar Markdown o PDF.
- Scripts sueltos en raiz (poner en su modulo).
- Credenciales o secretos.

`.gitignore` raiz bloquea los patrones de arriba.

### Pull Requests

- Plantilla en `.github/pull_request_template.md`.
- 1 aprobacion minimo de owner del modulo.
- CI obligatorio (lint + tests + build + commitlint) para PRs que tocan `Proyecto-Final/`.

### Issues

- Plantillas en `.github/ISSUE_TEMPLATE/`:
  - `test-case.yml`: casos de prueba (Taller-7 y Proyecto-Final).
  - `bug-report.yml`: reporte de bugs.

### Ownership

Ver `Proyecto-Final/.github/CONTRIBUTING.md` seccion 5.
