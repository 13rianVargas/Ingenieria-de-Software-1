# Instrucciones para generar el PDF

## Requisitos

- [Pandoc](https://pandoc.org/installing.html)
- [WeasyPrint](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html) (`pip install weasyprint`)

## Comando

Desde la carpeta `Taller-6/Arquitectura/`:

```bash
pandoc arquitectura.md metadata.yaml \
  --template=template.html \
  --toc --toc-depth=2 \
  --pdf-engine=weasyprint \
  --css=styles.css \
  -o arquitectura.pdf
```

| Archivos involucrados | Archivo Propósito                           |
| --------------------- | ------------------------------------------- |
| arquitectura.md       | Contenido del documento                     |
| metadata.yaml         | Título, autores, datos del curso            |
| template.html         | Plantilla HTML personalizada (portada, TOC) |
| styles.css            | Estilos y paginación PDF                    |
| images/               | Diagramas en PNG                            |

## Notas

- Los warnings de WeasyPrint sobre gap y overflow-x son normales y no afectan el resultado.
- Para regenerar los diagramas PNG desde los fuentes .puml / .d2, ejecutar el script ../generar-imagenes.sh desde Taller-6/
