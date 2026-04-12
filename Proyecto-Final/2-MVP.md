# PRODUCTO MÍNIMO VIABLE (MVP)

Para garantizar la entrega de valor funcional alineada a la solicitud del cliente SuperMarket (flujo básico de recepción, notificación y gestión de PQRS), el desarrollo se ha dividido en un Producto Mínimo Viable (MVP) y un bloque de Incrementos o entregas posteriores.

## Funcionalidades del MVP (Primera Salida)

Este MVP compone el flujo core o crítico del negocio que permite al cliente final (Ciudadano) enviar una solicitud y al gestor tramitarla.

*   **1. Radicar PQRS:** Permite diligenciar el formulario y adjuntar el anexo en PDF.
*   **2. Registro Automático de Cliente:** Si el cliente no existe al momento de radicar, el sistema lo registra.
*   **3. Autenticación de Cliente (Login):** Ingreso seguro a la App usando la contraseña autogenerada.
*   **4. Consultar Historial de Radicados:** Visualización del listado de PQRS del cliente.
*   **6. Autenticación de Gestor (Login):** Ingreso al panel de administración para poder gestionar los casos.
*   **7. Consultar Bandeja de Radicados:** Visualización del listado general de todas las PQRS registradas en el sistema.
*   **10. Gestionar Estado de PQRS:** Capacidad para que el Gestor cambie el estado de un radicado (ingresando la justificación respectiva).
*   **12. Notificación de Confirmación (Correo):** Envío automático de correo con las credenciales y el número de radicado.

---

## Incrementos Posteriores (Post-MVP)

Estas funcionalidades se implementarán en sprints posteriores, enfocándose en la usabilidad, filtrado avanzado, exportación y mejoras de seguridad propuestas por el equipo.

*   **5. Filtrar Radicados Propios:** Filtros dentro del historial del cliente.
*   **8. Filtrar Bandeja de Radicados:** Búsqueda avanzada por "Tipo" y "Estado" para el Gestor.
*   **9. Descargar Anexo de PQRS:** Capacidad del gestor para revisar los documentos adjuntos detallados.
*   **11. Generar Reporte de Radicados (PDF):** Exportación de datos de gestión para auditoría o administración.
*   **13. Recuperar Contraseña (App/Web):** *Supuesto de mejora.* Restauración de credenciales olvidadas.
*   **14. Cambiar Contraseña (App):** *Supuesto de mejora.* Mayor nivel de seguridad para la contraseña inicial enviada.
*   **15. Cerrar Sesión (App/Web):** *Supuesto de mejora.* Cierre seguro del token de sesión.
*   **16. Notificación de Cambio de Estado (Correo):** *Supuesto de mejora.* Informar pasivamente al cliente sobre el cambio de estado de su solicitud.
*   **17. Registro Manual de Cliente (App):** *Supuesto de mejora.* Creación de cuenta en la App de manera independiente al proceso de radicación de una PQRS.