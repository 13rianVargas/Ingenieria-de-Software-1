# Enfoque de Pruebas (Estrategia)

## Tipo de Pruebas

Este plan cubre exclusivamente pruebas funcionales de **caja negra**: se valida el comportamiento observable del sistema desde el punto de vista del Cliente, sin conocimiento de la implementacion interna.

No se realizan pruebas unitarias, de integracion técnica ni no funcionales en este plan. Esas categorias son responsabilidad de cada dev (Karma+Jasmine para frontend, JUnit+Spring Boot Test para backend) y se cubren en el pipeline CI del repositorio.

## Técnicas de Diseño de Casos

| Técnica | Aplicacion en HU-01 |
|---|---|
| Particion de equivalencias | Clasificar entradas validas e invalidas por campo: tipo PQRS, asunto, descripción, formato del adjunto. |
| Analisis de valores limite | Campos con restricciones de tamaño: longitud del asunto (1, 200, 201 caracteres), tamaño del adjunto (0 bytes, 5 MB, 5 MB + 1 byte). |
| Tabla de decisiones | Combinacion cliente autenticado vs anónimo, con/sin adjunto, SMTP disponible/caido. |
| Caso de uso extendido | Flujos alternativos: cliente ya existe en BD, SMTP cae, BD falla en INSERT. |

## Niveles de Prueba

Se ejecutan **pruebas de sistema**: el sistema completo, desde la interfaz de usuario hasta la persistencia y el correo, es tratado como caja negra.

## Subconjunto de Datos

- Cliente nuevo con datos validos completos.
- Cliente nuevo con datos invalidos (email mal formado, numero documento con letras).
- Cliente autenticado con sesion activa.
- Adjuntos validos: PDF de 100 KB, PDF de 4.9 MB.
- Adjuntos invalidos: imagen JPG, PDF de 5.1 MB, archivo vacio (0 bytes).
- Sin adjunto (camino donde el anexo es opcional).
- Tipos PQRS validos: peticion, queja, reclamo, sugerencia.
- Tipo PQRS invalido: cadena cualquiera fuera del enum.

## Gestion de Casos de Prueba

Los casos de prueba se gestionan en **GitHub Issues** del repositorio del proyecto usando la plantilla `test-case.yml`. Los defectos se reportan con la plantilla `bug-report.yml`. La estructura completa de etiquetas, hitos, tablero de seguimiento y flujo de ejecución se detalla en la sección Workflow GitHub.

## Herramientas

| Herramienta | Uso |
|---|---|
| GitHub Issues | Gestion de casos de prueba y defectos |
| GitHub Projects | Visualizacion del estado del Test Run (board kanban) |
| GitHub Actions | Validaciones automáticas del repositorio (CI) — no ejecuta los TC funcionales, pero si los unit tests del software |
