# PLANNING POKER (ESTIMACIÓN DE FUNCIONALIDADES)

## Historial de Versiones

| Versión | Fecha | Descripción Cambio |
| :--- | :--- | :--- |
| 01 | 12/04/2026 | Creación inicial (commit `b7e392f`): estimación Fibonacci de **17 HU** (12 MVP + 5 mejoras post-MVP). Total **45 SP**. HU-04 = 3, HU-07 = 3, HU-08 = 2 en versión original. |
| 02 | (intermedia) | Eliminación de HU-13..HU-17 (mejoras post-MVP movidas a `2-MVP.md` como Incrementos Posteriores) y reestimación de HU-04 (3→2), HU-07 (3→2), HU-08 (2→1). El total no fue recalculado (quedó como 45 SP por error). |
| 03 | 19/05/2026 | Revisión preparación SPMP: **corrección del total a 32 SP** (suma real de las 12 HU MVP actuales: 5+2+3+2+1+2+2+1+2+2+5+5 = 32). Suma de historial. |

---

La siguiente estimación se realizará utilizando la secuencia de Fibonacci (1, 2, 3, 5, 8, 13...).
Se toma como pivote la historia **HU-05 (Filtrar Radicados Propios)** con un valor de **1 Punto de Historia (SP)**, equivalente a 9 horas de trabajo efectivo.

La tabla presenta la estimación acordada por el equipo tras discutir los retos técnicos.

| ID | Título de la Historia de Usuario | Estimación (Fibonacci) |
|:---|:---|:---:|
| **HU-01** | Radicar PQRS (con anexo PDF) | 5 |
| **HU-02** | Registro Automático de Cliente | 2 |
| **HU-03** | Autenticación de Cliente (Login) | 3 |
| **HU-04** | Consultar Historial de Radicados | 2 |
| **HU-05** | Filtrar Radicados Propios *(HU Base)* | **1** |
| **HU-06** | Autenticación de Gestor (Login) | 2 |
| **HU-07** | Consultar Bandeja de Radicados | 2 |
| **HU-08** | Filtrar Bandeja de Radicados | 1 |
| **HU-09** | Descargar Anexo de PQRS | 2 |
| **HU-10** | Gestionar Estado de PQRS | 2 |
| **HU-11** | Generar Reporte de Radicados (PDF) | 5 |
| **HU-12** | Notificación de Confirmación (Correo) | 5 |

| | **TOTAL PUNTOS DE HISTORIA (SP)** | **32 SP** |

> **Nota**: las funcionalidades #13 a #17 (Recuperar Contraseña, Cambiar Contraseña, Cerrar Sesión, Notificación de Cambio de Estado, Registro Manual) son **mejoras post-MVP** y no están incluidas en este Planning Poker. Ver `1-Funcionalidades.md` y `2-MVP.md` para el detalle de qué queda fuera del compromiso del MVP.