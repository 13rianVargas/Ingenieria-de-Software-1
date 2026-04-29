# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Lectura obligatoria

`AGENTS.md` raíz es la fuente de verdad: propósito por carpeta, convenciones,
flujos y checklist. Leerlo antes de cualquier edición no trivial.

## Contexto en una página

Repositorio académico de **Ingeniería de Software 1**. Caso de estudio único:
**E-Commerce Comercial Konrad** (definido en `Contexto-Talleres.md`). Los
talleres y el proyecto final producen, en cadena, los artefactos Scrum sobre
ese caso.

Estado: documental hoy + andamiaje vacío para software futuro en
`Proyecto-Final/{backend,frontend/web,frontend/mobile,database}/`.

## Mapa de propósitos (resumen)

- `Contexto-Talleres.md` — enunciado del cliente. No editar sin permiso.
- `Scrum-Backlog/` — backlog vivo (`Product-Backlog.md` + plantilla).
- `Taller-3/` — Visual Story Mapping (actores, procesos, HU base, PERT,
  planning poker, capacidad).
- `Taller-4/` — especificación de 2 casos de uso + mockup HTML.
- `Taller-5/` — 3 RNF con criterios de aceptación.
- `Taller-6/` — arquitectura multivista (`Diagramas/1..6`) + documento
  publicable en `Arquitectura/` con build a PDF (pandoc + weasyprint).
- `Taller-7/` — plan y casos de pruebas (en construcción).
- `Proyecto-Final/docs/` — documentación académica del proyecto final +
  `casos-de-uso/CU-01..CU-08`.
- `Proyecto-Final/{backend,frontend/web,frontend/mobile,database}/` —
  vacíos, futura implementación.

Cadena de trazabilidad: `Contexto-Talleres.md` → backlog/HU → casos de uso →
RNF → arquitectura ↔ cumplimiento RNF → pruebas → software.

## Reglas operativas mínimas

- Documentación en español. Sin emojis en markdown técnico.
- No inventar comandos de build/test. Único build real: PDF de arquitectura
  (`Taller-6/Arquitectura/instrucciones-creacion-pdf.md`).
- Diagramas: editar fuente (`.puml` / `.d2`), no solo el PNG.
- Prefijo numérico en archivos define orden de lectura; no renumerar al
  insertar.
- Casos de uso: ID + nombre sincronizados con `0-Resumen-Casos-Uso.md`.
- Cuando una HU/CU/RNF se toque, verificar referencias cruzadas (backlog,
  cumplimiento RNF, mockup, diagramas).
- Conventional Commits, inglés, minúsculas. Sin atribución de IA.
- No commit automático. No mover/renombrar carpetas sin solicitud.
- Si llega petición de implementar software en `Proyecto-Final/`: pedir
  stack y crear `AGENT.md`/`README.md` propio antes de escribir código.

## Antes de proponer cambios

1. Leer `0-Task.md` del taller en cuestión (o `0-Contexto-Proyecto-Final.md`).
2. Releer `Contexto-Talleres.md` si la duda es de alcance.
3. Verificar artefactos relacionados aguas arriba/abajo de la cadena.
4. Aplicar checklist de `AGENTS.md §6`.
