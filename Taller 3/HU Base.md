# Planning Poker - Monitoreo Auditoría

## Contexto: E-Commerce Administrador Konrad

### Referencia Base
| Historia de Referencia | Estimación PERT | Fibonacci |
|------------------------|-----------------|-----------|
| Autenticación del administrador | 26.49 PHU | **1** |

---

## Historias de Usuario - Proceso de Monitoreo Auditoría

| ID | Historia de Usuario | Descripción | Fibonacci | Justificación |
|----|---------------------|-------------|-----------|---------------|
| HU-MA-01 | Autenticación del administrador | Como administrador, quiero autenticarme en el sistema para acceder a las funciones de auditoría | **1** | Referencia base PERT (26.49 PHU). Incluye login, validación, sesiones y roles |
| HU-MA-02 | Acceder al módulo de auditoría | Como administrador autenticado, quiero acceder al módulo de auditoría para gestionar los registros | **1** | Complejidad similar: navegación con verificación de permisos |
| HU-MA-03 | Definir criterios de consulta | Como administrador, quiero definir criterios de búsqueda (usuario, acción, fecha, hora) para filtrar registros | **1** | Complejidad similar: formulario con campos de filtro |
| HU-MA-04 | Consultar todos los registros | Como administrador, quiero consultar todos los registros disponibles cuando no ingreso criterios | **2** | Más complejo: query a BD, paginación, manejo de volúmenes de datos |
| HU-MA-05 | Filtrar registros de auditoría | Como administrador, quiero filtrar registros por usuario, acción, fecha u hora | **2** | Más complejo: lógica de filtrado múltiple, combinación de criterios |
| HU-MA-06 | Mostrar listado de registros | Como administrador, quiero ver un listado ordenado de los registros de auditoría | **1** | Complejidad similar: renderizado de tabla y ordenamiento |
| HU-MA-07 | Ver detalle de un registro | Como administrador, quiero ver el detalle completo de un registro (Acción, Usuario, Fecha, Hora) | **1** | Complejidad similar: vista modal o detalle simple |
| HU-MA-08 | Exportar reporte de auditoría | Como administrador, quiero exportar el reporte de auditoría para análisis externo | **3** | Más complejo: generación de archivo (PDF/Excel), formato, descarga |

---

## Resumen de Estimación

| Escala Fibonacci | Cantidad HU | Historias |
|------------------|-------------|-----------|
| 1 | 5 | HU-MA-01, HU-MA-02, HU-MA-03, HU-MA-06, HU-MA-07 |
| 2 | 2 | HU-MA-04, HU-MA-05 |
| 3 | 1 | HU-MA-08 |

**Total Puntos de Historia: 1+1+1+2+2+1+1+3 = 12 puntos**

---

## Escala Fibonacci de Referencia (basada en Autenticación = 1)

```
1 - Complejidad base (≈26.49 PHU) - Ej: Autenticación administrador
2 - Doble complejidad (≈53 PHU)
3 - Triple complejidad (≈79 PHU)
5 - 5x complejidad (≈132 PHU)
8 - 8x complejidad (≈212 PHU)
13 - 13x complejidad (≈344 PHU)
21 - 21x complejidad (≈556 PHU)
```
