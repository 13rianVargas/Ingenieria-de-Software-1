# Proceso de Generación del Product Backlog con IA (Prompt Engineering)

## Contexto y Metodología
Para llegar a la plantilla final de nuestro Product Backlog, aplicamos un enfoque iterativo de Ingeniería de Prompts. En lugar de pedir una tabla genérica, fuimos refinando el contexto y las restricciones paso a paso para asegurar que el modelo de IA generara un resultado apegado a la metodología ágil y a los requerimientos del entregable.

A continuación, se detallan los pasos y la evolución de los prompts utilizados:

### Paso 1: Definición de la estructura base
El primer paso consistió en establecer el rol de la IA y solicitar las columnas fundamentales de un backlog profesional, introduciendo estándares de la industria como la priorización MoSCoW y la estimación por puntos de historia (Fibonacci).

**Prompt Inicial:**
> "Actúa como un Senior Product Owner. Genera una estructura de Product Backlog en formato de tabla para un proyecto de desarrollo de software ágil. La plantilla debe incluir columnas para identificación, priorización (usando el método MoSCoW), estimación en puntos de historia y criterios de aceptación. Devuelve la estructura en una tabla clara."

### Paso 2: Integración del Sprint Planning
El requerimiento evolucionó para visualizar la distribución del trabajo en Sprints. Aunque en Scrum purista el Product Backlog no se divide por Sprints (eso pertenece al Sprint Backlog), adaptamos la estructura para incluir una columna de asignación y simular una ceremonia de planificación.

**Prompt Intermedio (Ajuste de Sprints):**
> "Actúa como un Senior Product Owner experto en metodologías ágiles (Scrum). Tu tarea es ayudarme a estructurar y planificar un proyecto de software. 
> 
> **Paso 1: Plantilla.** Genera una estructura de Product Backlog en formato de tabla. Debe incluir las siguientes columnas: ID, User Story, Prioridad (método MoSCoW), Estimación de Esfuerzo (Puntos de historia usando la serie de Fibonacci), Criterios de Aceptación y una columna de 'Sprint Asignado'.
> 
> **Paso 2: Generación de Datos.** Crea un ejemplo práctico de 8 historias de usuario realistas para un proyecto de software (ej. una aplicación de gestión). 
> 
> **Paso 3: Sprint Planning (Separación).** Toma esas 8 historias del Product Backlog y simula una planificación. Separa visualmente en una nueva sección qué historias entrarían en el 'Sprint 1' (enfocado en el Producto Mínimo Viable) y cuáles quedarían para el 'Sprint 2'."

### Paso 3: Consolidación Estructural (El Mega-Prompt Final)
Para cumplir con la estructura exacta del entregable, consolidamos las instrucciones en un único "Mega-Prompt". Se le ordenó a la IA generar el documento en tres secciones estrictas, incluyendo la teoría, la plantilla vacía, el ejemplo diligenciado con los Sprints inmersos y espacios delimitados (`[ ]`) para documentar el trabajo manual del equipo.

**Prompt Final Definitivo:**
> "Actúa como un Senior Product Owner y Agile Coach. Necesito que generes un documento técnico estructurado exactamente en tres secciones para presentar la gestión del Product Backlog de un proyecto de software. 
> 
> Sigue estrictamente este orden y formato:
> 
> **1. Explicación de cómo se generó la plantilla:**
> Redacta un texto profesional explicando las herramientas sugeridas (ej. Notion, Jira o Google Sheets) y la metodología ágil utilizada para concebir la estructura del backlog. 
> - Incluye textualmente el prompt o la instrucción lógica que se usaría para crear esta estructura. 
> - Deja un espacio claramente marcado (usando corchetes `[ ]`) titulado 'Pasos del Equipo' para que nosotros podamos rellenar manualmente las discusiones o pasos internos que tomamos para aprobarla.
> 
> **2. Generar la plantilla (Vacía):**
> Crea una tabla en formato Markdown que represente la plantilla del Product Backlog vacía. Las columnas obligatorias deben ser: ID, User Story, Prioridad (MoSCoW), Estimación (Puntos de Historia de Fibonacci), Criterios de Aceptación, y una columna fundamental llamada 'Sprint Asignado' (para reflejar en qué iteración se trabajará). No llenes esta tabla con datos, solo pon `[Espacio para diligenciar]` en la primera fila para mostrar cómo se vería.
> 
> **3. Generar un ejemplo:**
> Recrea la misma tabla del punto 2, pero esta vez completamente diligenciada con un ejemplo realista de un proyecto de desarrollo de software (por ejemplo, una aplicación de gestión universitaria). Llena al menos 5 filas de historias de usuario, distribuyéndolas lógicamente entre el 'Sprint 1' (MVP) y el 'Sprint 2' en la columna correspondiente.
> 
> Nota: Escribe toda la respuesta estructurada en formato Markdown puro, usando las etiquetas adecuadas para títulos y tablas, para que se renderice directamente en el archivo."