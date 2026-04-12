# Objetivos 
Los principales objetivos que se persiguen tras la correcta realización del presente proyecto son: 

1. Implementar un software bajo la puesta en práctica de metodologías, estándares, marcos de trabajo y buenas prácticas que permitan minimizar los riesgos y generar resultados de calidad. 
2. Apropiar tecnologías y demás conocimientos técnicos como frameworks, patrones, etc., para el desarrollo de sistemas de información en entornos web. 
3. Realizar la adecuada planeación del proyecto, contemplando el tiempo y alcance definidos, asignando de manera lógica el equipo de trabajo y las actividades necesarias para entregar el producto solicitado. 

# Descripción 
**SuperMarket** es una empresa especializada en la venta online de productos de consumo que realiza entregas a domicilio a todos sus Clientes. 

Actualmente se encuentra interesada en implementar una Aplicación que permita la recepción de todas las Peticiones, Quejas, Reclamos o Sugerencias (PQRS) por parte los Clientes, apoyando así causas ecológicas a través del manejo de “Cero Papel” y facilitando los procesos por medio de estrategias digitales “Anti-trámites”. 

Para ello, recurre a la Fábrica de Desarrollo Konrad la cual está conformado por estudiantes de Ingeniería de Sistemas, para que le haga una propuesta técnica y comercial de una solución informática que le permita administrar de manera amigable y segura toda la información derivada de dicho proceso (PQRS).  

De acuerdo a las necesidades de SuperMarket, los diferentes Stakeholders junto con el director de TI de la compañía, han consolidado las siguientes especificaciones que deben tenerse en cuenta para el desarrollo de la solución: 

- El sistema a desarrollar debe tener dos presentaciones: **App** para la radicación de PQRS y **Aplicación Web** para la gestión de radicaciones. 
- Se debe utilizar alguna de las siguientes tecnologías: JSF, SpringMVC, Vaadim, GoogleWeb, Toolkit o Zk u otros lenguajes como PHP, .Net, Angular, etc. 
- Para el manejo de persistencia, debe ser utilizada una base de datos de licencia libre: PostgreSql, MySql, SQLServer Express u Oracle Express. 
- Debe implementarse un Sistema de Mapeo Objeto-Relacional u ORM como lo es hibernate o iBatis o el correspondiente al lenguaje y tecnologías utilizadas. 
- Debe utilizarse un Servidor Web o de aplicaciones como lo son Tomcat, JBoss, Glassfish, Apache y IIS. 
- La integración se debe hacer mediante mecanismos SOAP o REST. 
- Se debe incorporar un módulo de seguridad que permita administrar los Usuarios, Perfiles, Opciones y Permisos del sistema. 
- Las contraseñas deben cifrarse a través de un mecanismo y/o algoritmo. 
# Criterios de Aceptación

## App Móvil para la Radicación de PQRS 
Debe cumplir los siguientes criterios de aceptación: 

- El sistema le debe permitir al usuario (Cliente), diligenciar la siguiente información para registrar su PQRS: 

  **Información del Cliente** 
  - Tipo de identificación 
  - Número de identificación 
  - Nombre completo 
  - Correo electrónico 
  - Teléfono móvil 

  **Información de PQRS** 
  - Número de radicado (automático) 
  - Fecha del radicado (automático) 
  - Tipo de radicado - PQRS 
  - Comentarios 
  - Anexo (PDF) 

- Cuando el usuario radique su PQRS, el sistema deberá ejecutar las siguientes acciones: 
  - Validar la existencia del Cliente en la base de datos de SuperMarket, en caso de no existir, el sistema deberá registrarlo.  
  - Para confirmar el registro exitoso del cliente el sistema le deberá enviar un correo de confirmación proporcionando la siguiente información: 
    - **Número de radicado**
    - **Contraseña automática:** (6 caracteres, mínimo una mayúscula, una minúscula y un número) 

- El usuario deberá poder autenticarse en la App usando su número de identificación y la contraseña proporcionada en el correo de confirmación. 

