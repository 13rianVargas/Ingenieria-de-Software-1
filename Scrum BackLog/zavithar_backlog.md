# 1. Explicación de la generación de la plantilla

## Herramienta utilizada

Esta plantilla fue generada utilizando **GitHub Copilot** integrado en **Visual Studio Code (VS Code)**, empleando el modelo de lenguaje **Claude** a través del chat de Copilot.

## Prompts empleados

### Prompt inicial (estructura base):

> *"Actúa como un Senior Product Owner y Agile Coach. Necesito que generes un documento técnico estructurado exactamente en tres secciones para presentar la gestión del Product Backlog de un proyecto de software. [...] Crea una tabla en formato Markdown que represente la plantilla del Product Backlog vacía. Las columnas obligatorias deben ser: ID, User Story, Prioridad (MoSCoW), Estimación (Puntos de Historia de Fibonacci), Criterios de Aceptación, y una columna fundamental llamada 'Sprint Asignado'."*

### Prompt de refinamiento (campos adicionales):

> *"Teniendo en cuenta algunas revisiones que he hecho de ejemplos públicos de product backlogs, me gustaría que siguiendo los parámetros y condiciones establecidas en el prompt inicial, evalúes si sería adecuado incluir en el modelo los campos de **propietario de tarea** y **estado**. De igual manera, desde tu posición como Senior Product Owner, qué otra modificación consideras pertinente para que la plantilla se ajuste lo máximo posible a un contexto empresarial realista."*

### Prompt de implementación:

> *"Ejecuta las modificaciones que planteas para la plantilla en el archivo zavithar_backlog.md, de igual manera, deberás generar un ejemplo realista de la aplicación de esta plantilla de product backlog para un proyecto de software, toma como guía un proyecto de una aplicación móvil enfocada a la vida universitaria."*

## Campos añadidos tras evaluación

Basándose en buenas prácticas de gestión ágil empresarial, se incorporaron:

| Campo | Justificación |
| --- | --- |
| **Epic** | Agrupa historias bajo iniciativas mayores para mejor trazabilidad |
| **Valor de Negocio** | Cuantifica impacto (1-10) para decisiones de priorización ROI |
| **Dependencias** | Identifica bloqueos entre historias para planificación de sprints |
| **Responsable** | Coordina implementación sin eliminar responsabilidad colectiva del equipo |
| **Estado** | Visibilidad del progreso: To Do / In Progress / In Review / Done / Blocked |

---

# 2. Generar la plantilla (Vacía)

| ID | Epic | User Story | Prioridad (MoSCoW) | Valor de Negocio | Estimación (Fibonacci) | Criterios de Aceptación | Dependencias | Responsable | Estado | Sprint Asignado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [Espacio para diligenciar] | [Espacio para diligenciar] | [Espacio para diligenciar] | [Espacio para diligenciar] | [Espacio para diligenciar] | [Espacio para diligenciar] | [Espacio para diligenciar] | [Espacio para diligenciar] | [Espacio para diligenciar] | [Espacio para diligenciar] | [Espacio para diligenciar] |

### Descripción de campos:

| Campo | Descripción |
| --- | --- |
| **ID** | Identificador único de la historia (formato: US-XXX) |
| **Epic** | Agrupación funcional a la que pertenece la historia |
| **User Story** | Descripción en formato: "Como [rol], quiero [acción] para [beneficio]" |
| **Prioridad (MoSCoW)** | Must (obligatorio) / Should (importante) / Could (deseable) / Won't (descartado) |
| **Valor de Negocio** | Impacto para el usuario/negocio (escala 1-10) |
| **Estimación (Fibonacci)** | Complejidad técnica: 1, 2, 3, 5, 8, 13, 21 |
| **Criterios de Aceptación** | Condiciones verificables para considerar la historia terminada |
| **Dependencias** | IDs de historias que deben completarse previamente |
| **Responsable** | Miembro del equipo que coordina la implementación |
| **Estado** | To Do / In Progress / In Review / Done / Blocked |
| **Sprint Asignado** | Iteración en la que se desarrollará |

# 3. Generar un ejemplo

## Proyecto: UniLife App - Aplicación Móvil para la Vida Universitaria

**Descripción del producto:** Aplicación móvil multiplataforma (iOS/Android) diseñada para centralizar la experiencia universitaria, permitiendo a estudiantes gestionar su vida académica, conectar con la comunidad y acceder a servicios institucionales desde un solo lugar.

**Equipo Scrum:**
- Product Owner: María González
- Scrum Master: Carlos Rodríguez  
- Developers: Ana Torres (Backend), Luis Pérez (Frontend Mobile), Sandra Muñoz (QA), Diego Vargas (UX/UI)

---

### Product Backlog

