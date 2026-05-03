# 6. Proyectos

## Personal Software Process (PSP)

En PSP, un "proyecto" es cualquier tarea de desarrollo que el desarrollador
planea, ejecuta y mide con rigurosidad. El enfoque está en construir una base
histórica personal que haga cada proyecto sucesivo más predecible.

### Planificación del proyecto individual

#### Estimación de tamaño
- **Método PROBE:** el desarrollador descompone el programa en partes y compara cada parte con programas similares ya registrados en su base histórica.
- **Resultado:** rango de confianza (pesimista / esperado / optimista) para LOC y tiempo.

#### Plan de Proyecto Individual (PPI)
El PPI consolida:
- Estimación de tamaño (LOC o puntos de función personales).
- Estimación de tiempo por fase (planeación, diseño, código, revisión, pruebas, postmortem).
- Objetivo de calidad: Yield esperado, defectos por KLOC.
- Línea base contra la que se medirá el desempeño real al cierre.

### Gestión durante el proyecto

| Actividad | Acción del desarrollador |
|-----------|--------------------------|
| Seguimiento de tiempo | Registrar inicio/fin de cada fase en el Time Log |
| Seguimiento de defectos | Anotar cada defecto: tipo, fase de introducción, fase de detección |
| Ajuste de estimaciones | Recalcular si el tamaño real difiere >20 % del estimado |
| Revisiones personales | Aplicar checklist de diseño y código antes de compilar |

### Métricas clave de proyecto en PSP

- **Yield personal:** % de defectos eliminados antes de la primera compilación.
  Fórmula: `Yield = defectos pre-compilación / (defectos pre + post compilación) × 100`
- **A/FR (Appraisal/Failure Ratio):** relación entre esfuerzo en revisiones vs. esfuerzo en corrección de fallos. Un A/FR > 1 indica que revisar es más barato que corregir.
- **Productividad:** LOC por hora, usada para calibrar estimaciones futuras.

---

## Team Software Process (TSP)

En TSP, un proyecto es un esfuerzo colectivo gestionado con métricas compartidas,
roles definidos y una estrategia de calidad acordada por todo el equipo desde el día uno.

### Tipos de proyectos TSP

| Tipo | Descripción |
|------|-------------|
| **Proyecto de ciclo único** | Producto pequeño entregado en un solo ciclo de desarrollo |
| **Proyecto multiciclo** | Producto grande dividido en 2 o más ciclos iterativos; el más común en la práctica |
| **Proyecto de mejora de proceso** | El equipo trabaja específicamente en optimizar su metodología PSP/TSP con datos reales |

### Gestión del proyecto en TSP

#### Plan del equipo
- Construido colectivamente en el Launch, integra los PPI de cada miembro.
- Incluye: cronograma del equipo, plan de calidad, plan de riesgos, criterios de salida por ciclo.
- Propietario: Gestor de Planificación (Planning Manager).

#### Seguimiento continuo
- **Tablero de tareas:** cada tarea tiene responsable, estimación, % real y estado.
- **Reunión semanal de estado:** el equipo revisa métricas clave y ajusta el plan.
- **Reporte de estado semanal:** documento formal que muestra avance, defectos acumulados, riesgos activos y acciones correctivas. Insumo para la gerencia.

#### Gestión de calidad del proyecto
- Densidad de defectos objetivo definida en el Launch (ej. < 2 defectos/KLOC en entrega).
- Inspecciones formales por pares en hitos críticos (fin de diseño, fin de codificación).
- Yield del equipo calculado por el Quality Manager para detectar si las revisiones son efectivas.

#### Cierre del proyecto
- Postmortem colectivo: métricas finales vs. plan original, análisis de causas de desviación.
- Actualización del Process Improvement Proposal (PIP) del equipo.
- Archivos del proyecto: base histórica para estimaciones de proyectos futuros.

### Relación proyecto TSP ↔ PSP individual

```
Plan del equipo (TSP)
    └── Plan de Proyecto Individual #1 (PSP) → Time Log + Defect Log
    └── Plan de Proyecto Individual #2 (PSP) → Time Log + Defect Log
    └── Plan de Proyecto Individual #N (PSP) → Time Log + Defect Log
           ↓
    Métricas del equipo = agregado de métricas individuales
```

La calidad del plan del equipo es tan buena como la disciplina individual de
cada miembro al aplicar PSP. Esta dependencia es la razón por la que TSP exige
que sus integrantes estén entrenados en PSP antes de participar en un proyecto TSP.