# Instrucciones para generar el PDF

## Requisitos

- [Pandoc](https://pandoc.org/installing.html)
- [WeasyPrint](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html)

## Comando

Desde la carpeta `Taller-6/Arquitectura/`:

```bash
pandoc arquitectura.md metadata.yaml \
  --template=template.html \
  --toc --toc-depth=2 \
  --number-sections \
  --to=html5 \
  -o tmp_build.html && weasyprint tmp_build.html arquitectura.pdf && rm tmp_build.html
```

| Archivos involucrados         | Archivo Propósito                           |
| ----------------------------- | ------------------------------------------- |
| images/                       | Diagramas en PNG                            |
| arquitectura.md               | Contenido del documento                     |
| instrucciones-creacion-pdf.md | Esta guía de instrucciones                  |
| metadata.yaml                 | Título, autores, datos del curso            |
| styles.css                    | Estilos y paginación PDF                    |
| template.html                 | Plantilla HTML personalizada (portada, TOC) |

## Notas

- Los warnings de WeasyPrint sobre gap y overflow-x son normales y no afectan el resultado.
- Para regenerar los diagramas PNG desde los fuentes .puml / .d2, ejecutar el script ../generar-imagenes.sh desde Taller-6/
