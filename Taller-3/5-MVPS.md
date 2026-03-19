# Plan de Releases y MVPs

El proyecto se dividirá en tres entregas (releases), cada una con un MVP claramente definido. El primer MVP se centra en poner en marcha el catálogo de productos y el mecanismo básico para que los vendedores se den de alta en el sistema. Las siguientes entregas añadirán funciones de pago, carrito, calificaciones, reportes y automatizaciones.

---

## Release 1 – MVP inicial: registro de vendedores y CRUD de productos

**Alcance mínimo:**

1. **Módulo de registro de vendedores**
   - Formulario de captación de datos personales (nombres, apellidos, identificación, correo, país, ciudad, teléfono).
   - Adjuntar documentos obligatorios (fotocopia cédula, RUT, cámara de comercio, formularios de aceptación).
   - Validación de formatos y determinación de persona natural/jurídica.
   - Almacenamiento de la solicitud en estado **PENDIENTE** con número de seguimiento.
   - Envío de correo de confirmación de recepción.

2. **Aprobación manual por Director Comercial (simplificado)**
   - Interfaz de listado de solicitudes pendientes con columnas: ID, apellidos, nombres, correo, estado.
   - Acceso al detalle de cada solicitud.
   - Cambio de estado a **APROBADA** (sin integración a Datacrédito/CIFIN en esta etapa).
   - Generación automática de credenciales y envío de correo al vendedor aprobado.

3. **Módulo de productos (CRUD)**
   - Permitir al vendedor autorizado crear, leer, actualizar y eliminar productos.
   - Campos básicos: nombre, categoría, subcategoría, precio, cantidad disponible, imagen principal.
   - Listado público de productos que acepte filtros simples (nombre, categoría, precio).

4. **Registro de compradores**
   - Formulario mínimo (nombres, apellidos, identificación, correo, ciudad).
   - Envío de credenciales por correo y autenticación básica.

5. **Búsqueda y visualización**
   - Página de búsqueda que muestra resultados con imagen, precio y categoría.
   - Vista de detalle que muestra datos del producto y reputación del vendedor (inicialmente estática).

6. **Infraestructura mínima**
   - Base de datos relacional para vendedores, productos y compradores.
   - Módulo de autenticación con roles vendedor/comprador.
   - Envío de correos (simulado o con servicio real según alcance de la clase).

> **Nota:** esta primera entrega no incluye pagos, carrito, calificaciones ni reportes analíticos. Su fin es validar el flujo principal y permitir que el negocio comience a subir inventario y atraer compradores.


## Release 2 – MVP de gestión de usuarios (CRUD completo)

**Objetivo:** completar las operaciones CRUD para los actores principales que aún faltan y permitir que compradores y vendedores administren sus perfiles.

1. **CRUD compradores**
   - Crear, leer, actualizar y eliminar registros de compradores desde el portal.
   - Campos extendidos: dirección de residencia, teléfono, redes sociales (Twitter, Instagram).
   - Autenticación y edición de perfil desde la cuenta del comprador.

2. **CRUD vendedores**
   - Adición de interfaz para que el Director Comercial modifique o rechace solicitudes pendientes.
   - Vendedores aprobados pueden: ver/editar sus datos personales, subir documentos adicionales.
   - Eliminación o bloqueo de vendedores desde el panel administrativo.

3. **Perfiles accesibles**
   - Cada comprador y vendedor tiene una página de perfil visible (datos públicos mínimos).
   - Gestión de credenciales (cambio de contraseña, recuperación de cuenta).

4. **Mejoras en la base de datos y autenticación**
   - Tablas y relaciones normalizadas para soportar los campos adicionales.
   - Roles y permisos afinados para permitir edición solo a los dueños del perfil o administradores.

> En esta segunda entrega todavía no se realizan transacciones monetarias; el foco está en crear, visualizar y actualizar los datos de personas.


## Release 3 – MVP de comercio electrónico: pagos y carrito

**Alcance mínimo:**

1. **Carrito de compras**
   - Los compradores pueden añadir/retirar productos y ver totales en tiempo real.
   - Selección de tipo de envío (recoger en tienda o entrega a domicilio).
   - Cálculo básico de comisiones e IVA según configuración estática.

2. **Pasarela de pagos**
   - Integración con un servicio simulado o real (puede ser un sandbox) que permita ejecutar pagos en línea, tarjeta de crédito y consignación.
   - Manejo de estados de pago (pendiente, aprobado, rechazado) y actualización de suscripción del vendedor al completarse el pago.

3. **Historial de compras y facturación**
   - Registro de transacciones por comprador con detalles de artículos, monto y fecha.
   - Envío de notificaciones por correo tras cada compra.

4. **Reglas de negocio iniciales**
   - Aplicación de porcentaje de comisión y costo de envío según ciudad/peso.
   - Marca productos con IVA cuando corresponda.

> Esta tercera etapa habilita la monetización real de la plataforma; tras completarla se pueden avanzar a calificaciones, reportes analíticos y automatizaciones.

