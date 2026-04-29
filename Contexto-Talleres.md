## Requerimiento del Cliente

Se quiere desarrollar el sistema de información **E-Commerce para comercial Konrad** (venta de productos en línea – por internet), de acuerdo con el siguiente proceso:

### 1. Registro de Vendedor

Una persona interesada en ofrecer sus productos, realiza una solicitud registrando sus datos:

- Nombres
- Apellidos
- Número de identificación (Cédula o Nit)
- Correo electrónico
- País de residencia
- Ciudad de residencia
- Teléfono
- Documentos adjuntos:
  - Fotocopia de la cédula
  - RUT
  - Cámara de comercio
  - Formato de aceptación de consulta a centrales de riesgo _(descargable desde la página de registro)_
  - Formato de aceptación de tratamiento de datos personales _(descargable desde la página de registro)_

El sistema debe verificar el formato correcto de datos, valida si la persona es natural o jurídica para exigir unos u otros documentos y si todo está correcto la solicitud queda registrada en estado **"PENDIENTE"** arrojando el número de esta.

---

### 2. Revisión por el Director Comercial

El Director comercial del sitio, consulta las solicitudes pendientes por los siguientes criterios:

- Número de identificación
- Estado de la solicitud
- Rango de fecha de la solicitud

La consulta debe arrojar las solicitudes mostrando las siguientes columnas:

| Columna                  |
| ------------------------ |
| Número de identificación |
| Apellidos                |
| Nombres                  |
| Correo electrónico       |
| Estado                   |

El listado debe permitir ir al detalle de cada solicitud. El sistema debe automáticamente consultar la vida crediticia y judicial del solicitante:

#### Datacredito

Servicio web que retorna una de las siguientes calificaciones:

- **Baja:** La persona está reportada por no estar al día en sus obligaciones.
- **Alta:** La persona está al día en sus obligaciones.
- **Advertencia:** La persona tiene pocos días en mora.

#### CIFIN

Deja un archivo plano mensual en un FileSystem con permisos de acceso. Se debe leer y cargar a una base de datos local. Retorna:

- **Baja / Alta / Advertencia** (mismos criterios que Datacredito)

#### Antecedentes Judiciales (Policía Nacional)

El Director consulta manualmente con el número de identificación:

- **Requerido:** Tiene orden de arresto.
- **No requerido:** No tiene pendientes con la justicia.

#### Reglas de resultado de solicitud:

| Estado    | Condición                                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------------------------- |
| RECHAZADA | Vida crediticia Baja en alguna entidad **o** requerido por la justicia. Se envía correo al solicitante con el motivo. |
| DEVUELTA  | Vida crediticia en Advertencia. Se envía correo explicando que podrá reactivar cuando tenga calificación Alta.        |
| APROBADA  | Vida crediticia Alta en ambas entidades **y** no requerido por la justicia.                                           |

---

### 3. Proceso Post-Aprobación y Suscripción

- En cualquier caso, el sistema envía un correo y la persona puede consultar su solicitud por número o identificación en la página E-Commerce.
- Si la solicitud es **APROBADA**, se envían por correo las credenciales de acceso.
- El solicitante debe realizar el **pago de suscripción** (mensual, semestral o anual) para ser vendedor formal.

#### Formas de pago:

1. **Pagos en línea:** Resumen de compra → tipo de persona → número de ID → entidad bancaria → servicio intermediario → número de aprobación.
2. **Tarjeta de crédito:** Campos para registrar información de tarjeta.
3. **Por consignación:** Imprimir recibo de consignación. El banco deja un archivo al final del día en un FileSystem con el listado de consignaciones; se lee y carga a base de datos local.

Cuando el pago quede registrado, la solicitud pasa a estado **ACTIVA** y el vendedor puede publicar productos.

---

### 4. Publicación de Productos

El vendedor registra los siguientes datos del producto:

- Nombre
- Categoría
- Subcategoría
- Marca
- Original / Genérico
- Color
- Tamaño
- Peso
- Talla
- Nuevo / Usado
- Cantidad
- Valor
- Imágenes

---

### 5. Vencimiento y Mora de Suscripción

- Pasado un día hasta un mes del vencimiento de suscripción: estado **EN MORA** → correo de aviso para renovar.
- Si pasa el mes sin pago: estado **CANCELADA**.

