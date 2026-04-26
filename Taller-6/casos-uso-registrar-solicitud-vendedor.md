Identificador
01	Nombre

Registrar solicitud para ser vendedor
Resumen
Es el proceso de captura de información, donde el aspirante a vendedor ingresa sus datos personales, descarga los formatos legales obligatorios y carga su documentación. El cumplimiento finaliza cuando el sistema valida la integridad de los archivos y asigna un número de radicado con estado "PENDIENTE".

Actor
Aspirante a Vendedor (Actor Principal)
	Proceso de negocio en el que participa
Registro de solicitud para ser vendedor
Precondición
El aspirante no tiene una solicitud activa ni una cuenta de vendedor en el sistema. El sistema está disponible y accesible vía HTTPS. Los formatos descargables (Aceptación de Centrales de Riesgo y Tratamiento de Datos Personales) se encuentran publicados en el portal.


	Postcondición

La solicitud queda registrada en la base de datos con estado 'PENDIENTE'. Se asigna un número de radicado único. El aspirante recibe un correo electrónico de confirmación con el número de su solicitud.

Flujo normal de eventos
	Acción del actor		Respuesta del sistema
1	 El aspirante accede al portal E-Commerce de Comercial Konrad y selecciona la opción 'Registrarme como Vendedor'.
	2	 El sistema muestra el formulario de registro de solicitud de vendedor, incluyendo los campos de datos personales y la sección de documentos adjuntos, con los enlaces para descargar los formatos obligatorios.

3	 El aspirante diligencia los campos: Nombres, Apellidos, Tipo de Documento (Cédula o NIT), Número de Identificación, Correo Electrónico, País de Residencia, Ciudad de Residencia y Teléfono.
	4	 El sistema detecta automáticamente si el aspirante es persona natural (Cédula) o persona jurídica (NIT) y actualiza dinámicamente la lista de documentos obligatorios a adjuntar.

5	El aspirante adjunta los documentos requeridos según su tipo: Fotocopia de Cédula, RUT, Cámara de Comercio (si es PJ), Formato de Aceptación de Consulta a Centrales de Riesgo y Formato de Aceptación de Tratamiento de Datos Personales.	6	El sistema muestra el estado de carga de cada documento (tamaño, nombre, ícono de éxito o error).
7	El aspirante marca la casilla de aceptación de términos y condiciones y hace clic en el botón 'Enviar Solicitud'.	8	 El sistema valida: formato del correo electrónico, que el número de identificación no esté ya registrado, que todos los campos obligatorios estén diligenciados y que los documentos obligatorios hayan sido adjuntados.

9		10	 El sistema registra la solicitud en la base de datos con estado 'PENDIENTE', genera y asigna un número de radicado único, y almacena todos los datos y documentos del aspirante
11		12	El sistema muestra en pantalla el número de radicado asignado y envía al correo del aspirante un correo certificado con estampado cronológico confirmando la recepción de su solicitud e indicando el número de radicado
Caminos alternativos

Persona Natural
Si el tipo de documento seleccionado es 'Cédula de Ciudadanía', el sistema exige: Fotocopia de cédula, RUT, Formato de Aceptación de Centrales de Riesgo, Formato de Tratamiento de Datos. No exige Cámara de Comercio.

Persona Jurídica
Si el tipo de documento seleccionado es 'NIT', el sistema exige adicionalmente: Cámara de Comercio (certificado de existencia y representación legal vigente). Los demás documentos siguen siendo obligatorios.

Descarga de formato

El aspirante puede descargar en cualquier momento el Formato de Aceptación de Centrales de Riesgo o el Formato de Tratamiento de Datos Personales haciendo clic en el enlace correspondiente, sin perder los datos ya ingresados en el formulario.



Caminos de excepción

E-01 — Correo con formato incorrecto
En el paso 8, si el correo electrónico no cumple el formato estándar (usuario@dominio.ext), el sistema resalta el campo en rojo y muestra el mensaje: 'Ingrese un correo electrónico válido'. El flujo retorna al paso 3.
E-02 — Identificación ya registrada
En el paso 8, si el número de identificación ya tiene una solicitud activa o aprobada en el sistema, se muestra el mensaje: 'Ya existe una solicitud registrada con este número de identificación. Puede consultar el estado en la sección de seguimiento.' El flujo termina.
E-03 — Campos obligatorios incompletos
En el paso 8, si algún campo obligatorio no fue diligenciado o algún documento obligatorio no fue adjuntado, el sistema resalta en rojo los campos faltantes y muestra el mensaje: 'Complete todos los campos y documentos requeridos.' El flujo retorna al paso 3.
E-04 — Formato de archivo no permitido
En el paso 5, si el aspirante intenta adjuntar un archivo en un formato no permitido (distinto de PDF, JPG o PNG), el sistema muestra el mensaje: 'Formato no permitido. Solo se aceptan archivos PDF, JPG o PNG de máximo 5 MB.' El archivo no es cargado.
E-05 — Fallo en el servidor al guardar
En el paso 9, si ocurre un error al registrar la solicitud en la base de datos, el sistema muestra el mensaje: 'Ha ocurrido un error al procesar su solicitud. Intente nuevamente más tarde.' El error queda registrado en el log del sistema.



Puntos de extensión
CU-EX-01: Descargar Formato de Aceptación de Consulta a Centrales de Riesgo. 


Autor	Fecha	Creación / Modificación
Avila J., Criollo J., Rocha S., Vargas B.
	14/04/2026 	14/04/2026
