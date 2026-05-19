# Especificación de Requerimientos No Funcionales

A continuación se presentan los requerimientos no funcionales extraídos directamente del enunciado y contexto del sistema de información de PQRS para SuperMarket. Estos han sido acotados para soportar estrictamente las 12 funcionalidades principales del sistema y están estructurados usando el formato de plantilla del curso.

<table border="1" style="border-collapse: collapse; width: 100%;">
  <tr>
    <td style="width: 25%; padding: 8px;"><strong>Identificador:</strong><br>RNF-01</td>
    <td style="width: 25%; padding: 8px;"><strong>Prioridad:</strong><br>Alta</td>
    <td style="width: 50%; padding: 8px;"><strong>Nombre:</strong><br>Arquitectura Tecnológica y Persistencia</td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Descripción:</strong><br>
      El sistema debe construirse sobre una pila tecnológica (stack) específica aprobada por el cliente. Esto garantiza la compatibilidad con la infraestructura de SuperMarket, el no licenciamiento restrictivo de los datos y el uso de patrones de diseño modernos para la persistencia.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Criterios de Aceptación:</strong><br>
      1. El sistema debe alojar su base de datos obligatoriamente en un motor de licencia libre aprobado (PostgreSql, MySql, SQLServer Express u Oracle Express).<br>
      2. El código fuente backend debe implementar un Sistema de Mapeo Objeto-Relacional (ORM) como Hibernate, iBatis, o equivalente, para toda transacción con la base de datos.<br>
      3. El sistema debe ser desplegado en un Servidor Web o de Aplicaciones avalado (ej. Tomcat, JBoss, Glassfish, Apache, IIS).<br>
      4. El sistema debe ofrecer dos interfaces de presentación independientes: una <strong>App Móvil</strong> (orientada al Cliente) y una <strong>Aplicación Web</strong> (orientada al Gestor).<br>
      5. El código backend y web debe desarrollarse en lenguajes/frameworks estándar aprobados en el contexto (ej. PHP, .Net, Angular, JSF, SpringMVC, etc.).
    </td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Documentación:</strong><br>
      - Documento de Arquitectura y Vista de Implementación.<br>
      - Script de Base de Datos y Modelo Entidad-Relación.<br>
    </td>
  </tr>
</table>

<br>

<table border="1" style="border-collapse: collapse; width: 100%;">
  <tr>
    <td style="width: 25%; padding: 8px;"><strong>Identificador:</strong><br>RNF-02</td>
    <td style="width: 25%; padding: 8px;"><strong>Prioridad:</strong><br>Alta</td>
    <td style="width: 50%; padding: 8px;"><strong>Nombre:</strong><br>Seguridad, Autenticación y Control de Accesos</td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Descripción:</strong><br>
      Toda la interacción con el sistema que requiera privilegios (como visualizar el historial de PQRS o la bandeja de entrada) debe estar protegida. Se debe garantizar que las contraseñas, tanto las autogeneradas por el sistema como las creadas, se almacenen de forma irrecuperable en texto plano.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Criterios de Aceptación:</strong><br>
      1. Las contraseñas de todos los usuarios (Clientes y Gestores) deben cifrarse en la base de datos a través de un mecanismo o algoritmo unidireccional (hash criptográfico seguro como bcrypt o Argon2).<br>
      2. El sistema debe incorporar un módulo de seguridad basado en Roles o Perfiles (mínimo "Cliente" y "Gestor PQRS") que restrinja el acceso a las opciones y funcionalidades correspondientes.<br>
      3. La App Móvil solo debe permitir la consulta de PQRS propias si la sesión del Cliente fue validada correctamente mediante su número de identificación y contraseña (autenticación).<br>
      4. La Aplicación Web debe denegar el acceso a la Bandeja General, la descarga de Anexos y la Generación de Reportes a cualquier solicitud no autenticada como Gestor.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Documentación:</strong><br>
      - Políticas de Cifrado y Seguridad de SuperMarket.<br>
      - Vista Lógica de Seguridad (Documento de Arquitectura).<br>
    </td>
  </tr>
</table>

<br>

<table border="1" style="border-collapse: collapse; width: 100%;">
  <tr>
    <td style="width: 25%; padding: 8px;"><strong>Identificador:</strong><br>RNF-03</td>
    <td style="width: 25%; padding: 8px;"><strong>Prioridad:</strong><br>Alta</td>
    <td style="width: 50%; padding: 8px;"><strong>Nombre:</strong><br>Interoperabilidad, Integración y Comunicación</td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Descripción:</strong><br>
      El sistema se estructura en capas separadas. Por consiguiente, la comunicación entre las interfaces cliente (App Móvil y Aplicación Web) y el Servidor de Aplicaciones (Backend) debe seguir un estándar de interoperabilidad web para garantizar que las radicaciones y peticiones se transaccionen de manera fiable.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Criterios de Aceptación:</strong><br>
      1. Toda la integración y el intercambio de datos entre la App Móvil (Cliente) y la capa de lógica de negocio (Servidor) debe realizarse exclusivamente mediante consumo de servicios web bajo el protocolo SOAP o REST.<br>
      2. El sistema backend debe exponer los *endpoints* necesarios para cubrir la radicación, consulta de historial y descarga de PDF (anexos).<br>
      3. Las notificaciones automáticas (confirmación de registro y nueva contraseña) deben dispararse sin bloquear asíncronamente las respuestas del servicio web al cliente.<br>
      4. Las respuestas de integración (payloads JSON/XML) deben estructurarse correctamente manejando códigos de estado para informar éxito o fallo de la operación a la interfaz de usuario.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Documentación:</strong><br>
      - Definición de API / Especificación OpenAPI (Swagger) o WSDL.<br>
      - Vista Física y de Despliegue (Documento de Arquitectura).
    </td>
  </tr>
</table>
