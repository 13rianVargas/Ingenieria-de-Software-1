# 2. Catálogo de Funcionalidades

## Historial de Versiónes

| Versión | Fecha | Descripción Cambio |
| :--- | :--- | :--- |
| 01 | 12/05/2026 | Creación inicial del catálogo con 17 funcionalidades (12 MVP + 5 mejoras) agrupadas por actor. |
| 02 | 19/05/2026 | Revisión preparación SPMP: restructuración con headers H2 explícitos ("Funcionalidades obligatorias (MVP)" + "Mejoras post-MVP"), suma de historial. |

---

##  obligatorias (MVP)

Las 12 funcionalidades que el equipo se compromete a entregar como parte del MVP. Cada una está mapeada a un RF en `7-Requerimientos-Funcionales.md`.

### Cliente (App Móvil)

#### 1. Radicar PQRS
Permite diligenciar el formulario e información de la PQRS (tipo, comentarios y anexo en PDF). Si el usuario se encuentra autenticado, el sistema autocompleta los datos personales del cliente (tipo y número de identificación, nombre, correo, teléfono móvil); de lo contrario, el usuario anónimo debe diligenciarlos manualmente.

#### 2. Registro Automático de Cliente
Si el cliente no existe en la base de datos al momento de radicar, el sistema lo registra automáticamente.

#### 3. Autenticación de Cliente (Login)
Ingreso a la App usando el número de identificación y la contraseña autogenerada enviada al correo.

#### 4. Consultar Historial de Radicados
Visualización del listado de PQRS del cliente con sus respectivos detalles (estado, justificación, anexo, etc.).

#### 5. Filtrar Radicados Propios
Búsqueda dentro del historial de radicados del cliente utilizando el número de radicado.

### Gestor de PQRS (Aplicación Web)

#### 6. Autenticación de Gestor (Login)
Ingreso al panel de administración mediante credenciales (usuario y contraseña).

#### 7. Consultar Bandeja de Radicados
Visualización del listado general de todas las PQRS registradas en el sistema.

#### 8. Filtrar Bandeja de Radicados
Búsqueda de PQRS en la bandeja general utilizando filtros por "Tipo de radicado" y "Estado".

#### 9. Descargar Anexo de PQRS
Descarga del documento PDF adjunto por el cliente en un radicado específico.

#### 10. Gestionar Estado de PQRS
Cambio del estado de un radicado (Nuevo, En proceso, Resuelto, Rechazado) con ingreso obligatorio de una justificación.

#### 11. Generar Reporte de Radicados (PDF)
Exportación de la vista actual de la bandeja de radicados (con o sin filtros) a un documento PDF.

### Sistema (Automático)

#### 12. Notificación de Confirmación (Correo)
Envío automático de correo electrónico al cliente confirmando la radicación, enviando el número de radicado y la contraseña autogenerada.

---

## Mejoras post-MVP

Funcionalidades adicionales identificadas durante el análisis. Se entregarán solo si el cronograma del MVP lo permite, o en sprints posteriores. **No forman parte del compromiso de entrega del MVP** y no están trazadas en los RFs ni en los Casos de Uso del MVP.

### 13. Recuperar Contraseña (App/Web)
Permite restablecer el acceso enviando un enlace o nueva contraseña temporal al correo electrónico, asumiendo que el usuario puede olvidar la contraseña autogenerada.

### 14. Cambiar Contraseña (App/Web)
Permite al Cliente actualizar la contraseña autogenerada por una de su preferencia para mayor seguridad.

### 15. Cerrar Sesión (App/Web)
Destrucción segura de la sesión activa para evitar accesos no autorizados.

### 16. Notificación de Cambio de Estado (Correo)
Envío automático de un correo electrónico al cliente informando cuando el Gestor de PQRS actualice el estado de su radicado (incluyendo la justificación).

### 17. Registro Manual de Cliente (App)
Permite a un usuario registrarse en la aplicación diligenciando sus datos personales básicos (tipo y número de identificación, nombre, correo, teléfono móvil) de forma independiente a la radicación de una PQRS.
