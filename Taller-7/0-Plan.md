# Taller-7 — Plan de Acción

> Documento de planeación previo a la elaboración del Plan de Pruebas y Casos
> de Prueba del Taller-7. Consolida insumos, decisiones tomadas, definiciones
> pendientes, contrato de estructura QA en GitHub Issues y riesgos.

## 1. Objetivo de la entrega

Producir, en formato `.docx`, dos artefactos asociados al caso de estudio
**E-Commerce Comercial Konrad**:

1. Plan de Pruebas de Software.
2. Casos de Prueba derivados de **dos Historias de Usuario** ya existentes en
   talleres previos.

La entrega debe quedar lo suficientemente formal para corresponder al nivel
estético alcanzado en el Taller-6 (documento con portada, tabla de contenido,
estilos consistentes, paginación), pero en un formato Office y no en PDF.

## 2. Lectura del enunciado (`0-Task.md`)

Puntos verificados directamente del enunciado del taller:

- Alcance de pruebas: **una sola HU o caso de uso** (mínimo).
- Cantidad de HU a usar para casos de prueba: **2**, tomadas de algún taller
  previo.
- Plantillas: el enunciado autoriza usar las del aula virtual u **otro
  formato**. La plantilla provista (`PMOInformatica - Plantilla de Plan de
Pruebas de Software.doc`) es referencia, no obligación literal.
- Documentación de casos de prueba: el enunciado sugiere Excel o, mejor, una
  herramienta de gestión (Mantis, Jira u otra).

Implicación: el alcance del Plan de Pruebas debe ser coherente con esa
mínima cobertura (1 HU/CU) pero los **casos de prueba** se generan sobre 2
HU. Hay que decidir si el Plan de Pruebas se redacta acotado a una sola HU
o si abarca las 2 que se usarán para los casos de prueba.

## 3. Análisis de la plantilla PMOInformatica

Estructura completa de la plantilla, agrupada por bloque temático. Esta es
la base mínima del contenido a producir; cada sección puede conservarse,
fusionarse, suprimirse o reordenarse según el alcance académico real.

### 3.1 Bloque administrativo

- Historial de Versiones.
- Información del Proyecto (empresa, cliente, patrocinador, líderes).
- Aprobaciones (firmas / responsables).

### 3.2 Resumen y alcance

- Resumen Ejecutivo.
- Alcance de las Pruebas.
  - Elementos de Pruebas.
  - Nuevas Funcionalidades a Probar.
  - Pruebas de Regresión.
  - Funcionalidades a No Probar.

### 3.3 Estrategia y criterios

- Enfoque de Pruebas (Estrategia).
- Criterios de Aceptación o Rechazo.
- Criterios de Suspensión.
- Criterios de Reanudación.

### 3.4 Entregables y recursos

- Entregables.
- Requerimientos de Entornos – Hardware.
- Requerimientos de Entornos – Software.
- Herramientas de Pruebas Requeridas.
- Personal.
- Entrenamiento.

### 3.5 Planificación

- Procedimientos para las Pruebas.
- Matriz de Responsabilidades (RACI).
- Cronograma.
- Premisas.
- Dependencias y Riesgos.

### 3.6 Anexos

- Referencias.
- Glosario.

> Observación crítica: la plantilla original es estéticamente pobre
> (tabla de contenido con campos `PAGEREF`, secciones con párrafos de
> instrucciones inline, tablas vacías). Cualquier reproducción debe limpiar
> esos artefactos y aplicar estilos propios.

## 4. Insumos disponibles en el repositorio

Recursos ya producidos que alimentan el Plan y los Casos de Prueba.
Permiten reaprovechar trazabilidad sin reinventar contenido.

| Insumo                          | Ubicación                                                                         | Uso esperado                                     |
| ------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------ |
| Enunciado funcional del cliente | [Contexto-Talleres.md](../Contexto-Talleres.md)                                   | Resumen ejecutivo, alcance funcional             |
| HU base con actividades         | [Taller-3/6-HU-Base.md](../Taller-3/6-HU-Base.md)                                 | Selección de las 2 HU                            |
| Backlog priorizado              | [Scrum-Backlog/Product-Backlog.md](../Scrum-Backlog/Product-Backlog.md)           | Verificar IDs y criterios de aceptación          |
| Especificación funcional CU     | [Taller-4/](../Taller-4/)                                                         | Insumo para escenarios y precondiciones          |
| RNF y criterios                 | [Taller-5/1-RNF.md](../Taller-5/1-RNF.md)                                         | Pruebas no funcionales / criterios de aceptación |
| Arquitectura multivista         | [Taller-6/Arquitectura/arquitectura.md](../Taller-6/Arquitectura/arquitectura.md) | Entornos, dependencias, riesgos                  |
| Casos de uso del Proyecto Final | [Proyecto-Final/docs/casos-de-uso/](../Proyecto-Final/docs/casos-de-uso/)         | Alternativa o complemento a HU                   |

