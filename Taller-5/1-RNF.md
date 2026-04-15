# Especificación de Requerimientos No Funcionales

A continuación se presentan tres (3) requerimientos no funcionales extraídos del contexto del sistema de información E-Commerce, con sus respectivos criterios de aceptación.

## RNF-01: Seguridad en Autenticación y Contraseñas

**Descripción:**  
El sistema debe garantizar la seguridad en el acceso de los usuarios mediante un módulo de autenticación robusto. Esto incluye la gestión de perfiles, permisos, validación de contraseñas seguras y el cifrado de las mismas en la base de datos, así como garantizar que la comunicación se realice a través de canales seguros.

**Criterios de Aceptación:**
1. El sistema debe validar que toda contraseña ingresada por un usuario tenga una longitud mínima de 8 caracteres.
2. El sistema debe rechazar contraseñas que no contengan al menos una letra mayúscula.
3. El sistema debe rechazar contraseñas que no contengan al menos una letra minúscula.
4. El sistema debe rechazar contraseñas que no contengan al menos un carácter numérico.
5. El sistema debe almacenar todas las contraseñas en la base de datos utilizando un algoritmo de encriptación estándar (ej. bcrypt, Argon2).
6. El sistema debe denegar el acceso a usuarios cuyas credenciales no coincidan con las almacenadas en la base de datos.
7. El sistema debe restringir el acceso a funcionalidades específicas dependiendo del perfil o rol asignado al usuario autenticado (ej. Administrador, Director Comercial, Vendedor, Comprador).
8. El sistema debe forzar el uso del protocolo HTTPS para todas las peticiones de autenticación y transacciones dentro de la plataforma.

---

## RNF-02: Desempeño y Alta Disponibilidad

**Descripción:**  
El sistema debe estar preparado para soportar una alta carga de usuarios concurrentes y procesamiento de transacciones (compras) sin degradar su rendimiento. Asimismo, debe asegurar una operación continua y contar con mecanismos de recuperación ante posibles desastres.

**Criterios de Aceptación:**
1. El sistema debe soportar hasta 200.000 usuarios concurrentes navegando en la plataforma sin que el tiempo de respuesta supere los límites establecidos.
2. El sistema debe ser capaz de procesar de manera exitosa hasta 1.000 transacciones por segundo (TPS) durante los procesos de compra.
3. La arquitectura del sistema debe implementar computación distribuida (ej. balanceadores de carga y microservicios) para distribuir el tráfico.
4. El sistema debe garantizar un *uptime* (alta disponibilidad) del 99,7% mensual, medido por herramientas de monitoreo externas.
5. En caso de caída del servidor principal, el tráfico debe redirigirse automáticamente al centro de datos alterno en un tiempo máximo predefinido.
6. El sistema debe recuperar su operación normal desde el centro de datos alterno sin pérdida de datos transaccionales confirmados.
7. Se debe realizar y verificar exitosamente un backup diario de toda la base de datos sin afectar el rendimiento de la aplicación durante la ventana de mayor tráfico.

---

## RNF-03: Interfaz Gráfica y Diseño Adaptativo (Responsive)

**Descripción:**  
La plataforma E-Commerce debe contar con una interfaz gráfica que se adapte correctamente a distintos tamaños de pantalla (especialmente dispositivos móviles). Además, debe permitir la personalización de su imagen corporativa de forma parametrizada sin requerir modificaciones en el código fuente por parte de un desarrollador.

**Criterios de Aceptación:**
1. La interfaz del sistema debe renderizarse correctamente en pantallas de dispositivos móviles (smartphones) sin que los elementos se superpongan o se salgan de la pantalla (Diseño Responsive).
2. La interfaz del sistema debe adaptarse de manera fluida a pantallas de tablets y resoluciones de escritorio estándar.
3. El administrador debe poder modificar los colores primarios y secundarios de la plataforma desde un panel de configuración, aplicando los cambios inmediatamente.
4. El administrador debe poder actualizar el logotipo de la empresa cargando una nueva imagen desde el panel, sin necesidad de editar el código fuente.
5. Los cambios en la imagen corporativa deben reflejarse en todas las vistas de la aplicación para todos los usuarios, manteniendo la consistencia visual.
6. Los elementos interactivos (botones, enlaces, menús desplegables) deben tener un tamaño táctil adecuado para ser utilizados sin dificultad en dispositivos móviles.
7. Las imágenes de los productos deben redimensionarse automáticamente para no exceder el ancho de la pantalla en dispositivos con resoluciones menores a 768px.