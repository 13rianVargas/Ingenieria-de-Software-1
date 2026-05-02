# Instrucciones para generar el DOCX

## Requisitos

Python 3.10+. Verificar con `python3 --version`.

Primera vez — crear entorno virtual e instalar dependencias:

```bash
# Desde Taller-7/PlanDePruebas/
python3 -m venv .venv
source .venv/bin/activate
pip install python-docx pyyaml
```

## Comando

Desde `Taller-7/PlanDePruebas/` (con venv activo):

```bash
source .venv/bin/activate   # si no esta activo
python generar-docx.py
```

Genera `plan-de-pruebas.docx` en la misma carpeta.

## Abrir la Tabla de Contenido

Al abrir el `.docx` en Word o LibreOffice, actualizar el TOC:

- **Word**: clic derecho sobre el TOC → "Actualizar campo" → "Actualizar toda la tabla".
- **LibreOffice**: clic derecho sobre el TOC → "Actualizar indice".
- O presionar `F9` con el cursor sobre el campo.

## Archivos involucrados

| Archivo | Proposito |
|---|---|
| `contenido/00-portada.yaml` | Metadata: titulo, autores, fecha, curso |
| `contenido/01-resumen-ejecutivo.md` | Seccion 1 del documento |
| `contenido/02-alcance.md` | Seccion 2 |
| `contenido/03-estrategia.md` | Seccion 3 |
| `contenido/04-criterios.md` | Seccion 4 |
| `contenido/05-recursos.md` | Seccion 5 |
| `contenido/06-planificacion.md` | Seccion 6 |
| `contenido/07-riesgos.md` | Seccion 7 |
| `contenido/08-anexos.md` | Seccion 8 |
| `contenido/tablas/raci.csv` | Referencia RACI (renderizada en 06) |
| `estilos.py` | Paleta charcoal + helpers python-docx |
| `generar-docx.py` | Pipeline principal |
| `plan-de-pruebas.docx` | Salida generada (no versionar en git) |

## Notas

- El `.docx` es binario; no tiene diff legible en git. Versionar las fuentes
  (`contenido/`, `estilos.py`, `generar-docx.py`), no el artefacto.
- Para agregar contenido: editar el `.md` correspondiente en `contenido/`
  y regenerar. No editar el `.docx` directamente.
- Tablas en Markdown: formato pipe estandar (`| col1 | col2 |`).
  El parser omite las filas separadoras (`|---|---|`).
