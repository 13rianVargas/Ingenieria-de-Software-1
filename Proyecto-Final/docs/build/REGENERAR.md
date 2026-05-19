# REGENERAR — Command sheet para artefactos del Proyecto Final

Hoja de comandos para **regenerar PNGs de diagramas + DOCX de entregables** sin depender de sesiones IA ni tokens. Pensada para que cualquier miembro del equipo pueda reconstruir todo el material publicable desde cero en menos de 5 minutos.

---

## 1. ¿Qué se regenera aquí?

| Artefacto | Origen | Destino |
| :--- | :--- | :--- |
| PNGs de vistas de arquitectura | `Proyecto-Final/docs/diagramas/arquitectura/*.puml` | `Proyecto-Final/docs/diagramas/arquitectura/*.png` |
| PNG del MER | `Proyecto-Final/docs/diagramas/mer/mer-pqrs.puml` | `Proyecto-Final/docs/diagramas/mer/mer-pqrs.png` |
| DOCX de arquitectura | `Proyecto-Final/docs/build/arquitectura-pqrs/contenido/*.md` + `00-portada.yaml` | `Proyecto-Final/docs/build/arquitectura-pqrs/arquitectura-pqrs.docx` |
| DOCX de plan de pruebas | `Proyecto-Final/docs/build/plan-pruebas-pqrs/contenido/*.md` + `00-portada.yaml` | `Proyecto-Final/docs/build/plan-pruebas-pqrs/plan-pruebas-pqrs.docx` |

Los `.docx` **embeben los PNGs** generados arriba. Por eso el orden importa: PNGs primero, DOCX después.

---

## 2. Prerequisitos

### 2.1 Herramientas del sistema

| Herramienta | Para qué | Verificación | Instalación (macOS) |
| :--- | :--- | :--- | :--- |
| `plantuml` | Compilar `.puml` → `.png` | `plantuml -version` | `brew install plantuml` |
| `python3` (>= 3.11) | Correr `generar-docx.py` | `python3 --version` | `brew install python@3.11` |
| Java JRE (>= 11) | Backend de PlantUML | `java -version` | `brew install openjdk@17` |

### 2.2 Virtualenv Python

Cada subcarpeta (`arquitectura-pqrs/` y `plan-pruebas-pqrs/`) tiene su propio `.venv` con `python-docx` y `pyyaml`. Si no existe o está corrupto:

```bash
cd Proyecto-Final/docs/build/arquitectura-pqrs
python3 -m venv .venv
source .venv/bin/activate
pip install python-docx pyyaml
deactivate
```

Repetir para `plan-pruebas-pqrs/`.

> **Nota:** no commitear `.venv/`. Ya está en `.gitignore`.

---

## 3. ¿Cuándo regenerar?

| Cambio detectado | Qué hay que regenerar |
| :--- | :--- |
| Editaste un `.puml` en `diagramas/arquitectura/` o `diagramas/mer/` | El PNG correspondiente + los dos DOCX (si el PNG aparece embebido). |
| Editaste un `.md` en `build/arquitectura-pqrs/contenido/` | Solo el DOCX de arquitectura. |
| Editaste un `.md` en `build/plan-pruebas-pqrs/contenido/` | Solo el DOCX del plan de pruebas. |
| Editaste `estilos.py`, `generar-docx.py` o `00-portada.yaml` | El DOCX correspondiente. |
| Cambió la fecha de entrega o la versión del documento | El DOCX correspondiente (la fecha vive en `00-portada.yaml`). |

Si tienes duda, regenera todo. Toma < 30 segundos.

---

## 4. Comandos exactos

Desde la raíz del repo (`Ingenieria-de-Software-1/`):

### 4.1 Solo PNGs (rápido, ~10 s)

```bash
plantuml -tpng Proyecto-Final/docs/diagramas/arquitectura/*.puml
plantuml -tpng Proyecto-Final/docs/diagramas/mer/*.puml
```

### 4.2 Solo DOCX de arquitectura

```bash
cd Proyecto-Final/docs/build/arquitectura-pqrs
source .venv/bin/activate
python generar-docx.py
deactivate
cd -
```

### 4.3 Solo DOCX de plan de pruebas

```bash
cd Proyecto-Final/docs/build/plan-pruebas-pqrs
source .venv/bin/activate
python generar-docx.py
deactivate
cd -
```

### 4.4 Todo de una sola corrida (one-liner)