- La aplicación le debe permitir al usuario (cliente) consultar el listado de todos sus radicados, visualizando: 
  **Información del Resultado** 
  - Número de radicado  
  - Fecha del radicado 
  - Tipo de radicado – PQRS 
  - Comentarios 
  - Anexo 
  - Estado del radicado (Nuevo, En proceso, Resuelto, Rechazado) 
  - Justificación del estado 

- Los radicados del listado se deben poder filtrar por el siguiente criterio: 
  **Información de Consulta** 
  - Número de radicado 
## Aplicación Web para la Gestión de Radicados 
Debe cumplir los siguientes criterios de aceptación: 

- El Gestor de PQRS deberá contar con un usuario y contraseña para ingresar a la aplicación. 
- Podrá consultar el listado de todos los radicados junto con la siguiente información: 
  **Información de Radicados** 
  - Número de radicado  
  - Fecha del radicado 
  - Tipo de radicado (PQRS) 
  - Comentarios 
  - Anexos 
  - Estado del radicado (Nuevo, En proceso, Resuelto, Rechazado) 
  - Justificación del estado 

- Los radicados del listado se deben poder filtrar a través de los siguientes criterios: 
  **Filtros de Consulta** 
  - Tipo de radicado (PQRS) 
  - Estado del radicado (Nuevo, En proceso, Resuelto, Rechazado) 

- El Gestor de PQRS debe poder ejecutar las siguientes acciones: 
  - Descargar el anexo de cada radicado.  
  - Generar un reporte en formato PDF que muestre la información del listado de radicados (no incluir la columna de link) consultado y/o filtrado previamente. 
  - Permitir el cambio de estado a cada una de las PQRS. Para ello se debe ingresar una justificación: 
    **Gestión de PQRS** 
    - Estado del radicado (Nuevo, En proceso, Resuelto, Rechazado) 
    - Justificación del estado 

# Consideraciones Generales 
- Implemente las validaciones y restricciones que considere importantes para el adecuado funcionamiento del Software. 
- Realice los supuestos necesarios que haya a lugar sustentándolo en el documento y explicando el porqué del supuesto. 

# Arquitectura Funcional de la Solución 

De acuerdo con el diagrama de arquitectura funcional, la solución interactúa y se estructura de la siguiente manera:

- **Ciudadano (Cliente):** Genera su documento/anexo de PQRS interactuando directamente con un dispositivo móvil (**App Móvil**).
- **Capa de Integración:** La App Móvil se comunica a través de la red utilizando servicios web bajo los protocolos **SOAP / REST**.
- **Servidor de Aplicaciones / Web:** Recibe las peticiones enviadas mediante los servicios, procesa la lógica de negocio y centraliza el sistema.
- **Servidor de Base de Datos:** Está conectado al servidor de aplicaciones para manejar la persistencia y almacenamiento de la información.
- **Administrador (Gestor de PQRS):** Interactúa mediante un computador portátil con la **Aplicación Web** alojada en el servidor de aplicaciones para tramitar y responder las solicitudes.

## Entregables 
- Documentación generada durante el proyecto. 
- Aplicación, con fuentes, archivo desplegable (comprimido). 
- Base de datos, script para ejecutarse. 
- Presentación ejecutiva del producto.

# Presentación Ejecutiva  
La Fábrica de Desarrollo Konrad deberá exponer al Cliente Supermarket (Profesor) el nuevo sistema de PQRS a través de una presentación Ejecutiva que tiene como propósito resaltar las bondades del sistema y sustentar las razones por las cuales debe preferirlo con respecto a otros productos similares del mercado, mostrando las ventajas tecnológicas y operativas del producto frente a los demás competidores. 

> **NOTA:** Para dicha presentación, los integrantes del grupo asumirán la presentación ejecutiva, posteriormente, el profesor estará en la libertad de seleccionar el integrante que desarrollará la sustentación técnica el cual deberá estar en la capacidad de responder todas las preguntas técnicas, funcionales y comerciales que puedan surgir. La calificación de la sustentación dependerá únicamente del integrante a cargo de esta. 