## 5. Decisiones tomadas y pendientes

### 5.1 Decisiones tomadas

| Tema                            | Resultado                                                     |
| ------------------------------- | ------------------------------------------------------------- |
| Formato de salida               | `.docx` (no `.doc` legacy)                                    |
| Pipeline de generación          | `python-docx` programático                                    |
| Herramienta de gestión de casos | GitHub Issues con estructura QA explícita (sección 6)         |
| Estructura del documento        | Cubierta por sección 3 (plantilla PMO adaptada, no copia 1:1) |
| Estilos visuales                | Paleta charcoal/slate del Taller-6                            |
| Idioma y convenciones           | Español, sin emojis, conforme `AGENTS.md` raíz                |

**Por qué `python-docx` y no pandoc**:

- **Estética y precisión**: `python-docx` da control total sobre cada
  elemento (portada custom, tablas con bordes y colores específicos,
  encabezados/pies de página, paginación, estilos por párrafo). Pandoc
  depende de un `reference.docx` y solo expone los estilos predefinidos
  de Word; cualquier control fino requiere editar OOXML crudo.
- **Coherencia con la paleta charcoal del Taller-6**: implementable como
  constantes en Python (`COLOR_PRIMARY = "2B2D42"`) y aplicable de forma
  consistente. En pandoc requeriría un `reference.docx` afinado a mano
  en Word, sin trazabilidad en git.
- **Tablas complejas** (RACI, cronograma, matriz de casos): `python-docx`
  las maneja celda por celda. Pandoc tiende a romper tablas con celdas
  combinadas o anchos personalizados al pasar Markdown → DOCX.
- **Trade-off aceptado**: más código que pandoc; el contenido vive más
  estructurado (no en un Markdown narrativo plano). Mitigación: separar
  contenido (`contenido/*.md` o `contenido.yaml`) del renderizado
  (`generar-docx.py`).

### 5.2 Definiciones — cerradas

Todas las pendientes quedan resueltas.

| Tema | Resultado |
|---|---|
| Selección de HU | HU-1 Registro de Vendedor + HU-2 Publicar Productos |
| Profundidad del Plan de Pruebas | Cubre las 2 HU (coherencia con casos de prueba) |
| Tipos de prueba | Solo funcionales (obligatorias) |

## 6. GitHub Issues — Estructura QA precisa

Un issue de GitHub por defecto es un contenedor genérico (título + cuerpo
libre + comentarios). Eso no es un caso de prueba. Esta sección define el
contrato concreto para que cada issue de QA tenga la misma forma, los
mismos campos obligatorios y la misma trazabilidad. Es la especificación
que se implementará en la fase 3.

### 6.1 Por qué no basta un issue genérico

Sin estructura forzada el redactor puede omitir precondiciones, datos de
prueba, ambiente o resultado esperado. El resultado son casos no
ejecutables y trazabilidad rota con la HU. La solución se apoya en cuatro
mecanismos nativos de GitHub:

- **Forzar campos** vía Issue Forms (`.github/ISSUE_TEMPLATE/*.yml`).
- **Tipar y filtrar** vía labels obligatorios.
- **Agrupar Test Runs** vía milestones.
- **Visualizar estado** vía Project v2 (board kanban).

### 6.2 Plantilla `test-case.yml` — Caso de Prueba

Ubicación: `.github/ISSUE_TEMPLATE/test-case.yml` (raíz del repositorio).

Campos requeridos, en orden de aparición en el formulario:

