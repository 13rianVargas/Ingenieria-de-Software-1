# HISTORIA DE USUARIO BASE (PIVOTE)

Para realizar la estimación del proyecto mediante Planning Poker, se ha seleccionado la funcionalidad más sencilla del sistema como la **Historia de Usuario Base**, a la cual se le asigna un valor de **1 Punto de Historia (Story Point)**.

## 1. Definición de la Historia de Usuario

*   **ID:** HU-05
*   **Nombre:** Filtrar Radicados Propios en App Móvil
*   **Funcionalidad Asociada:** 5. Filtrar Radicados Propios

**Descripción:**
> **Como** Cliente de SuperMarket,  
> **Quiero** filtrar el listado de mis PQRS radicadas utilizando el número de radicado,  
> **Para** encontrar rápidamente una solicitud específica sin tener que buscar manualmente en toda la lista.

## 2. Estimación PERT - Juicio de Expertos

A continuación, se detalla el desglose de tareas para la HU base y su estimación en horas (O=Optimista, M=Probable, P=Pesimista). Esta estimación total en horas equivaldrá a **1 Punto de Historia** para el equipo.

| Tarea | Tiempo Pesimista (P) | Tiempo Probable (M) | Tiempo Optimista (O) | (P + 4M + O) / 6 |
|-------|----------------------|---------------------|----------------------|------------------|
| Elaborar doc. HU | 1 | 0.5 | 0.25 | 0.54 |
| Prototipo Mockup (Barra de búsqueda) | 1 | 0.5 | 0.25 | 0.54 |
| Arquitectura (Definir endpoint/filtro) | 1 | 0.5 | 0.25 | 0.54 |
| Desarrollar el backend (Query filtrado) | 3 | 2 | 1 | 2.00 |
| Desarrollar el front end (Input text) | 2 | 1 | 0.5 | 1.08 |
| Integrar el front con el back | 2 | 1 | 0.5 | 1.08 |
| Pruebas unitarias | 2 | 1 | 0.5 | 1.08 |
| Pruebas de QA | 2 | 1 | 0.5 | 1.08 |
| Manual de usuario y técnico | 1 | 0.5 | 0.25 | 0.54 |
| Desplegar | 1 | 0.5 | 0.25 | 0.54 |
| **Total Estimado** | **16** | **8.5** | **4.25** | **9.04** |

**Estimación PERT Final de la HU Base: 9.04 ≈ 9 HORAS**

**Conclusión:** Para este equipo, **1 Punto de Historia equivale aproximadamente a 9 horas de trabajo efectivo.**