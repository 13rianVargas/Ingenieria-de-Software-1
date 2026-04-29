# Guía del Agente para Ingenieria-de-Software-1

## 1) Propósito del repositorio

Repositorio académico de la materia **Ingeniería de Software 1**. Reúne la
secuencia completa de artefactos que produce un equipo Scrum desde el
levantamiento de requisitos hasta el plan de pruebas, sobre un caso real
documentado en `Contexto-Talleres.md`: el sistema **E-Commerce Comercial
Konrad** (marketplace con flujo de registro de vendedores, suscripciones,
publicación de productos, compras, calificaciones, BAM y administración).

Estado actual: **mayoritariamente documental** (talleres + backlog +
arquitectura + casos de uso). El Proyecto Final ya tiene andamiaje para
software (`Proyecto-Final/backend/`, `Proyecto-Final/frontend/web`,
`Proyecto-Final/frontend/mobile`, `Proyecto-Final/database/`). En el futuro
contendrá implementación real; cuando exista, leer su propio
`AGENT.md`/`README.md` antes de tocar código.

## 2) Cómo está organizado el repositorio (propósito por carpeta)

Cada artefacto responde a un momento concreto del ciclo Scrum sobre el caso
de Comercial Konrad. No son archivos sueltos: forman una cadena de
trazabilidad **enunciado → backlog → arquitectura → pruebas → software**.

### `Contexto-Talleres.md` (raíz)
Enunciado del cliente. Fuente de verdad funcional y de requerimientos no
funcionales (seguridad, desempeño, almacenamiento, integración SOAP, etc.).
Todos los talleres lo referencian. **No modificar el enunciado** salvo que el
usuario lo pida.

### `Scrum-Backlog/`
Backlog de producto vivo del caso.
- `Product-Backlog.md`: HU priorizadas con IDs, estimación, criterios y
  sprint asignado.
- `Plantilla-Vacia.md`: plantilla base para nuevas filas/HU.
Mantener columnas y formato. Cualquier HU agregada debe referenciar su
funcionalidad en `Taller-3/` o `Proyecto-Final/docs/`.

### `Taller-3/` — Visual Story Mapping
Producto del taller: backlog inicial + plan de release + estimaciones.
- `0-Task.md` enunciado.
- `1-Actores.md`, `2-Procesos.md`, `3-Funcionalidades.md`,
  `3.1-Diagramas.md`: levantamiento.
- `5-Releases.md`: plan de releases / MVPs.
- `6-HU-Base.md`: historias de usuario base con actividades.
- `7-PERT.md`, `8-Planning-Poker.md`, `9-Capacidad-de-Equipo.md`:
  estimación y capacidad del equipo.
- `10-Pendientes.md`: trabajo no cerrado.

### `Taller-4/` — Especificación funcional + Mockups
Detalle de 2 casos de uso (incluye registro de vendedor, excluye login) con
formato `CL-RequerimientosFuncionales-001`.
- `0-Task.md` enunciado.
- `MockUps/Registro.html` + `MockUps/images/`: prototipo navegable.

### `Taller-5/` — Requerimientos No Funcionales
- `0-Task.md` enunciado.
- `1-RNF.md`: 3 RNF con 5–10 criterios de aceptación cada uno, formato
  `CL-RequerimientosNoFuncionales-001`. Insumo directo de `Taller-6`.

### `Taller-6/` — Arquitectura
Diseño de software multivista + documento consolidado en PDF.
- `0-Task.md` enunciado (vistas: Casos de Uso, Lógica, Despliegue/Física).
- `1-Cumplimiento-RNF.md`: matriz arquitectura ↔ RNF de Taller-5.
- `Diagramas/` (cada vista en su subcarpeta):
  - `1-Casos-de-Uso/` — `.puml` + `.md` por caso de uso, `word-to-text/`.
  - `2-Vista-Logica/` — componentes nivel 1, 2, 3 (`.puml` + `.md`).
  - `3-Vista-Fisica/` — topología de despliegue en D2 (`.d2`).
  - `4-Vista-Implementacion/` — `.png` + ASCII art.
  - `5-Vista-Procesos/` — diagramas de procesos (`.puml` + `.md`).
  - `6-Vista-Datos/` — modelo entidad-relación (`.puml` + `.md`).
- `Arquitectura/` — documento publicable:
  - `arquitectura.md` contenido fuente.
  - `metadata.yaml` título, autores, datos del curso.
  - `template.html` plantilla HTML (portada, TOC).
  - `styles.css` estilos y paginación PDF.
  - `images/` PNGs renderizados desde los `.puml` / `.d2`.
  - `arquitectura.pdf` salida.
  - `instrucciones-creacion-pdf.md` comandos `pandoc + weasyprint`.

Esta es la **única zona del repo con build real**:

```bash
# Desde Taller-6/Arquitectura/
pandoc arquitectura.md metadata.yaml \
  --template=template.html --toc --toc-depth=2 --number-sections \
  --to=html5 -o tmp_build.html \
  && weasyprint tmp_build.html arquitectura.pdf \
  && rm tmp_build.html
```

Para regenerar PNGs desde `.puml`/`.d2` se usa el script `generar-imagenes.sh`
en `Taller-6/` (referenciado por las instrucciones).

### `Taller-7/` — Plan y casos de pruebas
Alcance: un solo caso de uso o HU.
- `0-Task.md` enunciado. Entrega en construcción.

