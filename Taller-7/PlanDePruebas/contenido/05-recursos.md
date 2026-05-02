# Recursos

## Entregables del Plan de Pruebas

| Entregable                        | Descripción                                                          | Ubicación                                             |
|-----------------------------------|----------------------------------------------------------------------|-------------------------------------------------------|
| Plan de Pruebas                   | Documento formal entregable del taller                               | [Repositorio del proyecto](https://github.com/13rianVargas/Ingenieria-de-Software-1/blob/main/Taller-7/PlanDePruebas/) |
| Casos de Prueba (GitHub Issues)   | Issues estructurados con plantilla de caso de prueba; fuente viva   | [Issues del repositorio](https://github.com/13rianVargas/Ingenieria-de-Software-1/issues?q=label%3Atest-case) |
| Índice de Casos de Prueba         | Tabla resumen con ID, HU, estado y enlace al issue correspondiente  | [Issues del repositorio](https://github.com/13rianVargas/Ingenieria-de-Software-1/blob/main/Taller-7/PlanDePruebas/casos-de-prueba/indice.md) |
| Reportes de Defecto (Issues)      | Issues estructurados con plantilla de reporte de defecto             | [Issues del repositorio](https://github.com/13rianVargas/Ingenieria-de-Software-1/issues?q=label%3Abug) |
| Evidencias de Ejecución           | Capturas y logs adjuntos en comentarios de cada issue                | GitHub Issues (adjuntos en comentarios)               |

## Requerimientos de Entorno — Hardware

Dado el contexto académico y la ausencia de implementación en producción,
el entorno de pruebas se basa en la especificación funcional del enunciado
del taller.

| Recurso      | Especificación mínima                              |
|--------------|----------------------------------------------------|
| PC / Laptop  | Computador personal de cada integrante del equipo  |
| Conectividad | Acceso a internet para GitHub Issues y Actions     |

## Requerimientos de Entorno — Software

| Software          | Versión | Uso                                          |
|-------------------|---------|----------------------------------------------|
| Git               | 2.x     | Versionado de fuentes y plantillas           |
| GitHub CLI (gh)   | 2.x     | Gestión de etiquetas, hitos e issues         |
| Navegador web     | Moderno | Acceso a GitHub Issues, Projects y Actions   |

## Herramientas de Prueba Requeridas

| Herramienta     | Rol en el proceso de pruebas                                                |
|-----------------|-----------------------------------------------------------------------------|
| GitHub Issues   | Registro, seguimiento y trazabilidad de casos de prueba y reportes de defecto |
| GitHub Projects | Tablero kanban para visualización del estado del Test Run                   |
| GitHub Actions  | Automatización de validaciones sobre el repositorio en el proceso de CI     |

## Personal

| Rol                   | Responsabilidad                                                              | Integrante(s)                                          |
|-----------------------|------------------------------------------------------------------------------|--------------------------------------------------------|
| Líder de Pruebas      | Coordinación del plan, revisión de casos y criterios de aceptación           | Criollo Homez Julián Felipe                            |
| Analista de Pruebas   | Diseño y ejecución de casos, reporte de defectos                             | Ávila Cortés Julián David, Vargas Clavijo Brian Steven |
| Revisor de Documentos | Revisión del documento final antes de entrega                                | Rocha Ramirez Santiago                                 |

## Entrenamiento

Las siguientes necesidades de entrenamiento aplican tanto sobre el sistema
de gestión de pruebas utilizado como sobre las técnicas de diseño de casos.

| Necesidad de entrenamiento | Recurso sugerido |
|----------------------------|-----------------|
| Técnicas de diseño de casos de prueba de caja negra (partición de equivalencias, análisis de valores límite, tabla de decisiones) | Material del curso IS-I y documentación del docente |
| Uso de GitHub Issues con plantillas de formulario estructurado | Documentación oficial de GitHub: Issue Forms |
| GitHub Projects — tablero kanban para seguimiento del Test Run | Documentación oficial de GitHub Projects |
| GitHub Actions — conceptos de flujo de trabajo, tarea y paso para automatización de pruebas | Documentación oficial de GitHub Actions |