| ID | Epic | User Story | Prioridad (MoSCoW) | Valor de Negocio | Estimación (Fibonacci) | Criterios de Aceptación | Dependencias | Responsable | Estado | Sprint Asignado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| US-001 | Autenticación | Como estudiante, quiero iniciar sesión con mi correo institucional (@universidad.edu) para acceder de forma segura a la aplicación. | Must | 10 | 5 | 1. El sistema valida formato de correo institucional. 2. Integración con OAuth2 de la universidad. 3. Muestra error específico si credenciales son inválidas. 4. Redirige al home tras login exitoso. | - | Ana Torres | Done | Sprint 1 |
| US-002 | Autenticación | Como estudiante, quiero recuperar mi contraseña mediante correo electrónico para restaurar el acceso a mi cuenta. | Must | 8 | 3 | 1. Envía enlace de recuperación al correo institucional. 2. El enlace expira en 24 horas. 3. Permite establecer nueva contraseña cumpliendo políticas de seguridad. | US-001 | Ana Torres | Done | Sprint 1 |
| US-003 | Gestión Académica | Como estudiante, quiero visualizar mi horario semanal de clases para organizar mis actividades diarias. | Must | 9 | 8 | 1. Muestra materias inscritas con día, hora y aula. 2. Vista semanal y diaria disponibles. 3. Sincroniza con calendario del dispositivo. 4. Funciona offline con datos cacheados. | US-001 | Luis Pérez | Done | Sprint 1 |
| US-004 | Gestión Académica | Como estudiante, quiero consultar mis calificaciones parciales y finales para hacer seguimiento a mi rendimiento académico. | Must | 9 | 5 | 1. Muestra notas por materia y periodo. 2. Calcula promedio ponderado automáticamente. 3. Indica estado (aprobado/reprobado/en curso). 4. Notifica cuando se publica nueva nota. | US-001 | Luis Pérez | In Progress | Sprint 1 |
| US-005 | Notificaciones | Como estudiante, quiero recibir notificaciones push sobre cambios de horario, publicación de notas y eventos importantes para mantenerme informado. | Must | 8 | 8 | 1. Notificaciones categorizadas (académico, eventos, administrativo). 2. Usuario puede configurar qué categorías recibir. 3. Centro de notificaciones con historial. 4. Badge de notificaciones no leídas. | US-001, US-003, US-004 | Ana Torres | To Do | Sprint 2 |
| US-006 | Campus Virtual | Como estudiante, quiero ver el mapa interactivo del campus para ubicar aulas, bibliotecas y servicios. | Should | 7 | 13 | 1. Mapa con zoom y navegación táctil. 2. Búsqueda por nombre de edificio/aula. 3. Muestra ruta desde ubicación actual. 4. Indica servicios disponibles por edificio. | US-001 | Diego Vargas | To Do | Sprint 2 |
| US-007 | Comunidad | Como estudiante, quiero unirme a grupos de estudio de mis materias para colaborar con compañeros. | Should | 7 | 8 | 1. Lista grupos disponibles por materia. 2. Permite solicitar unirse o crear grupo nuevo. 3. Chat grupal integrado. 4. Máximo 10 participantes por grupo. | US-001 | Luis Pérez | To Do | Sprint 2 |
| US-008 | Servicios | Como estudiante, quiero consultar el menú de la cafetería universitaria para planificar mis comidas. | Should | 6 | 3 | 1. Muestra menú del día con precios. 2. Indica horarios de atención. 3. Señala opciones vegetarianas/alérgenos. 4. Permite valorar platos. | US-001 | Diego Vargas | To Do | Sprint 2 |
| US-009 | Gestión Académica | Como docente, quiero registrar y publicar calificaciones desde mi móvil para agilizar el proceso de evaluación. | Should | 8 | 8 | 1. Lista de estudiantes por curso. 2. Ingreso de notas con validación de rango. 3. Opción de guardar borrador o publicar. 4. Confirmación antes de publicar definitivamente. | US-001, US-004 | Ana Torres | To Do | Sprint 3 |
| US-010 | Perfil | Como estudiante, quiero editar mi foto de perfil y datos de contacto para personalizar mi cuenta. | Could | 5 | 3 | 1. Permite subir foto desde galería o cámara. 2. Redimensiona automáticamente a 500x500px. 3. Edición de teléfono y correo alternativo. 4. Validación de formatos. | US-001 | Luis Pérez | To Do | Sprint 3 |
| US-011 | Servicios | Como estudiante, quiero reservar espacios de estudio en biblioteca para asegurar disponibilidad. | Could | 6 | 8 | 1. Vista de disponibilidad por hora. 2. Reserva con máximo 3 horas consecutivas. 3. Confirmación y recordatorio por notificación. 4. Cancelación hasta 1 hora antes. | US-001, US-005 | Diego Vargas | To Do | Sprint 3 |
| US-012 | Comunidad | Como estudiante, quiero publicar y ver anuncios de compra/venta de libros usados para facilitar intercambios. | Could | 5 | 5 | 1. Publicación con foto, título, precio y descripción. 2. Filtro por carrera/materia. 3. Chat directo con vendedor. 4. Marcar como vendido. | US-001, US-007 | Luis Pérez | To Do | Sprint 4 |
| US-013 | Gestión Académica | Como estudiante, quiero simular mi promedio académico modificando notas hipotéticas para planificar mi rendimiento. | Won't | 4 | 5 | 1. Permite modificar notas pendientes. 2. Calcula promedio proyectado. 3. Indica créditos necesarios para graduación. | US-004 | - | Backlog | - |

---

### Resumen por Sprint

| Sprint | Historias | Puntos Totales | Epic Principal |
| --- | --- | --- | --- |
| Sprint 1 (MVP) | US-001, US-002, US-003, US-004 | 21 | Autenticación + Gestión Académica básica |
| Sprint 2 | US-005, US-006, US-007, US-008 | 32 | Notificaciones + Campus + Comunidad |
| Sprint 3 | US-009, US-010, US-011 | 19 | Funcionalidades docente + Servicios |
| Sprint 4 | US-012 | 5 | Marketplace estudiantil |
| Backlog | US-013 | 5 | Descartado para release inicial |
