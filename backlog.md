# 1. Explicación de cómo se generó la plantilla

La presente plantilla de Product Backlog fue concebida con un enfoque de gestión ágil orientado a la trazabilidad, priorización y planificación iterativa de un proyecto de software. Para su construcción, se recomienda el uso de herramientas colaborativas como Notion, Jira o Google Sheets, debido a que permiten estructurar historias de usuario, mantener visibilidad del avance del producto, gestionar prioridades y facilitar la actualización continua del backlog por parte del Product Owner y del equipo de desarrollo.

Desde la perspectiva metodológica, la estructura se diseñó con base en principios de Scrum y prácticas de Agile Product Management. En particular, se consideraron: la redacción de requerimientos en formato de User Story, la priorización con el modelo MoSCoW, la estimación mediante puntos de historia con la serie de Fibonacci y la asignación de trabajo por sprints para asegurar entregas incrementales. Esta lógica permite que el backlog no sea solo una lista de requerimientos, sino una herramienta viva para ordenar el valor de negocio, reducir incertidumbre y guiar la construcción progresiva del producto.

La plantilla fue pensada para cubrir las necesidades mínimas de gestión y seguimiento del backlog: identificación única de cada historia, descripción funcional orientada al usuario, nivel de prioridad, esfuerzo estimado, criterios de aceptación verificables y sprint asignado. Con ello, se facilita la conversación entre negocio y desarrollo, la preparación de sesiones de refinamiento y la planificación de iteraciones enfocadas en un MVP y sus mejoras posteriores.

Prompt o instrucción lógica utilizada para crear esta estructura:

```text
Genera una plantilla de Product Backlog en formato Markdown para un proyecto de desarrollo de software usando enfoque ágil Scrum. La tabla debe incluir las columnas: ID, User Story, Prioridad (MoSCoW), Estimación (Puntos de Historia de Fibonacci), Criterios de Aceptación y Sprint Asignado. La estructura debe servir para priorizar un MVP, organizar el trabajo por iteraciones y documentar historias de usuario con criterios verificables.
```

[Pasos del Equipo]

[Espacio para documentar reuniones, discusiones internas, criterios de aprobación y acuerdos del equipo]

# 2. Generar la plantilla (Vacía)

| ID                         | User Story                 | Prioridad (MoSCoW)         | Estimación (Puntos de Historia de Fibonacci) | Criterios de Aceptación    | Sprint Asignado            |
| -------------------------- | -------------------------- | -------------------------- | -------------------------------------------- | -------------------------- | -------------------------- |
| [Espacio para diligenciar] | [Espacio para diligenciar] | [Espacio para diligenciar] | [Espacio para diligenciar]                   | [Espacio para diligenciar] | [Espacio para diligenciar] |

# 3. Generar un ejemplo

| ID     | User Story                                                                                                                              | Prioridad (MoSCoW) | Estimación (Puntos de Historia de Fibonacci) | Criterios de Aceptación                                                                                                                                                           | Sprint Asignado |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| US-001 | Como estudiante, quiero iniciar sesión con mi correo institucional para acceder de forma segura a la plataforma universitaria.          | Must               | 5                                            | El sistema valida credenciales institucionales; muestra mensaje de error cuando los datos son inválidos; permite acceso al panel principal al autenticarse correctamente.         | Sprint 1        |
| US-002 | Como estudiante, quiero visualizar mi horario de clases para consultar mis asignaturas, aulas y horarios desde un solo lugar.           | Must               | 8                                            | El sistema muestra las materias inscritas; presenta día, hora y aula de cada clase; la información se carga correctamente al ingresar al módulo de horario.                       | Sprint 1        |
| US-003 | Como docente, quiero registrar calificaciones parciales para mantener actualizado el seguimiento académico de mis cursos.               | Must               | 8                                            | El docente puede seleccionar un curso; puede ingresar y guardar notas por estudiante; el sistema confirma el registro exitoso y conserva la información.                          | Sprint 1        |
| US-004 | Como estudiante, quiero recibir notificaciones sobre cambios de horario o publicación de notas para mantenerme informado oportunamente. | Should             | 5                                            | El sistema genera una notificación cuando hay cambios relevantes; las alertas aparecen en el panel del usuario; el estudiante puede identificar el tipo de novedad recibida.      | Sprint 2        |
| US-005 | Como coordinador académico, quiero consultar reportes básicos de rendimiento por curso para identificar grupos con bajo desempeño.      | Should             | 13                                           | El sistema permite seleccionar un curso; muestra resumen de promedios y cantidad de estudiantes evaluados; la información puede consultarse sin alterar los registros existentes. | Sprint 2        |
| US-006 | Como estudiante, quiero actualizar mis datos de contacto para mantener mi información personal al día dentro del sistema.               | Could              | 3                                            | El estudiante puede editar teléfono y dirección de correo alterno; el sistema valida los campos obligatorios; los cambios se guardan y se reflejan al recargar el perfil.         | Sprint 2        |
