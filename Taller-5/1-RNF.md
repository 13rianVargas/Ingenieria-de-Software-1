# Especificación de Requerimientos No Funcionales

A continuación se presentan tres (3) requerimientos no funcionales extraídos del contexto del sistema de información E-Commerce, estructurados de acuerdo con el formato de plantilla solicitado.

<table border="1" style="border-collapse: collapse; width: 100%;">
  <tr>
    <td style="width: 25%; padding: 8px;"><strong>Identificador:</strong><br>RNF-01</td>
    <td style="width: 25%; padding: 8px;"><strong>Prioridad:</strong><br>Alta</td>
    <td style="width: 50%; padding: 8px;"><strong>Nombre:</strong><br>Seguridad en Autenticación y Contraseñas</td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Descripción:</strong><br>
      El sistema debe garantizar la seguridad en el acceso de los usuarios mediante un módulo de autenticación robusto. Esto incluye la gestión de perfiles, permisos, validación de contraseñas seguras y el cifrado de las mismas en la base de datos, así como garantizar que la comunicación se realice a través de canales seguros.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Criterios de Aceptación:</strong><br>
      1. El sistema debe validar que toda contraseña ingresada por un usuario tenga una longitud mínima de 8 caracteres.<br>
      2. El sistema debe rechazar contraseñas que no contengan al menos una letra mayúscula.<br>
      3. El sistema debe rechazar contraseñas que no contengan al menos una letra minúscula.<br>
      4. El sistema debe rechazar contraseñas que no contengan al menos un carácter numérico.<br>
      5. El sistema debe almacenar todas las contraseñas en la base de datos utilizando un algoritmo de encriptación estándar.<br>
      6. El sistema debe denegar el acceso a usuarios cuyas credenciales no coincidan con las almacenadas en la base de datos.<br>
      7. El sistema debe restringir el acceso a funcionalidades específicas dependiendo del perfil o rol asignado al usuario autenticado (ej. Administrador, Director Comercial, Vendedor, Comprador).<br>
      8. El sistema debe forzar el uso del protocolo HTTPS para todas las peticiones de autenticación y transacciones dentro de la plataforma.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Documentación:</strong><br>
      - Políticas de seguridad de la información de la empresa.<br>
      - Estándares OWASP para autenticación, gestión de sesiones y almacenamiento de contraseñas.<br>
      - Certificados SSL/TLS para cifrado de comunicaciones.
    </td>
  </tr>
</table>

<br>

<table border="1" style="border-collapse: collapse; width: 100%;">
  <tr>
    <td style="width: 25%; padding: 8px;"><strong>Identificador:</strong><br>RNF-02</td>
    <td style="width: 25%; padding: 8px;"><strong>Prioridad:</strong><br>Alta</td>
    <td style="width: 50%; padding: 8px;"><strong>Nombre:</strong><br>Desempeño y Alta Disponibilidad</td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Descripción:</strong><br>
      El sistema debe estar preparado para soportar una alta carga de usuarios concurrentes y procesamiento de transacciones (compras) sin degradar su rendimiento. Asimismo, debe asegurar una operación continua y contar con mecanismos de recuperación ante posibles desastres.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Criterios de Aceptación:</strong><br>
      1. El sistema debe soportar hasta 200.000 usuarios concurrentes navegando en la plataforma sin que el tiempo de respuesta supere los límites establecidos.<br>
      2. El sistema debe ser capaz de procesar de manera exitosa hasta 1.000 transacciones por segundo (TPS) durante los procesos de compra.<br>
      3. La arquitectura del sistema debe implementar computación distribuida (ej. balanceadores de carga y microservicios) para distribuir el tráfico.<br>
      4. El sistema debe garantizar un <i>uptime</i> (alta disponibilidad) del 99,7% mensual, medido por herramientas de monitoreo externas.<br>
      5. En caso de caída del servidor principal, el tráfico debe redirigirse automáticamente al centro de datos alterno en un tiempo máximo predefinido.<br>
      6. El sistema debe recuperar su operación normal desde el centro de datos alterno sin pérdida de datos transaccionales confirmados.<br>
      7. Se debe realizar y verificar exitosamente un backup diario de toda la base de datos sin afectar el rendimiento de la aplicación durante la ventana de mayor tráfico.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Documentación:</strong><br>
      - Plan de Recuperación ante Desastres (DRP) y Plan de Continuidad de Negocio (BCP).<br>
      - Acuerdos de Nivel de Servicio (SLA) para infraestructura Cloud.<br>
      - Reportes de pruebas de estrés y de carga (JMeter / K6).
    </td>
  </tr>
</table>

<br>

<table border="1" style="border-collapse: collapse; width: 100%;">
  <tr>
    <td style="width: 25%; padding: 8px;"><strong>Identificador:</strong><br>RNF-03</td>
    <td style="width: 25%; padding: 8px;"><strong>Prioridad:</strong><br>Media</td>
    <td style="width: 50%; padding: 8px;"><strong>Nombre:</strong><br>Interfaz Gráfica y Diseño Adaptativo (Responsive)</td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Descripción:</strong><br>
      La plataforma E-Commerce debe contar con una interfaz gráfica que se adapte correctamente a distintos tamaños de pantalla (especialmente dispositivos móviles). Además, debe permitir la personalización de su imagen corporativa de forma parametrizada sin requerir modificaciones en el código fuente por parte de un desarrollador.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Criterios de Aceptación:</strong><br>
      1. La interfaz del sistema debe renderizarse correctamente en pantallas de dispositivos móviles (smartphones) sin que los elementos se superpongan o se salgan de la pantalla.<br>
      2. La interfaz del sistema debe adaptarse de manera fluida a pantallas de tablets y resoluciones de escritorio estándar.<br>
      3. El administrador debe poder modificar los colores primarios y secundarios de la plataforma desde un panel de configuración, aplicando los cambios inmediatamente.<br>
      4. El administrador debe poder actualizar el logotipo de la empresa cargando una nueva imagen desde el panel, sin necesidad de editar el código fuente.<br>
      5. Los cambios en la imagen corporativa deben reflejarse en todas las vistas de la aplicación para todos los usuarios, manteniendo la consistencia visual.<br>
      6. Los elementos interactivos (botones, enlaces, menús desplegables) deben tener un tamaño táctil adecuado para ser utilizados sin dificultad en dispositivos móviles.<br>
      7. Las imágenes de los productos deben redimensionarse automáticamente para no exceder el ancho de la pantalla en dispositivos con resoluciones menores a 768px.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="padding: 8px;">
      <strong>Documentación:</strong><br>
      - Guía de estilos UI/UX y manual de marca corporativa.<br>
      - Especificaciones de diseño responsivo (puntos de quiebre CSS).<br>
      - Manual de usuario administrador para actualización de parámetros de la interfaz.
    </td>
  </tr>
</table>
