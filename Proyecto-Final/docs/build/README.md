# Build de Documentos `.docx`

Esta carpeta contiene pipelines para generar los documentos `.docx` de entrega academica del Proyecto-Final.

> Los archivos `.docx` generados NO se versionan en git (estan en `.gitignore`). Son artefactos binarios reproducibles. Se regeneran cuando se necesita una entrega.

## Pipelines disponibles

| Subcarpeta | Genera | Cubre entregable |
|---|---|---|
| `arquitectura-pqrs/` | `arquitectura-pqrs.docx` | #7 Diagrama de Arquitectura |
| `plan-pruebas-pqrs/` | `plan-pruebas-pqrs.docx` | #11 Plan de Pruebas |
| `resultado-pruebas-hu01/` (futuro) | `resultado-pruebas-hu01.docx` | #12 Ejecucion y Resultado de Pruebas (post-implementacion) |

## Como regenerar un `.docx`

Desde la raiz del repositorio, ejecuta:

```bash
cd Proyecto-Final/docs/build/arquitectura-pqrs   # o plan-pruebas-pqrs
python3 -m venv .venv
source .venv/bin/activate
pip install python-docx pyyaml
python generar-docx.py
```

El `.docx` queda en la misma carpeta del script. Por ejemplo:

- `Proyecto-Final/docs/build/arquitectura-pqrs/arquitectura-pqrs.docx`
- `Proyecto-Final/docs/build/plan-pruebas-pqrs/plan-pruebas-pqrs.docx`

## Como editar el contenido

Cada subcarpeta tiene la misma estructura:

```
<pipeline>/
├── generar-docx.py        # script generador (no editar a menos que cambies la estructura del doc)
├── estilos.py             # paleta y helpers de estilo (compartidos)
└── contenido/
    ├── 00-portada.yaml    # metadata (titulo, autores, fecha, etc.)
    └── NN-*.md            # secciones del documento en markdown
```

Para cambiar el contenido del documento:

1. Edita los archivos `contenido/NN-*.md`.
2. Si quieres ajustar metadata (autores, fecha, version): edita `contenido/00-portada.yaml`.
3. Vuelve a correr `python generar-docx.py`.

El script renumera secciones automaticamente segun el orden de la lista `SECCIONES` definida en `generar-docx.py`.

## Sintaxis Markdown soportada

El parser interno de `generar-docx.py` soporta:

- Headings `#`, `##`, `###` (hasta nivel 3).
- Listas con `-` y listas numeradas con `N.`.
- Tablas pipe `| col1 | col2 |`.
- Inline: `**bold**`, `*italic*`, `` `code` ``, `[texto](url)`.

Lo que NO soporta:

- Imagenes inline (los diagramas se referencian via texto que linkea al `.puml`).
- Bloques de codigo con fence ``` (se renderizan como parrafos planos).
- HTML embebido.

Si necesitas funcionalidad adicional, edita `generar-docx.py` (parser en `parse_markdown_section`).

## Estilo visual

Paleta charcoal/slate definida en `estilos.py`. Es la misma paleta del Taller-6 (PDF) y Taller-7 (`.docx`), lo que mantiene coherencia visual entre todos los entregables del curso.

| Color | Hex | Uso |
|---|---|---|
| Primary | `#2B2D42` | Titulos H1, encabezados de tabla |
| Secondary | `#555B6E` | Subtitulos H2, H3 |
| Light | `#E8EAEF` | Filas alternas de tabla |
| Border | `#A8ACBA` | Bordes de tabla |
| Muted | `#6C7080` | Pie de pagina, leyendas |
| Text | `#212529` | Cuerpo del texto |

Fuente base: Helvetica Neue con fallback a Calibri si no esta instalada.

## Convencion para nuevos pipelines

Si necesitas crear un pipeline nuevo (por ejemplo para el reporte de resultados de pruebas):

1. Crea una nueva subcarpeta dentro de `build/`.
2. Copia `estilos.py` desde alguna existente.
3. Copia `generar-docx.py` y ajusta:
   - `OUTPUT` con el nombre final del `.docx`.
   - `SECCIONES` con los archivos markdown a incluir.
   - `build_portada()` y `build_historial()` si necesitas titulares distintos.
4. Crea `contenido/00-portada.yaml` con la metadata.
5. Crea los archivos `contenido/NN-*.md` con el contenido.
6. Ejecuta `python generar-docx.py`.

## Cuando entregar al docente

El docente recibe el `.docx` generado por canal de entrega (Drive, email, USB), NO el repositorio. Brian (admin) regenera los `.docx` antes de cada entrega academica y los comparte por el canal acordado.

El repositorio contiene las fuentes (`contenido/*.md` y `*.puml`) que cualquier integrante puede regenerar si necesita revisar el documento mientras desarrolla.
