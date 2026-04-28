#!/usr/bin/env zsh
# Extrae bloques PlantUML de .md → crea .puml → renderiza PNG
# Renderiza .d2 → PNG
# Todo sale en Arquitectura/images/

set -e

SCRIPT_DIR="$(cd "$(dirname "${(%):-%x}")" && pwd)"
IMAGES_DIR="$SCRIPT_DIR/Arquitectura/images"

mkdir -p "$IMAGES_DIR"

# ── Extractor PlantUML ──────────────────────────────────────────────────────
extract_and_render() {
  local MD_PATH="$1"
  local BASENAME="$2"
  local PUML_PATH="${MD_PATH%.md}.puml"
  local PNG_OUT="$IMAGES_DIR/$BASENAME.png"

  if [[ ! -f "$MD_PATH" ]]; then
    echo "  [SKIP] No existe: $MD_PATH"
    return
  fi

  python3 - "$MD_PATH" "$PUML_PATH" <<'PYEOF'
import sys, re
md_path, puml_path = sys.argv[1], sys.argv[2]
content = open(md_path, encoding='utf-8').read()
match = re.search(r'```plantuml\s*\n(@startuml.*?@enduml)', content, re.DOTALL)
if not match:
    match = re.search(r'(@startuml.*?@enduml)', content, re.DOTALL)
if not match:
    print(f"  [WARN] Sin bloque PlantUML en {md_path}")
    sys.exit(0)
open(puml_path, 'w', encoding='utf-8').write(match.group(1).strip() + '\n')
print(f"  [OK] .puml -> {puml_path}")
PYEOF

  if [[ -f "$PUML_PATH" ]]; then
    echo "  [RENDER] $BASENAME.png ..."
    plantuml -tpng -DPLANTUML_LIMIT_SIZE=8192 -o "$IMAGES_DIR" "$PUML_PATH"
    local PUML_STEM="$(basename "${PUML_PATH%.puml}")"
    if [[ -f "$IMAGES_DIR/$PUML_STEM.png" && "$PUML_STEM" != "$BASENAME" ]]; then
      mv "$IMAGES_DIR/$PUML_STEM.png" "$PNG_OUT"
    fi
    echo "  [DONE] $PNG_OUT"
  fi
}

# ── PlantUML: Casos de Uso ──────────────────────────────────────────────────
echo "\n=== Casos de Uso ==="
extract_and_render "$SCRIPT_DIR/Casos-de-Uso/0-Diagrama-General.md"         "cu-00-general"
extract_and_render "$SCRIPT_DIR/Casos-de-Uso/1-Registrar-Solicitud-Vendedor.md" "cu-01-registro-vendedor"
extract_and_render "$SCRIPT_DIR/Casos-de-Uso/2-Publicar-Productos.md"       "cu-02-publicar-productos"
extract_and_render "$SCRIPT_DIR/Casos-de-Uso/3-Comprar-Productos.md"        "cu-03-comprar-productos"
extract_and_render "$SCRIPT_DIR/Casos-de-Uso/4-Gestion-Director-Comercial.md" "cu-04-director-comercial"
extract_and_render "$SCRIPT_DIR/Casos-de-Uso/5-Administracion-Sistema.md"   "cu-05-administracion"

# ── PlantUML: Vista Lógica ──────────────────────────────────────────────────
echo "\n=== Vista Lógica ==="
extract_and_render "$SCRIPT_DIR/Vista-Logica/1-Diagrama-Componentes-Nivel1.md" "logica-nivel1"
extract_and_render "$SCRIPT_DIR/Vista-Logica/2-Diagrama-Componentes-Nivel2.md" "logica-nivel2"
extract_and_render "$SCRIPT_DIR/Vista-Logica/3-Diagrama-Componentes-Nivel3.md" "logica-nivel3"

# ── PlantUML: Vista Procesos ────────────────────────────────────────────────
echo "\n=== Vista Procesos ==="
extract_and_render "$SCRIPT_DIR/Vista-Procesos/1-Registro-Vendedor.md"      "procesos-registro-vendedor"
extract_and_render "$SCRIPT_DIR/Vista-Procesos/2-Proceso-Compra.md"         "procesos-compra"
extract_and_render "$SCRIPT_DIR/Vista-Procesos/4-Gestion-Director-Comercial.md" "procesos-director-comercial"

# ── PlantUML: Vista Datos ───────────────────────────────────────────────────
echo "\n=== Vista Datos ==="
extract_and_render "$SCRIPT_DIR/Vista-Datos/1-Modelo-Entidad-Relacion.md"   "datos-mer"

# ── D2: Vista Física ────────────────────────────────────────────────────────
echo "\n=== Vista Física (D2) ==="

render_d2() {
  local D2_PATH="$1"
  local BASENAME="$2"
  local PNG_OUT="$IMAGES_DIR/$BASENAME.png"
  if [[ ! -f "$D2_PATH" ]]; then
    echo "  [SKIP] No existe: $D2_PATH"
    return
  fi
  echo "  [RENDER] $BASENAME.png ..."
  d2 "$D2_PATH" "$PNG_OUT"
  echo "  [DONE] $PNG_OUT"
}

render_d2 "$SCRIPT_DIR/Vista-Fisica/1-Topologia-Despliegue-Nivel1.d2" "fisica-nivel1"
render_d2 "$SCRIPT_DIR/Vista-Fisica/2-Topologia-Despliegue-Nivel2.d2" "fisica-nivel2"

# ── Copiar PNG existente: Implementación ────────────────────────────────────
echo "\n=== Vista Implementación (PNG existente) ==="
IMPL_SRC="$SCRIPT_DIR/Vista-Implementacion/1-Diagrama-Implentacion.png"
if [[ -f "$IMPL_SRC" ]]; then
  cp "$IMPL_SRC" "$IMAGES_DIR/implementacion.png"
  echo "  [DONE] implementacion.png"
else
  echo "  [SKIP] No existe: $IMPL_SRC"
fi

# ── Resumen ─────────────────────────────────────────────────────────────────
echo "\n=== Resultado final ==="
ls -lh "$IMAGES_DIR"
echo "\nListo. Todas las imagenes en: $IMAGES_DIR"
