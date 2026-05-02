# Alcance de las Pruebas

## Elementos de Prueba

Los elementos objeto de prueba corresponden a las dos historias de usuario
del Release 1 del sistema E-Commerce Comercial Konrad:

| ID   | Historia de Usuario   | Módulo              |
|------|-----------------------|---------------------|
| HU-1 | Registro de Vendedor  | Onboarding / Acceso |
| HU-2 | Publicar Productos    | Inventario          |

## Funcionalidades a Probar

### HU-1 — Registro de Vendedor

Desde el punto de vista del usuario (vendedor potencial):

- Registro del formulario con datos personales y documentos adjuntos.
- Validación de formato de datos por campo (correo, teléfono, identificación).
- Distinción persona natural vs. jurídica y documentos requeridos por tipo.
- Confirmación de solicitud registrada en estado PENDIENTE con número de radicado.
- Recepción de correo de confirmación con número de solicitud.
- Descarga disponible de formatos (aceptación de centrales de riesgo y datos personales).

### HU-2 — Publicar Productos

Desde el punto de vista del usuario (vendedor activo):

- Registro de producto con todos los atributos requeridos.
- Validación de campos obligatorios.
- Carga de imágenes del producto.
- Confirmación de producto publicado correctamente en la plataforma.

## Pruebas de Regresión

No aplica para este plan: es la primera ejecución de pruebas sobre estas
funcionalidades. No existen componentes pre-existentes que puedan verse
afectados en este contexto académico.

## Funcionalidades Excluidas

Las siguientes funcionalidades quedan fuera del alcance de este plan:

| Funcionalidad                          | Razón de exclusión                                          |
|----------------------------------------|-------------------------------------------------------------|
| Revisión por Director Comercial        | Fuera de las 2 HU seleccionadas                            |
| Pago de suscripción                    | Fuera del alcance de HU-1 y HU-2                           |
| Gestión de mora y cancelación          | Proceso post-activación, no cubierto                       |
| Registro de Compradores                | HU independiente, no seleccionada                          |
| Búsqueda y compra de productos         | Release 2, fuera del alcance                               |
| Integración Datacredito / CIFIN        | Servicio externo; no disponible en ambiente de pruebas     |
| Consulta antecedentes Policía Nacional | Proceso manual del Director Comercial                      |
| Pruebas no funcionales (RNF)           | Excluidas por decisión del equipo                          |
