# Diagrama de Procesos: Compra de Productos

Este diagrama documenta el flujo dinámico del proceso de compra, desde la búsqueda de un producto hasta la calificación post-transacción. Diferencia el comprador, el sistema E-Commerce y los servicios externos de pago.

```plantuml
@startuml
|Comprador|
start
:Buscar producto\n(nombre, categoría,\nrango de precios, características);

|Sistema E-Commerce|
:Ejecutar búsqueda\nen catálogo (BD);
:Retornar resultados\n(imagen, precio, categoría);

|Comprador|
:Revisar resultados;
:Ver detalle del producto\n(imágenes, características,\nreputación vendedor, comentarios);

if (¿Desea comprar?) then (No)
  :Realizar nueva búsqueda\no salir;
  stop
else (Sí)
endif

:Agregar producto(s) al carrito;

|Sistema E-Commerce|
:Calcular total en tiempo real:\n1. Precio base × cantidad\n2. Comisión por categoría\n3. IVA si aplica;

|Comprador|
:Seleccionar forma de entrega\n(Recoger en tienda /\nEntrega a domicilio);

|Sistema E-Commerce|
if (¿Entrega a domicilio?) then (Sí)
  :Calcular costo de envío\n(ciudad + peso total);
  :Actualizar total;
else (No)
endif

|Comprador|
:Proceder al pago;
:Seleccionar forma de pago\n(Línea / Tarjeta / Consignación);

|Sistema E-Commerce|
if (¿Pago en línea o tarjeta?) then (Sí)
  :Redirigir a pasarela de pagos\n(Stripe / PayPal);
  :Recibir número de aprobación;
else (Consignación)
  :Generar recibo de consignación;
  :Leer archivo plano bancario\n(FileSystem → BD local);
  :Verificar consignación;
endif

if (¿Pago exitoso?) then (No)
  :Notificar error de pago;
  |Comprador|
  :Reintentar con otro método;
  |Sistema E-Commerce|
else (Sí)
endif

:Registrar compra\n(estado: PAGADO);
:Notificar al vendedor;
:Actualizar stock del producto;
:Enviar confirmación por correo;

|Comprador|
:Recibir producto\n(o recoger en tienda);
:Calificar la transacción\n(1 a 10, comentarios sobre\natención y servicio);

|Sistema E-Commerce|
:Registrar calificación;
:Actualizar reputación del vendedor;
if (¿Vendedor acumula 10\ncalif. < 3 O promedio < 5?) then (Sí)
  :Cambiar suscripción\na estado **CANCELADA**;
  :Notificar al vendedor;
else (No)
endif
stop
@enduml
```