---

### 6. Cancelación por Calificaciones

La solicitud también pasa a **CANCELADA** si:

- El vendedor acumula 10 calificaciones por debajo de 3, **o**
- Su promedio baja de 5.

---

### 7. Registro de Compradores

Un posible comprador debe inscribirse con los siguientes datos:

- Nombres
- Apellidos
- Número de identificación (Cédula o Nit)
- Correo electrónico
- País de residencia
- Ciudad de residencia
- Dirección de residencia
- Teléfono
- Twitter
- Instagram

El sistema envía por correo las credenciales para ingresar a la plataforma.

---

### 8. Búsqueda de Productos

Un comprador puede buscar productos por:

- Nombre
- Categoría
- Subcategoría
- Rango de precios
- Palabra contenida en las características

Resultados muestran:

| Columna                 |
| ----------------------- |
| Imagen principal        |
| Precio                  |
| Algunas características |
| Categoría               |

---

### 9. Detalle de Producto

El comprador puede ver:

- Imágenes
- Demás características
- Reputación del vendedor
- Comentarios
- Preguntas de otros interesados

---

### 10. Interacción del Comprador

Un comprador puede:

- Realizar preguntas sobre un producto
- Registrar comentarios sobre un producto
- Calificar a un vendedor (solo si realizó una compra efectiva)

---

### 11. Carrito de Compras

- El comprador puede agregar productos al carrito (muestra cantidad y total en tiempo real).
- Puede elegir: **recoger en tienda** o **entrega a domicilio**.
- Al pagar, las mismas 3 formas de pago aplican (ver sección 3).

#### Cálculo del total:

1. Se aplica un **porcentaje de comisión** según la categoría del producto (configurable).
2. Si hay entrega a domicilio: costo extra según **ciudad y peso total** (configurable).
3. Algunos productos aplican **IVA** (configurable).

---

### 12. Calificación de Transacciones

Una vez realizada la compra, el comprador puede:

- Calificar la transacción entre **1 y 10** (1 = peor, 10 = mejor).
- Ingresar comentarios sobre la atención y el servicio del vendedor.

---

### 13. Tablero de Control (BAM) – Director Comercial

KPIs iniciales:

1. Producto con mayor venta en el último mes
2. Categoría con mayores consultas en la última semana
3. Comportamiento de las suscripciones por periodos de semestres

---

### 14. Tendencias y Promociones Automáticas

El sistema debe:

- Identificar comportamientos en redes sociales para ofrecer productos.
- Identificar los productos más consultados para ofrecer promociones.
- Enviar correos automáticos con promociones o productos destacados a clientes registrados.

---

### 15. Administrador del Sistema

Un administrador podrá:

- Alimentar la información de parametrización
- Consultar y monitorear la auditoría
- Consultar los logs de errores

---

## Requerimientos No Funcionales

### Seguridad

- Módulo de autenticación y autorización con usuarios, perfiles/roles y permisos.
- Comunicaciones aseguradas con **HTTPS**.
- Contraseña: mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número.
- Contraseñas almacenadas con algoritmo de cifrado estándar.
- Correos certificados con estampado cronológico.

### Desempeño

- Soporte para **200.000 usuarios concurrentes** y **1.000 TPS** (transacciones de compra).
- Capacidad de computación distribuida.
- Alta disponibilidad del **99,7%**.
- Centro de datos alterno para recuperación ante desastres.

### Interfaz Gráfica

- Imagen corporativa parametrizable sin necesidad de experto en diseño.
- Diseño **responsive** para dispositivos móviles.

### Almacenamiento

- Crecimiento esperado del **200%** en documentos, archivos y data.
- **Backup diario** de la base de datos.

### Mantenimiento

- Registro de auditoría por cada acción CRUD: Acción, Usuario, Fecha, Hora.
- Log de errores para cada falla producida en el sistema.

### Tecnología

- Tecnología **libre de licenciamiento**.
- Lenguajes, frameworks y librerías en sus **últimas versiones estables**, reconocidas y con soporte.

### Integración

- Los servicios expuestos hacia sistemas externos (como BI) deben implementarse mediante **SOAP**.