| Campo                       | Tipo input | Obligatorio | Contenido esperado                                                                                     |
| --------------------------- | ---------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| ID del caso                 | input      | sí          | Formato `TC-NN` (ej. `TC-01`, `TC-02`)                                                                 |
| HU origen                   | input      | sí          | ID del backlog (ej. `HU-005`)                                                                          |
| Caso de uso                 | input      | no          | ID del CU del Taller-4 / Proyecto Final si aplica                                                      |
| Tipo de prueba              | dropdown   | sí          | `functional`, `regression`, `nfr-performance`, `nfr-security`, `nfr-usability`, `smoke`, `exploratory` |
| Prioridad                   | dropdown   | sí          | `alta`, `media`, `baja`                                                                                |
| Severidad esperada si falla | dropdown   | sí          | `critical`, `major`, `minor`, `trivial`                                                                |
| Precondiciones              | textarea   | sí          | Estado del sistema antes de ejecutar (usuario logueado, fixtures cargados, etc.)                       |
| Datos de prueba             | textarea   | sí          | Valores de entrada exactos (no genéricos): usuarios, inputs, payloads                                  |
| Pasos                       | textarea   | sí          | Numerados `1.`, `2.`, `3.`. Una sola acción por paso                                                   |
| Resultado esperado          | textarea   | sí          | Comportamiento observable concreto, verificable, sin "el sistema funciona bien"                        |
| Resultado obtenido          | textarea   | no          | Llenar al ejecutar                                                                                     |
| Estado de ejecución         | dropdown   | sí          | `pending`, `in-progress`, `passed`, `failed`, `blocked`, `skipped`                                     |
| Ambiente                    | dropdown   | sí          | `dev`, `qa`, `staging`, `prod`                                                                         |
| Navegador / dispositivo     | input      | no          | Solo si UI o multiplataforma (`Chrome 120 / Android 14`)                                               |
| Tester asignado             | input      | no          | Reforzar con `assignees` del issue                                                                     |
| Evidencias                  | textarea   | no          | Capturas y logs adjuntos por drag-and-drop                                                             |

Título obligatorio del issue: `[TC-NN] HU-XXX — descripción corta`.

### 6.3 Plantilla `bug-report.yml` — Defecto

Ubicación: `.github/ISSUE_TEMPLATE/bug-report.yml`.

| Campo                   | Tipo input | Obligatorio | Contenido esperado                      |
| ----------------------- | ---------- | ----------- | --------------------------------------- |
| ID del defecto          | input      | sí          | `BUG-NN`                                |
| Caso de prueba origen   | input      | sí          | `TC-NN` que detectó el defecto          |
| HU afectada             | input      | sí          | `HU-XXX`                                |
| Severidad               | dropdown   | sí          | `critical`, `major`, `minor`, `trivial` |
| Prioridad de corrección | dropdown   | sí          | `alta`, `media`, `baja`                 |
| Reproducibilidad        | dropdown   | sí          | `siempre`, `intermitente`, `una vez`    |
| Pasos para reproducir   | textarea   | sí          | Numerados, mínimos para reproducir      |
| Resultado esperado      | textarea   | sí          | Igual al del TC origen                  |
| Resultado obtenido      | textarea   | sí          | Diferencia concreta observada           |
| Ambiente                | dropdown   | sí          | `dev`, `qa`, `staging`, `prod`          |
| Logs / stack trace      | textarea   | no          | Bloque de código con traza              |
| Workaround              | textarea   | no          | Solución temporal si existe             |
| Evidencia               | textarea   | no          | Capturas, video corto, payload          |

Título obligatorio: `[BUG-NN] TC-XX — descripción del defecto`.

### 6.4 Labels — taxonomía obligatoria

Crear todos antes de abrir el primer issue. Ningún issue de QA puede
existir sin la combinación mínima.

| Categoría       | Labels                                                                                                       | Color sugerido                          |
| --------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| Tipo de issue   | `test-case`, `bug`                                                                                           | azul, rojo                              |
| Prioridad       | `priority:alta`, `priority:media`, `priority:baja`                                                           | rojo, amarillo, verde                   |
| Severidad       | `severity:critical`, `severity:major`, `severity:minor`, `severity:trivial`                                  | gris en escala                          |
| Estado          | `status:pending`, `status:in-progress`, `status:passed`, `status:failed`, `status:blocked`, `status:skipped` | naranja, azul, verde, rojo, negro, gris |
| Tipo de prueba  | `test:functional`, `test:regression`, `test:nfr`, `test:smoke`, `test:exploratory`                           | morado                                  |
| Trazabilidad HU | `HU-001`, `HU-002`, … (uno por HU)                                                                           | celeste                                 |
| Ambiente        | `env:dev`, `env:qa`, `env:staging`, `env:prod`                                                               | amarillo                                |

