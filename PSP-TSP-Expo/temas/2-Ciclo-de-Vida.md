# 2. Ciclo de Vida

## Personal Software Process (PSP)

El ciclo de vida del PSP define las fases que un desarrollador sigue de forma
disciplinada en cada tarea o programa que construye. PSP evolucionó en niveles
progresivos; cada nivel añade fases al ciclo para incrementar el control de calidad.

### Niveles del ciclo PSP

| Nivel  | Fases incluidas | Incorpora |
|--------|-----------------|-----------|
| PSP0   | Planeación → Codificación → Compilación → Pruebas → Postmortem | Línea base personal, registro de tiempos y defectos |
| PSP0.1 | + Propuesta de mejora de proceso (PIP) | Estándar de código |
| PSP1   | + Estimación de tamaño (PROBE) | Reporte de pruebas |
| PSP1.1 | + Calendarización de tareas | Gráfica valor ganado |
| PSP2   | + Revisión de diseño y de código | Checklists personales |
| PSP2.1 | + Plantillas de diseño | Diagramas de estado, lógica |
| PSP3   | Ciclo iterativo: diseño → prueba de unidad → integración | Desarrollo cíclico a escala personal |

### Fases del ciclo PSP (PSP2 como referencia estándar)

#### 1. Planeación
- **Qué se hace:** estimar tamaño (LOC), tiempo y defectos esperados usando el método PROBE y datos históricos del desarrollador.
- **Artefacto producido:** Plan de Proyecto Individual con líneas base de estimación.

#### 2. Diseño
- **Qué se hace:** definir la estructura lógica del componente antes de codificar, usando plantillas o diagramas de estado.
- **Por qué importa:** los defectos de diseño son los más costosos si se detectan en fases tardías.

#### 3. Revisión de diseño *(desde PSP2)*
- **Qué se hace:** aplicar un checklist personal para verificar el diseño antes de codificar.
- **Impacto:** elimina defectos de lógica antes de que se conviertan en código defectuoso.

#### 4. Codificación
- **Qué se hace:** implementar el diseño siguiendo el estándar de código definido.
- **Registro:** anotar en tiempo real los defectos introducidos y el tiempo invertido.

#### 5. Revisión de código *(desde PSP2)*
- **Qué se hace:** aplicar un checklist para detectar errores de implementación antes de compilar.
- **Dato clave:** PSP reporta que esta fase puede eliminar hasta el 70 % de defectos antes de compilación.

#### 6. Compilación
- **Qué se hace:** compilar y registrar los defectos que detecta el compilador.
- **Objetivo:** que esta fase sea casi "limpia" gracias a las revisiones previas.

#### 7. Pruebas
- **Qué se hace:** ejecutar casos de prueba definidos en la planeación y registrar defectos encontrados.

#### 8. Postmortem
- **Qué se hace:** comparar estimado vs. real (tiempo, tamaño, defectos), calcular Yield y actualizar la base de datos personal.
- **Por qué es crítico:** alimenta las estimaciones de todos los ciclos futuros.

---

## Team Software Process (TSP)

El ciclo de vida del TSP organiza el trabajo del equipo en **fases de lanzamiento
y ciclos de desarrollo iterativos**, que escalan las fases del PSP a nivel colectivo.

### Estructura macro del ciclo TSP

```
Launch → Ciclo 1 → Ciclo 2 → … → Ciclo N → Postmortem de proyecto
```

### Fase 0 – Lanzamiento (Launch)

Es la fase más característica del TSP. El equipo, guiado por un Coach, define
colectivamente su estrategia antes de escribir una sola línea de código.

- **Reuniones de lanzamiento (típicamente 2 días):** el equipo establece objetivos, asigna roles TSP, construye el plan del proyecto y genera compromisos explícitos.
- **Artefactos:** Plan de Lanzamiento, cronograma, registro de riesgos, plan de calidad.
- **Resultado clave:** cada miembro sale con un Plan de Proyecto Individual (PSP) alineado al plan del equipo.

### Ciclos de desarrollo (iteraciones)

Cada ciclo dura entre 1 y 3 semanas y sigue este patrón:

#### 1. Planeación del ciclo
- Revisar tareas del backlog, asignar responsables, actualizar estimaciones.
- Artefacto: Plan de Ciclo.

#### 2. Ejecución con PSP individual
- Cada miembro ejecuta su propio ciclo PSP (diseño → revisión → código → prueba).
- Se actualiza el tablero de equipo diariamente.

#### 3. Integración y prueba del sistema
- Los componentes individuales se integran y se ejecutan los casos de prueba de sistema.
- Inspecciones formales por pares sobre módulos críticos.

#### 4. Revisión del ciclo (Cycle Review)
- El equipo compara plan vs. real: tareas completadas, defectos, desviaciones de esfuerzo.
- Se ajusta el plan para el siguiente ciclo.

### Postmortem de proyecto

Al finalizar todos los ciclos, el equipo realiza un cierre formal:
- Análisis de métricas acumuladas (densidad de defectos, Yield del equipo, productividad).
- Lecciones aprendidas y propuestas de mejora de proceso.
- Documentación para futuros proyectos o equipos.