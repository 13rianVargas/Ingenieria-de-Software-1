# Build de Documentos `.docx`

Esta carpeta contiene pipelines para generar los documentos `.docx` de entrega academica del Proyecto-Final.

> Los archivos `.docx` generados NO se versionan en git (estan en `.gitignore`). Son artefactos binarios reproducibles. Se regeneran cuando se necesita una entrega.

## Pipelines disponibles

Los entregables se consolidan en 4 documentos estandar IEEE/SWEBOK:

| Subcarpeta | Genera | Estandar | Cubre entregables obligatorios |
|---|---|---|---|
| `spmp/` | `spmp.docx` | SPMP (Software Project Management Plan) | #1 Planeacion mediante el marco Scrum |
| `srs/` | `srs.docx` | SRS (IEEE 830) | #2 RF, #3 RNF, #4 Diagrama CU, #5 Especificacion CU, #6 Especificacion RNFs, #8 Prototipos (anexo) |
| `arquitectura-pqrs/` | `arquitectura-pqrs.docx` | SAD (IEEE 42010) | #7 Diagrama de Arquitectura, #9 MER (seccion 8 embebida) |
| `plan-pruebas-pqrs/` | `plan-pruebas-pqrs.docx` | STP (IEEE 829) | #11 Plan de Pruebas |
| `resultado-pruebas-hu01/` (futuro) | `resultado-pruebas-hu01.docx` | — | #12 Ejecucion y Resultado de Pruebas (post-implementacion) |

Entregables obligatorios pendientes (post-implementacion): #10 Producto (software construido), #12 Ejecucion y Resultado de Pruebas.

## Como regenerar un `.docx`

Desde la raiz del repositorio, ejecuta (sustituyendo `<pipeline>` por uno de: `srs`, `spmp`, `arquitectura-pqrs`, `plan-pruebas-pqrs`):

```bash
cd Proyecto-Final/docs/build/<pipeline>
python3 -m venv .venv
source .venv/bin/activate
pip install python-docx pyyaml
python generar-docx.py
```

El `.docx` queda en la misma carpeta del script. Por ejemplo:

- `Proyecto-Final/docs/build/srs/srs.docx`
- `Proyecto-Final/docs/build/spmp/spmp.docx`
- `Proyecto-Final/docs/build/arquitectura-pqrs/arquitectura-pqrs.docx`
- `Proyecto-Final/docs/build/plan-pruebas-pqrs/plan-pruebas-pqrs.docx`

Para regenerar los 4 documentos de una sola corrida (asume venvs ya creados con `python-docx` y `pyyaml` instalados):

```bash
for d in Proyecto-Final/docs/build/{srs,spmp,arquitectura-pqrs,plan-pruebas-pqrs}/; do
  ( cd "$d" && source .venv/bin/activate && python generar-docx.py && deactivate )
done
```

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

- Imagenes Markdown `![alt](path)` que apunten a un archivo PNG existente (el path se resuelve relativo a la carpeta `contenido/`).

Lo que NO soporta:

- Bloques de codigo con fence ``` (se renderizan como parrafos planos).
- HTML embebido (tablas u otros tags HTML se renderizan como texto).

Si necesitas funcionalidad adicional, edita `generar-docx.py` (parser en `parse_markdown_section`).

## Estilo visual

Paleta charcoal/slate definida en `estilos.py`, consistente entre los entregables del Proyecto-Final.

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
