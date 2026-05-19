# CU-01: Gestionar Registro de Cliente

## 1. Descripción

Permite registrar automáticamente a un ciudadano en el sistema cuando radica una PQRS por primera vez y aún no existe en la base de datos. **En el MVP no hay registro manual independiente:** el registro ocurre exclusivamente como `include` desde CU-03 (Radicar PQRS), sin pantalla "Registrarse" separada. El contexto del proyecto lo permite ("validar la existencia del Cliente en la base de datos; en caso de no existir, el sistema deberá registrarlo").

## 2. Actores

* **Cliente:** Persona natural cuya identificación no está aún en la base de datos.
* **Sistema (Notificador):** Envía el correo electrónico con las credenciales autogeneradas.

## 3. Precondiciones

* CU-03 (Radicar PQRS) está en ejecución y el flujo detectó que el número de identificación no existe.
* Los datos personales (tipo y número de identificación, nombre, correo, teléfono) ya fueron capturados en el formulario de radicación de CU-03.
* El dispositivo tiene conexión a internet.

## 4. Flujo Principal (Registro Automático durante Radicación)

1. CU-03 detecta que el número de identificación del usuario no existe en la base de datos.
2. El sistema valida los datos personales recibidos en el payload de la PQRS (campos no vacíos, formato de correo, formato de teléfono).
3. El sistema almacena el nuevo usuario con rol `cliente`.
4. El sistema autogenera una contraseña segura (mínimo 6 caracteres, 1 mayúscula, 1 minúscula, 1 número) y la asocia a la cuenta (hash BCrypt).
5. El Sistema Notificador envía un correo electrónico al Cliente con sus credenciales de acceso y el número de radicado de la PQRS.
6. El control regresa a CU-03 (paso 7 del Flujo Principal de CU-03) sin interrumpir la radicación.

## 5. Flujos Alternativos

* **Flujo Excepción 1 (Cliente ya registrado):**
    En el paso 1, si el sistema detecta que el correo o número de identificación ya existe asociado a otra cuenta, **no** crea un nuevo registro. El flujo continúa en CU-03 reutilizando los datos del usuario existente. No se envía correo de credenciales.

* **Flujo Excepción 2 (Falla de persistencia):**
    En el paso 3, si la inserción en la base de datos falla, el sistema aborta la radicación completa (rollback de CU-03) e informa al usuario que "No fue posible completar el registro. Intente más tarde." El error queda registrado en `auditoria`.

## 6. Diagrama del Caso de Uso

![Diagrama de CU-01](imagenes-diagramas/CU-01.png)

En el diagrama de vista de casos de uso (`docs/diagramas/arquitectura/1-vista-casos-uso.puml`) CU-01 aparece exclusivamente como destino del `<<include>>` desde CU-03. No hay flecha directa del actor Cliente hacia CU-01.

## 7. Fuera de Alcance MVP

El registro manual desde una pantalla independiente "Registrarse" en la App Móvil queda **fuera del alcance del MVP**. El mockup existente en `Taller-4/mockup/Registro.html` se conserva como referencia histórica para una posible iteración futura post-MVP, pero **no se implementa** en la entrega actual ni se traza en RF/diagramas del proyecto.

Decisión tomada para reducir alcance de implementación de software y enfocar el equipo en el flujo crítico de radicación. El contexto original del cliente lo permite explícitamente.
