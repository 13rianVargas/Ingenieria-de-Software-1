# Casos de Prueba

## Catalogo base (10 TC)

Esta es la suite minima de casos de prueba diseñada para HU-01 Radicar PQRS. Se expande con casos derivados a medida que se encuentren bugs durante la ejecución.

| ID | Descripción | Técnica | Resultado esperado |
|---|---|---|---|
| TC-001 | Radicar con todos los campos validos, cliente autenticado | Caja negra (camino feliz) | Radicado creado con numero único, estado nuevo, email de confirmacion enviado al cliente |
| TC-002 | Radicar con cliente anónimo (no existe en BD) | Caja negra (camino alternativo) | Usuario auto-registrado con clave autogenerada, radicado creado, dos correos enviados (radicado + clave) |
| TC-003 | Asunto vacio | Particion eq. invalida | Error de validacion en formulario, no se envía request al backend |
| TC-004 | Asunto con 201 caracteres (limite + 1) | Valor limite | Error de validacion (max 200 caracteres) |
| TC-005 | Adjunto que no es PDF (ej. imagen JPG) | Particion eq. invalida | Error: "Formato no valido. Solo se admiten archivos PDF" |
| TC-006 | Adjunto mayor a 5 MB | Valor limite | Error: "El archivo excede el tamaño maximo permitido (5 MB)" |
| TC-007 | Sin adjunto (campo opcional) | Caja negra | Radicado creado sin anexo, flujo normal continua |
| TC-008 | Tipo PQRS invalido (ej. "otro") | Particion eq. invalida | Error en backend (400 Bad Request) si se envía manipulado, dropdown no lo permite en UI |
| TC-009 | Email cliente ya existe en BD (radicar anónimo con email registrado) | Caja negra | Usa cuenta existente (no duplica usuario), radicado se asocia al usuario existente |
| TC-010 | Falla SMTP al enviar correo | Caso uso extendido | Radicado creado igual, retry async en cola notificación, cliente recibe confirmacion en pantalla |

## Detalle por caso de prueba

Cada TC se documenta como un GitHub Issue separado usando la plantilla test-case.yml. Los campos minimos son:

- ID del caso (TC-NN).
- HU asociada (HU-01).
- CU asociado (CU-03 Radicar PQRS, o CU-01 Registro Cliente para TC-002).
- Tipo de prueba (functional).
- Prioridad (alta para casos criticos del camino feliz, media para alternos, baja para edge cases).
- Severidad esperada si falla.
- Precondiciones.
- Datos de prueba.
- Pasos numerados.
- Resultado esperado.
- Resultado obtenido (al ejecutar).
- Estado de ejecución.
- Ambiente.
- Navegador/Dispositivo (si aplica).
- Evidencias (capturas, logs, videos).

## Ejemplo desarrollado: TC-001

**ID:** TC-001
**HU:** HU-01 Radicar PQRS
**CU:** CU-03 Radicar PQRS
**Tipo:** functional
**Prioridad:** alta
**Severidad esperada si falla:** critical (bloquea HU completa)

**Precondiciones:**

- El Cliente existe en BD con datos validos.
- El Cliente esta autenticado (sesion JWT activa).
- La App Mobile esta corriendo y conectada al backend.

**Datos de prueba:**

| Campo | Valor |
|---|---|
| Tipo PQRS | queja |
| Asunto | Producto vencido en estanteria |
| Descripción | El producto X que compre el dia Y tenia fecha de vencimiento superada... |
| Adjunto | factura.pdf (200 KB) |

**Pasos:**

1. Abrir la App Mobile.
2. Tocar "Radicar nueva PQRS".
3. Verificar que los datos personales se autocompletan.
4. Seleccionar "queja" en el dropdown de tipo.
5. Ingresar el asunto en el campo correspondiente.
6. Ingresar la descripción en el textarea.
7. Tocar "Adjuntar anexo" y seleccionar factura.pdf.
8. Tocar "Radicar".

**Resultado esperado:**

- La App muestra un mensaje de exito con el numero de radicado generado (formato PQRS-2026-NNNNNN).
- La fecha de radicación mostrada coincide con el momento del envio.
- El Cliente recibe un correo de confirmacion en su email registrado con el numero de radicado.
- En la BD, la tabla pqrs tiene una nueva fila con estado=nuevo y cliente_id correspondiente.
- En el NAS, el archivo factura.pdf esta presente en la ruta indicada por adjunto.url_nas.

**Evidencias requeridas:**

- Captura de pantalla de la confirmacion en la App.
- Captura del email recibido.
- Captura o query SELECT mostrando la fila en pqrs.

## Trazabilidad TC ↔ RF

| TC | RF cubierto |
|---|---|
| TC-001 | RF-01, RF-12 |
| TC-002 | RF-01, RF-02, RF-12 |
| TC-003 | RF-01 |
| TC-004 | RF-01 |
| TC-005 | RF-01 |
| TC-006 | RF-01 |
| TC-007 | RF-01 |
| TC-008 | RF-01 |
| TC-009 | RF-01, RF-02 |
| TC-010 | RF-01, RF-12 |
