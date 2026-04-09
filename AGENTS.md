# Guía del Agente para Ingenieria-de-Software-1

## 1) Propósito real del repositorio

Este repositorio corresponde a una materia de Ingeniería de Software y contiene
entregables académicos en formato Markdown (talleres, backlog y checklist).

No es un proyecto de software ejecutable: no hay código fuente de aplicación,
ni scripts de build, ni pruebas automáticas, ni entorno de runtime.

## 2) Alcance del agente

### Qué SI debe hacer

- Redactar, mejorar y organizar documentación académica en español claro.
- Mantener coherencia de estilo entre archivos de un mismo taller.
- Completar o refinar tablas, listas, secciones y plantillas existentes.
- Crear nuevos archivos Markdown solo cuando el taller o la entrega lo requiera.

### Qué NO debe hacer

- No inventar scripts, comandos de compilación, pipelines ni dependencias.
- No proponer implementación de código si la tarea es documental.
- No cambiar la estructura de tablas existentes sin justificación explícita.
- No mover ni renombrar carpetas/archivos sin solicitud directa.
- No hacer commit automáticamente (solo si se solicita explícitamente).

## 3) Reglas de edición (talleres y backlog)

### Backlog (`Scrum-BackLog/`)

- Respetar la estructura de tablas Markdown y sus encabezados.
- Mantener las columnas originales de cada plantilla; no eliminarlas.
- Si se agregan historias de usuario, conservar formato consistente (IDs,
  prioridad, estimación, criterios y sprint).
- No borrar secciones de contexto o explicación ya incluidas, salvo instrucción
  explícita.

### Talleres (`Taller-3/`, `Taller-4/`)

- Conservar el enfoque académico del enunciado y la trazabilidad del trabajo.
- Mantener numeración y orden lógico de secciones cuando ya exista.
- Si se crea contenido nuevo, debe ser coherente con el contexto del taller y
  no contradecir archivos base (`0-Contexto-*.md`).
- Priorizar claridad: títulos concretos, listas legibles y lenguaje técnico
  entendible.

## 4) Estructura esperada y convención de nombres

Estructura actual esperada:

- `Scrum-BackLog/`
  - `backlog.md`
  - `plantilla-vacia.md`
- `Taller-3/`
  - archivos `.md` con prefijo numérico para orden (ej.: `0-...`, `1-...`,
    `3.1-...`)
- `Taller-4/`
  - `0-Contexto-Taller-4.md` y archivos relacionados con la entrega
- `checklist-pendientes.md`

Convenciones de nombres:

- Usar Markdown (`.md`) para nuevos documentos.
- Mantener prefijo numérico en talleres para reflejar secuencia.
- Usar nombres descriptivos en español, con guiones para separar palabras.

## 5) Flujo recomendado para nuevas entregas/talleres

1. Revisar primero el archivo de contexto del taller (`0-Contexto-...`).
2. Identificar entregables solicitados y su formato (tabla, narrativa, checklist,
   casos de uso, etc.).
3. Crear o actualizar archivos siguiendo la convención de nombres y orden.
4. Completar contenido con trazabilidad al enunciado (sin inventar alcance).
5. Verificar consistencia entre documentos relacionados (ej. backlog,
   funcionalidades, estimaciones, pendientes).

## 6) Checklist de calidad antes de guardar cambios

- El contenido responde exactamente al enunciado del taller o entrega.
- No se alteró la estructura base de tablas/formato sin motivo.
- Los títulos y secciones mantienen orden y numeración coherentes.
- Redacción clara, sin ambigüedades y sin mezclar temas no solicitados.
- No se agregaron scripts, comandos build/test ni instrucciones de ejecución.
- Rutas y nombres de archivos siguen la convención del repositorio.

## 7) Nota operativa

Si una solicitud trata este repositorio como un proyecto ejecutable, el agente
debe aclarar que este espacio es documental/académico y orientar la solución a
entregables en Markdown.