### `Proyecto-Final/`
Entregable transversal del curso. Acumula la planeación completa **y** el
software futuro.
- `docs/` documentación académica:
  - `0-Contexto-Proyecto-Final.md` enunciado del proyecto.
  - `1-Funcionalidades.md`, `2-MVP.md`, `3-HU-Base-&-PERT.md`,
    `4-Planning-Poker.md`, `5-Capacidad-de-Equipo.md`, `6-Product-Backlog.md`
    secuencia Scrum análoga a `Taller-3/` pero a nivel proyecto final.
  - `casos-de-uso/`:
    - `0-Resumen-Casos-Uso.md` índice maestro.
    - `CU-01`…`CU-08` especificación detallada por caso de uso.
    - `plantuml/` fuentes `.puml`.
    - `images/` renders.
- `backend/` (vacío) — implementación futura del backend.
- `frontend/web/` (vacío) — cliente web futuro.
- `frontend/mobile/` (vacío) — cliente móvil futuro.
- `database/` (vacío) — scripts/migraciones futuras.

Cuando se materialice el software, cada subdirectorio debe traer su propio
`AGENT.md` / `README.md` con stack, comandos de build y test. Hasta entonces,
**no inventar comandos**.

## 3) Alcance del agente

### Qué SI debe hacer

- Redactar, mejorar y organizar documentación académica en español claro,
  preservando la trazabilidad enunciado → artefacto.
- Mantener coherencia de estilo y nomenclatura entre archivos del mismo taller
  o del proyecto final.
- Completar tablas, listas, secciones y plantillas existentes sin romper su
  estructura.
- Sincronizar referencias cruzadas: HU del backlog ↔ funcionalidades; RNF ↔
  cumplimiento arquitectónico; casos de uso ↔ diagramas y mockups.
- Crear nuevos `.md` solo cuando el enunciado del taller o entrega lo exija.
- Para diagramas: editar fuente (`.puml` / `.d2`) y dejar nota cuando haga
  falta regenerar imagen; nunca reemplazar la imagen sin tocar la fuente.
- Para el documento de arquitectura: respetar `metadata.yaml`, `template.html`
  y `styles.css`; el contenido editable vive en `arquitectura.md`.

### Qué NO debe hacer

- No inventar scripts de build, comandos de test ni dependencias para el
  software futuro de `Proyecto-Final/` mientras esté vacío.
- No proponer implementación de código si la tarea es documental.
- No alterar la estructura de tablas existentes sin justificación explícita.
- No mover ni renombrar carpetas/archivos sin solicitud directa (los prefijos
  numéricos definen orden de lectura).
- No modificar `Contexto-Talleres.md` ni los `0-Task.md` de talleres salvo
  petición explícita: son enunciados de cliente/profesor.
- No hacer commit automáticamente. Conventional Commits, inglés, minúsculas.

## 4) Convenciones

### Nombres
- Markdown `.md` para nuevos documentos, español, palabras separadas con
  guiones.
- Prefijo numérico (`0-`, `1-`, `3.1-`, …) refleja orden de lectura. Si se
  inserta un archivo intermedio, no renumerar el resto sin instrucción.
- Casos de uso: `CU-NN-Nombre-Descriptivo.md`, IDs sincronizados con el
  resumen.

### Diagramas
- Fuente preferida: PlantUML (`.puml`); D2 (`.d2`) para topología física.
- Cada `.puml` lleva un `.md` hermano con explicación cuando aplique.
- Renders PNG en `images/` de la carpeta correspondiente.
- En `Proyecto-Final/docs/casos-de-uso/`: `plantuml/` para fuentes,
  `images/` para renders.

### Documentación
- Sin emojis en markdown técnico (excepción: callouts ya presentes en
  `0-Task.md`).
- Títulos concretos, listas legibles, lenguaje técnico entendible.
- Referencias cruzadas con enlaces relativos (`[texto](../ruta/archivo.md)`).

### Commits
Conventional Commits, inglés, minúsculas. Sin atribución de IA.
```
docs: add nfr acceptance criteria
docs(taller-6): update logical view diagrams
chore: regenerate architecture pdf
```

## 5) Flujo recomendado para una nueva entrega

1. Leer `0-Task.md` del taller (o `0-Contexto-Proyecto-Final.md` para
   proyecto final) y `Contexto-Talleres.md`.
2. Identificar entregables solicitados y su formato (tabla, narrativa,
   checklist, caso de uso, RNF, vista de arquitectura, plan de pruebas, …).
3. Crear/actualizar archivos respetando convención de nombres y orden
   numérico.
4. Trazabilidad al enunciado: no inventar alcance ni inferir fuera del
   contexto del cliente.
5. Verificar consistencia cruzada: backlog ↔ HU; RNF ↔ cumplimiento
   arquitectónico; casos de uso ↔ diagramas ↔ mockups; resumen de casos de
   uso ↔ archivos individuales.
6. Si el cambio toca diagramas o el documento de arquitectura: actualizar
   también renders y/o regenerar PDF si el usuario lo solicita.

## 6) Checklist de calidad

- Contenido responde exactamente al enunciado.
- Estructura base de tablas/formato intacta sin motivo.
- Numeración y orden de secciones coherente.
- Redacción clara, sin ambigüedades, sin temas no solicitados.
- No se agregaron comandos build/test inventados (excepto los ya
  documentados en `Taller-6/Arquitectura/instrucciones-creacion-pdf.md`).
- Rutas y nombres siguen la convención.
- Trazabilidad cruzada actualizada cuando aplique.
- Diagramas: fuente y render alineados.

## 7) Nota operativa

Si una solicitud trata el repo como proyecto ejecutable hoy, aclarar que es
documental con andamiaje para software futuro y orientar la solución a
entregables Markdown — salvo que el usuario explícitamente esté arrancando
la implementación en `Proyecto-Final/{backend,frontend,database}/`, en cuyo
caso pedir definir stack y crear su propio `AGENT.md`/`README.md` antes de
escribir código.
