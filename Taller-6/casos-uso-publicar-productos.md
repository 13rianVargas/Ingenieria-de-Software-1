Identificador
02	Nombre

Publicar productos
Resumen
El vendedor registra en el sistema la información de un producto que desea ofrecer para la venta en la plataforma E-Commerce Konrad, incluyendo sus características, imágenes y precio, para que quede disponible y visible al público comprador.

Actor
Vendedor (solicitante con suscripción activa y aprobada)
	Proceso de negocio en el que participa
Gestión de publicación de productos / Administración del catálogo de productos del vendedor

Entradas
-	Nombre del producto
-	Categoría
-	Subcategoría
-	Marca
-	Tipo: Original / Genérico
-	Color
-	Tamaño
-	Peso
-	Talla
-	Condición: nuevo/usado
-	Cantidad disponible
-	Valor
-	Imágenes del producto	Salidas

-	Producto registrado y publicado en la plataforma, visible para los compradores

-	Confirmación en pantalla del registro exitoso del producto
Precondición
-	El solicitante debe haber sido aprobado como vendedor por el director comercial 
-	La suscripción del vendedor debe encontrarse en estado ACTIVA
-	El vendedor debe estar autenticado en la plataforma

	Postcondición

La solicitud queda registrada en la base de datos con estado 'PENDIENTE'. Se asigna un número de radicado único. El aspirante recibe un correo electrónico de confirmación con el número de su solicitud.

Suposiciones
Flujo normal de eventos
	Acción del actor		Respuesta del sistema
1	El vendedor ingresa a la opción “Publicar producto”	2	El sistema despliega el formulario de registro de producto con todos los campos requeridos
3	 El vendedor diligencia los datos del producto: nombre, categoría, subcategoría, marca, tipo (original/genérico), color, tamaño, peso, talla, condición (nuevo/usado), cantidad y valor	4	El sistema valida en tiempo real el formato correcto de cada campo ingresado
5	5. El vendedor carga las imágenes del producto	6	 El sistema verifica que las imágenes cumplan con el formato y tamaño permitidos y muestra una previsualización
7	 El vendedor confirma y envía el formulario	8	El sistema registra el producto en la base de datos asociándolo al vendedor autenticado
9		10	 El sistema publica el producto en la plataforma dejándolo visible para los compradores
11		12	 El sistema muestra un mensaje de confirmación indicando que el producto fue publicado exitosamente
Caminos alternativos

 El vendedor desea corregir información antes de enviar
-	En el paso 7, el vendedor decide modificar algún dato antes de confirmar
-	El vendedor edita los campos que desea corregir y vuelve al paso 7
El vendedor carga más de una imagen
-	En el paso 5, el vendedor adjunto, múltiples imágenes del producto
-	El sistema acepta todas las imágenes validas, designa la primera como imagen principal y muestra la previsualización de cada una. Continua en el paso 7


Caminos de excepción

Campos obligatorios sin diligenciar
-	En el paso 4, el sistema detecta que uno o más campos obligatorios están vacíos. 
-	El sistema resalta los campos faltantes y muestra un mensaje indicando cuáles son requeridos. El flujo regresa al paso 3
Formato de datos incorrecto
-	En el paso 4, el sistema detecta que algún campo tiene un valor con formato invalido (por ejemplo, valor negativo en precio o cantidad)
-	El sistema muestra un mensaje de error indicando el campo y el formato esperado. El flujo regresa al paso 3. 
Formato de datos incorrecto Fallo en la conexión con la base de datos
-	En el paso 8, el sistema no logra registrar el producto por un error interno
-	El sistema muestra un mensaje de error indiciando que no fue posible completar la publicación y sugiere intentarlo nuevamente. El producto no queda publicado. 

Puntos de extensión
PE-01: Descarga de formato de categoría
-	Ubicación en el flujo: Paso 3, cuando el vendedor selecciona la categoría del producto. 
-	Condición: Si la categoría, seleccionada requiere especificaciones técnicas adicionales obligatorias.
-	Descripción: El sistema extiende el formulario mostrando campos adicionales específicos según la categoría elegida, solicitando al vendedor información complementaria

Autor	Fecha	Creación / Modificación
Avila J., Criollo J., Rocha S., Vargas B.
	14/04/2026 	14/04/2026