Combinación **mínima** en un test case:
`test-case` + `HU-XXX` + `priority:*` + `severity:*` + `status:*` +
`test:*` + `env:*`. Total: 7 labels.

### 6.5 Milestones

Uso obligatorio para agrupar ejecuciones (Test Runs):

- `Taller-7 — Entrega académica`: milestone marco para esta entrega.
- `Test Run — Sprint X`: ejecución asociada a un sprint o iteración.
- `Regresión — Release Y.Z`: pruebas de regresión por versión.

Cada test case se asigna a un milestone. Cada bug se asigna al mismo
milestone que su TC origen.

### 6.6 Project board (Projects v2)

Un único Project tipo board con columnas en este orden:

```
Backlog → Por ejecutar → En ejecución → Pass | Fail | Blocked → Cerrado
```

Reglas de operación:

- Movimientos manuales en esta primera versión (sin automatizaciones).
- Un issue siempre vive en exactamente una columna.
- Issues `passed` y cerrados → `Cerrado`.
- Issues `failed` permanecen en `Fail` hasta que el bug asociado se
  cierre y la reejecución pase.

### 6.7 Convenciones de nombres

| Elemento                    | Patrón                                 | Ejemplo                                                  |
| --------------------------- | -------------------------------------- | -------------------------------------------------------- |
| Test case (título issue)    | `[TC-NN] HU-XXX — descripción corta`   | `[TC-03] HU-005 — registro vendedor con email duplicado` |
| Bug (título issue)          | `[BUG-NN] TC-XX — descripción defecto` | `[BUG-01] TC-03 — sistema permite email duplicado`       |
| Branch (si se automatiza)   | `test/TC-NN-descripcion`               | `test/TC-03-email-duplicado`                             |
| Commit que ejecuta o cierra | `test(TC-NN): resultado`               | `test(TC-03): passed`                                    |

### 6.8 Workflow de ejecución

1. **Crear**: nuevo issue con plantilla `test-case.yml`. Estado inicial
   `pending`. Asignar HU label, milestone, prioridad y tipo de prueba.
2. **Asignar**: añadir `assignees`. Mover a columna `Por ejecutar`.
3. **Ejecutar**: cambiar label a `status:in-progress`. Mover a `En
ejecución`.
4. **Documentar resultado**: comentario en el issue con resultado
   obtenido y evidencia (capturas, logs).
5. **Pass**: cambiar label a `status:passed`. Cerrar issue. Mueve a `Pass`
   y luego `Cerrado`.
6. **Fail**: cambiar label a `status:failed`. **No cerrar el TC**. Crear
   issue `bug-report.yml` enlazado. Mover TC a `Fail`. El bug se cierra
   con `Closes #NN-del-TC` solo si la corrección hace pasar el TC.
7. **Blocked**: label `status:blocked`. Comentario explicando bloqueo.
   Mantener issue abierto.
8. **Reejecución**: tras corrección de un bug, comentario con nueva
   ejecución, cambio de estado en el TC original. **No abrir issue
   duplicado**.

### 6.9 Política de evidencias

- **Capturas**: arrastrar al cuerpo del issue o al comentario; GitHub
  las hostea automáticamente.
- **Logs**: bloque ` ``` ` con stack trace completo.
- **Videos cortos**: `.mp4` adjuntos hasta 10 MB. Si exceden, enlace a
  almacenamiento del equipo.
- **Datos sensibles**: nunca pegar credenciales, tokens ni datos
  personales reales. Sustituir por placeholders (`<token>`, `user@test`).

### 6.10 Relación con el `.docx` entregable

El `.docx` referencia los issues por URL e ID (`TC-01`, `TC-02`, …) y
funciona como **resumen formal** de la entrega. La fuente viva y
actualizable son los issues. Esto evita mantener dos representaciones a
mano: el `.docx` se regenera, los issues se actualizan in situ.

## 7. Estructura propuesta de carpeta `Taller-7/`

Borrador alineado con `python-docx`. Refinable según el contenido final.

```
Taller-7/
  0-Task.md                        (existente — enunciado)
  0-Plan.md                        (este documento)
  PlanDePruebas/
    contenido/                     fuentes estructuradas del documento
      00-portada.yaml              metadata (título, autores, fecha)
      01-resumen-ejecutivo.md
      02-alcance.md
      03-estrategia.md
      04-criterios.md
      05-recursos.md
      06-planificacion.md
      07-riesgos.md
      08-anexos.md
      tablas/
        raci.csv                   matriz RACI
        cronograma.csv             hitos y dependencias
    casos-de-prueba/
      indice.md                    índice con enlaces a issues GitHub
    images/                        diagramas y capturas
    estilos.py                     paleta charcoal + helpers de estilo
    generar-docx.py                pipeline python-docx
    instrucciones-build.md         comandos reproducibles
    plan-de-pruebas.docx           salida generada
