# Alcance de las Pruebas

## Elementos de Prueba

El elemento bajo prueba corresponde a la unica historia de usuario seleccionada para implementacion en el Proyecto-Final:

| ID | Historia de Usuario | Módulo |
|---|---|---|
| HU-01 | Radicar PQRS | Mobile (Cliente) + Backend |

## Funcionalidades a Probar

Desde el punto de vista del Cliente (ciudadano):

- Diligenciar el formulario de radicación con tipo de PQRS, asunto y descripción.
- Adjuntar un archivo PDF como anexo (opcional pero validado).
- Recibir el numero de radicado autogenerado con formato PQRS-YYYY-NNNNNN.
- Recibir un correo de confirmacion con el numero de radicado.
- Si es cliente nuevo (anónimo): recibir tambien la clave autogenerada por correo.
- Si es cliente autenticado: el formulario autocompleta los datos personales.

Desde el punto de vista del Sistema:

- Validar tipo PQRS dentro del enum permitido (peticion, queja, reclamo, sugerencia).
- Validar formato del adjunto (exclusivamente application/pdf).
- Validar tamaño del adjunto (maximo 5 MB).
- Si el cliente no existe en BD: autogenerar usuario y clave (CU-01).
- Persistir la PQRS con estado nuevo.
- Persistir la metadata del adjunto en BD y el binario en NAS.
- Disparar correo asíncrono via SMTP Gateway.
- En caso de falla SMTP: encolar para reintento sin afectar la respuesta UI.

## Pruebas de Regresion

No aplica para este plan: es la primera ejecución de pruebas sobre la HU-01. No existen componentes pre-existentes que puedan verse afectados en este contexto academico.

## Funcionalidades Excluidas

Las siguientes funcionalidades quedan fuera del alcance de este plan:

| Funcionalidad | Razon de exclusion |
|---|---|
| HU-02 Registro Automático Cliente (camino independiente) | Se valida como flujo subsidiario de HU-01 (camino anónimo), no como HU independiente. |
| HU-03 Login Cliente | Fuera del scope de implementacion del Sprint 1. |
| HU-04 Historial Radicados Propios | Fuera del scope. |
| HU-05 Filtrar Radicados Propios | Fuera del scope. |
| HU-06 a HU-11 (gestor) | Fuera del scope. |
| HU-12 Notificación Confirmacion | Cubierta indirectamente como parte de HU-01 (paso final asíncrono), no como TC independiente. |
| Pruebas de rendimiento | No aplican (plan funcional únicamente). |
| Pruebas de seguridad | No aplican (plan funcional únicamente). |
