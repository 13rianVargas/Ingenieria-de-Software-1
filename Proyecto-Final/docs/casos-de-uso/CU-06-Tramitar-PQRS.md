# CU-06: Tramitar PQRS

## 1. Descripción
Permite a un Gestor de PQRS, desde la Aplicación Web, procesar una petición, queja, reclamo o sugerencia específica que ha ingresado a la bandeja. Esto implica descargar el anexo (PDF), actualizar el estado de la solicitud y justificar la decisión.

> **Nota MVP**: la notificación automática al Cliente sobre el cambio de estado corresponde a la funcionalidad #16 (`1-Funcionalidades.md`), clasificada como **mejora post-MVP**. CU-06 en el MVP termina con la persistencia del cambio de estado; el envío del correo entra al alcance cuando se aborde #16.

## 2. Actores
* **Gestor de PQRS:** Actor principal que evalúa y tramita.

## 3. Precondiciones
* El Gestor de PQRS debe estar autenticado en la Aplicación Web.
* El radicado a tramitar no debe encontrarse en estado "Resuelto" o "Rechazado" (estados finales).
* El Gestor debe visualizar la bandeja de radicados (CU-05).

## 4. Flujo Principal (Actualizar Estado y Justificar)
1. El Gestor de PQRS ingresa a la Bandeja de Radicados.
2. Identifica una solicitud en estado "Nuevo".
3. Hace clic sobre la opción "Ver detalle" y el sistema le muestra la información completa del radicado.
4. El Gestor hace clic en el enlace del "Anexo".
5. El sistema descarga o abre el documento PDF adjunto por el Cliente en el momento de la radicación.
6. El Gestor de PQRS analiza el contenido y determina el siguiente paso.
7. El Gestor selecciona la opción "Gestionar Estado".
8. El sistema despliega un menú desplegable con las opciones "Nuevo", "En proceso", "Resuelto" y "Rechazado", junto con un campo de texto obligatorio "Justificación".
9. El Gestor cambia el estado (ej. a "En proceso") y redacta la respuesta/justificación.
10. Hace clic en "Guardar Cambios".
11. El sistema actualiza el registro en la BD y almacena la justificación.
12. El sistema muestra un mensaje de éxito: "Estado actualizado correctamente".

## 5. Flujos Alternativos

*   **Flujo Excepción 1 (Intento sin Justificación):**
    En el paso 9, si el Gestor intenta actualizar a un estado distinto de "Nuevo" (como "Rechazado" o "Resuelto") pero deja en blanco el campo "Justificación", el sistema no le permite avanzar, marcando el campo en rojo con la advertencia: "La justificación es obligatoria para cambiar el estado."

## 6. Diagrama del Caso de Uso

CU-06 aparece en el diagrama general ([`../diagramas/arquitectura/1-vista-casos-uso.png`](../diagramas/arquitectura/1-vista-casos-uso.png)) accesible por el actor Gestor con relación de extensión hacia el flujo de notificación al Cliente.