```

En la **raíz del repositorio** (fuera de `Taller-7/`):

```
.github/
  ISSUE_TEMPLATE/
    test-case.yml                  plantilla caso de prueba (sección 6.2)
    bug-report.yml                 plantilla defecto (sección 6.3)
```

## 8. Fases de trabajo (alto nivel)

Secuencia tentativa, sin compromisos de fechas.

1. **Cierre de definiciones** (sección 5).
2. **Selección de HU** y verificación de criterios de aceptación.
3. **Configuración de GitHub Issues**: crear labels, milestones, plantillas
   `test-case.yml` y `bug-report.yml`, y Project board.
4. **Construcción del esqueleto** del Plan de Pruebas en Markdown.
5. **Redacción de secciones** con trazabilidad a insumos del repositorio.
6. **Diseño de Casos de Prueba** para las 2 HU seleccionadas y carga como
   issues en GitHub usando la plantilla.
7. **Definición del pipeline** de generación a `.docx` y plantilla de
   estilos.
8. **Generación inicial** del `.docx` y revisión visual.
9. **Iteración estética** sobre la plantilla (portada, tablas, encabezados,
   paginación).
10. **Documentación del comando de build** (análoga a
    `instrucciones-creacion-pdf.md` del Taller-6).
11. **Revisión cruzada** contra `AGENTS.md` (checklist de calidad) y
    contra el enunciado.

## 9. Riesgos y dependencias del propio plan

- **Curva de `python-docx` para portada custom**: el Taller-6 hizo la
  portada con HTML + CSS; aquí toca construirla con párrafos, runs y
  estilos programáticos. Más código, más iteración visual.
- **Tabla de contenido en DOCX**: `python-docx` no genera el TOC
  dinámico; requiere insertar un campo OOXML (`<w:fldSimple>`) y Word
  lo regenera al abrir el archivo. Validar en Word y LibreOffice.
- **Tablas complejas** (RACI, cronograma): manejables celda por celda
  con `python-docx`, pero requieren código repetitivo. Conviene
  encapsular en helpers dentro de `estilos.py`.
- **Versionado del `.docx`** (binario zip): los diff no son legibles;
  versionar la **fuente** (`contenido/`, `generar-docx.py`,
  `estilos.py`) y considerar el `.docx` como artefacto generado.
- **Cambio retroactivo de HU**: si se modifican HU del Taller-3 después
  de redactar casos de prueba, se rompe trazabilidad. Congelar las 2 HU
  elegidas antes de empezar.
- **GitHub Issues sin reportes QA nativos**: cobertura y % pass se
  derivan manualmente con filtros (`label:test-case label:status:passed`)
  o GitHub CLI. Riesgo bajo dado el alcance académico (solo 2 HU).
- **Visibilidad del repositorio**: si el repo es privado, los issues no
  son consultables por el docente sin acceso. Verificar antes de la
  entrega.
- **Issue templates afectan a todo el repo**: cualquier issue futuro
  verá las plantillas de QA. Aceptable porque el repo es académico,
  pero a tener presente.

## 10. Trazabilidad obligatoria

Cualquier sección del Plan de Pruebas debe poder cruzarse contra:

- HU del backlog y del Taller-3.
- Casos de uso del Taller-4 / `Proyecto-Final/docs/casos-de-uso/`.
- RNF del Taller-5.
- Vistas de arquitectura del Taller-6 (entornos, dependencias).

Cualquier caso de prueba debe enlazar al ID exacto de la HU/CU de origen y
al número de issue de GitHub correspondiente (`#NN`).

## 11. Salida esperada de este plan

Aprobado este documento, los siguientes pasos son:

1. Cerrar las tres pendientes de §5.2 (selección HU, profundidad,
   tipos de prueba).
2. Avanzar a fase 3 (configuración de GitHub Issues con la estructura
   QA de §6).
3. Avanzar a fase 4 (esqueleto del Plan de Pruebas en `contenido/`).