```bash
plantuml -tpng Proyecto-Final/docs/diagramas/arquitectura/*.puml \
  && plantuml -tpng Proyecto-Final/docs/diagramas/mer/*.puml \
  && ( cd Proyecto-Final/docs/build/arquitectura-pqrs && source .venv/bin/activate && python generar-docx.py && deactivate ) \
  && ( cd Proyecto-Final/docs/build/plan-pruebas-pqrs && source .venv/bin/activate && python generar-docx.py && deactivate )
```

Salida esperada:

```
Documento generado: .../arquitectura-pqrs.docx
Documento generado: .../plan-pruebas-pqrs.docx
```

---

## 5. Verificación post-regeneración

```bash
# 1. PNGs nuevos (timestamps recientes)
ls -la Proyecto-Final/docs/diagramas/arquitectura/*.png Proyecto-Final/docs/diagramas/mer/*.png

# 2. DOCX nuevos
ls -la Proyecto-Final/docs/build/{arquitectura-pqrs,plan-pruebas-pqrs}/*.docx

# 3. Tamaños razonables (cada DOCX 30-100 KB típico, PNGs 30-60 KB)
```

Abrir cada DOCX en LibreOffice/Word/Pages y verificar:
- Portada con título correcto y fecha del `00-portada.yaml`.
- Índice se generó (Tabla de Contenido al inicio).
- PNGs embebidos visibles (no como cajas rotas).
- Tablas con bordes y filas alternas (paleta charcoal/slate).

---

## 6. Troubleshooting

### `plantuml: command not found`
Instalar con `brew install plantuml` (macOS) o `apt install plantuml` (Ubuntu). Verifica que Java esté disponible (`java -version`); PlantUML lo necesita como backend.

### `ModuleNotFoundError: No module named 'docx'`
El venv no tiene `python-docx`. Activa el venv y reinstala:
```bash
source .venv/bin/activate
pip install python-docx pyyaml
```

### `.venv/bin/python: No such file or directory`
El venv no existe o está corrupto. Recreá:
```bash
cd Proyecto-Final/docs/build/arquitectura-pqrs   # o plan-pruebas-pqrs
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
pip install python-docx pyyaml
```

### El PNG generado se ve cortado o con labels superpuestos
Editar el `.puml` correspondiente:
- Bajar densidad con `skinparam nodesep 60` / `skinparam ranksep 80`.
- Evitar `skinparam linetype ortho` cuando hay muchas aristas cruzadas.
- Acortar labels de aristas y de componentes.
- Re-render y revisar.

### `Documento generado` aparece pero el `.docx` está vacío en Word
Verificar que `00-portada.yaml` tiene la metadata mínima (`titulo`, `autor`, `fecha`, `version`) y que los `.md` en `contenido/` no tienen errores de sintaxis (encabezados sin `#`, tablas mal cerradas, fences ``` sin abrir). El parser ignora errores silenciosamente; si la sección no aparece en el DOCX, casi siempre es problema del Markdown.

### El DOCX abre pero los PNGs salen como cajas rotas
El `.docx` referencia las rutas de los PNGs en disco. Verificar que los PNGs **se regeneraron antes** que el DOCX. Si dudas, ejecuta el one-liner de la sección 4.4 en ese orden.

---

## 7. Convenciones

- **No commitear** `.venv/`, `__pycache__/`, ni los `.docx` finales. El `.gitignore` ya los bloquea (líneas 5–19): cada miembro del equipo regenera el `.docx` localmente cuando necesite el entregable.
- **Sí commitear** los `.png` regenerados. Son livianos (30–60 KB), versionables y permiten ver los diagramas directamente en GitHub.
- Cuando un `.puml` cambia en un PR, regenerar el PNG correspondiente **en el mismo commit** (o uno encadenado). El reviewer debe poder visualizar el diagrama sin instalar plantuml.
- Cuando un `.md` de `contenido/` o un `.py` de pipeline cambia, **NO se commitea el DOCX** (está ignorado). En su lugar, el PR description menciona que regenerando el DOCX se verá el cambio en el entregable final.
- Patrón de commit típico para regeneración de PNG: `docs: regenerate <diagrama> after <cambio>`.

---

## 8. Referencias rápidas

- Fuente de los PUMLs de arquitectura: [`../diagramas/arquitectura/`](../diagramas/arquitectura/)
- Fuente del PUML del MER: [`../diagramas/mer/`](../diagramas/mer/)
- Pipeline DOCX arquitectura: [`./arquitectura-pqrs/`](./arquitectura-pqrs/)
- Pipeline DOCX plan de pruebas: [`./plan-pruebas-pqrs/`](./plan-pruebas-pqrs/)
- Documentación del pipeline: [`./README.md`](./README.md)
