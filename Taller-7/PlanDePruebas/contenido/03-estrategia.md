# Enfoque de Pruebas (Estrategia)

## Tipo de Pruebas

Este plan cubre exclusivamente **pruebas funcionales de caja negra**: se
valida el comportamiento observable del sistema desde el punto de vista del
usuario, sin conocimiento de la implementación interna.

No se realizan pruebas unitarias, de integración técnica ni no funcionales.

## Técnicas de Diseño de Casos

| Técnica                      | Aplicación                                                                        |
|------------------------------|-----------------------------------------------------------------------------------|
| Partición de equivalencias   | Clasificar entradas válidas e inválidas por campo (correo, identificación, etc.)  |
| Análisis de valores límite   | Campos con restricciones numéricas o de tamaño (cantidad, peso, etc.)            |
| Tabla de decisiones          | Combinaciones de documentos requeridos según tipo de persona (natural/jurídica)  |
| Caso de uso extendido        | Flujos principales y alternativos de registro y publicación                       |

## Niveles de Prueba

Se ejecutan **pruebas de sistema**: el sistema completo, desde la interfaz
de usuario hasta la persistencia, es tratado como caja negra.

## Subconjunto de Datos

- Personas naturales con documentos completos.
- Personas naturales con documentos incompletos.
- Personas jurídicas con documentos completos.
- Datos con formatos inválidos (correo sin @, teléfono con letras, etc.).
- Productos con todos los campos obligatorios.
- Productos con campos opcionales omitidos.
- Productos con imágenes fuera de formato/tamaño.

## Gestión de Casos de Prueba

Los casos de prueba se gestionan en **GitHub Issues** del repositorio del
proyecto usando la plantilla de caso de prueba. Los defectos se reportan
con la plantilla de reporte de defecto. La estructura QA completa (etiquetas,
hitos, tablero de seguimiento y flujo de ejecución) se detalla en el plan de
acción del equipo.

## Herramientas

| Herramienta     | Uso                                                   |
|-----------------|-------------------------------------------------------|
| GitHub Issues   | Gestión de casos de prueba y defectos                 |
| GitHub Projects | Visualización del estado del Test Run (board kanban)  |
