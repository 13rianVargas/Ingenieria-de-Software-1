# RESUMEN Y CATÁLOGO DE CASOS DE USO

## Historial de Versiones

| Versión | Fecha | Descripción Cambio |
| :--- | :--- | :--- |
| 01 | 12/05/2026 | Creación inicial del catálogo con 8 Casos de Uso y 3 actores. |
| 02 | 19/05/2026 | Revisión preparación SRS: ajuste alcance CU-01 a solo registro automático (MVP), corrección de ruta de diagrama general (de `imagenes-diagramas/RESUMEN.png` a `../diagramas/arquitectura/1-vista-casos-uso.png`), suma de historial. |
| 03 | 19/05/2026 | CU-08 (Gestionar Seguridad de la Cuenta) sacado del alcance MVP. Las HU 13, 14 y 15 que cubre están clasificadas como "Supuesto de mejora" en `1-Funcionalidades.md`; CU-08 entra al alcance solo cuando el equipo planifique esas mejoras en un sprint posterior. El MVP cubre 7 CU (CU-01..CU-07). |

## 1. Introducción
Este documento centraliza los Casos de Uso (CU) definidos para el sistema de PQRS de SuperMarket, abarcando las funcionalidades tanto de la App Móvil (Cliente) como de la Aplicación Web (Gestor). 

## 2. Actores del Sistema
Los actores identificados que interactúan con las funcionalidades descritas son:

1. **Cliente (Ciudadano):** Actor principal. Persona natural que utiliza la App Móvil para registrar, consultar y radicar sus peticiones, quejas, reclamos y sugerencias.
2. **Gestor de PQRS:** Actor principal (Administrador). Empleado de SuperMarket que utiliza la Aplicación Web para gestionar, tramitar y dar respuesta a las solicitudes ingresadas.
3. **Sistema:** Actor secundario/automático. Componente del sistema encargado de disparar eventos automáticos como el envío de correos electrónicos.

## 3. Catálogo de Casos de Uso
Con base en las 17 funcionalidades iniciales (12 obligatorias del MVP + 5 mejoras), se han estructurado **8 Casos de Uso** en total, de los cuales **7 están dentro del alcance MVP** (CU-01 a CU-07) y **1 queda fuera de alcance MVP** como referencia para iteraciones futuras (CU-08).

### Dentro de alcance MVP (7 CU)

*   **[CU-01] Gestionar Registro de Cliente:** Abarca el registro automático del Cliente en la base de datos al momento de radicar si no existe. El registro manual desde pantalla independiente queda **fuera de alcance MVP**.
*   **[CU-02] Autenticarse en el Sistema:** Proceso de login tanto para Clientes (App) como para Gestores (Web).
*   **[CU-03] Radicar PQRS:** Flujo principal de creación de la PQRS (incluye adjuntar PDF y la notificación automática de confirmación).
*   **[CU-04] Consultar PQRS Propias:** Listado y filtrado del historial de PQRS de un Cliente específico en la App.
*   **[CU-05] Gestionar Bandeja de Entrada:** Listado y filtrado general de PQRS para el Gestor en la Web.
*   **[CU-06] Tramitar PQRS:** Descarga de anexos y cambio de estado de una solicitud por parte del Gestor (incluyendo notificación de cambio al Cliente).
*   **[CU-07] Generar Reportes:** Exportación a PDF de la bandeja filtrada/no filtrada (Gestor).

### Fuera de alcance MVP (1 CU)

*   **[CU-08] Gestionar Seguridad de la Cuenta:** Recuperación de contraseña, cambio de credenciales y cierre de sesión. Cubre HU-13, HU-14 y HU-15, clasificadas como *"Supuesto de mejora"* en `1-Funcionalidades.md`. Especificación conservada como referencia para iteraciones post-MVP.

---

## 4. Diagrama General de Casos de Uso

![Diagrama general](../diagramas/arquitectura/1-vista-casos-uso.png)