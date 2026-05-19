# 1. Introducción

## 1.1 Propósito

Este documento es la **Especificación de Requisitos del Software (SRS)** para el Sistema de PQRS de SuperMarket. Define qué debe hacer el sistema, qué restricciones cumple, qué actores interactúan con él y qué interfaces de usuario debe ofrecer. Su audiencia primaria es el equipo de desarrollo (backend, frontend web y móvil), el cliente (SuperMarket) y el docente del curso de Ingeniería de Software I.

El SRS sigue de manera adaptada el estándar **IEEE 830** para Especificaciones de Requisitos del Software, incorporando elementos modernos como Historias de Usuario, Criterios de Aceptación en formato Dado/Cuando/Entonces, y Quality Attribute Scenarios para los requisitos no funcionales.

## 1.2 Alcance del producto

El sistema de PQRS permite a los **Clientes** (ciudadanos) radicar Peticiones, Quejas, Reclamos y Sugerencias contra los productos y servicios de SuperMarket desde una App Móvil, y a los **Gestores de PQRS** atender, tramitar y reportar sobre esas radicaciones desde una Aplicación Web. El sistema apoya la política institucional de "Cero Papel" y reduce la fricción del trámite presencial.

Cubre 12 funcionalidades obligatorias agrupadas en 7 Casos de Uso del MVP (CU-01 a CU-07). Quedan fuera de alcance del MVP las funcionalidades #13 a #17 (Recuperar Contraseña, Cambiar Contraseña, Cerrar Sesión, Notificación de Cambio de Estado y Registro Manual Independiente), agrupadas en el CU-08 que se conserva como referencia para iteraciones posteriores.

## 1.3 Definiciones, acrónimos y referencias

Las definiciones técnicas y de dominio se centralizan en el **Glosario** (sección 2.2). Las referencias cruzadas a otros documentos del proyecto:

- [`Proyecto-Final/docs/0-Contexto-Proyecto-Final.md`](../../0-Contexto-Proyecto-Final.md) — Enunciado y criterios de aceptación del cliente.
- [`Proyecto-Final/docs/9-Arquitectura-PQRS.md`](../../9-Arquitectura-PQRS.md) — SAD (Software Architecture Document) que materializa los requisitos.
- [`Proyecto-Final/docs/12-Plan-Pruebas-PQRS.md`](../../12-Plan-Pruebas-PQRS.md) — STP (Software Test Plan) que valida la implementación.

## 1.4 Estructura del documento

| Sección | Contenido |
| :--- | :--- |
| 1 | Introducción, propósito, alcance |
| 2 | Actores del sistema y glosario de términos |
| 3 | Requerimientos Funcionales (RF-01 a RF-12) con Historia de Usuario + Criterios de Aceptación |
| 4 | Requerimientos No Funcionales (RNF-01 a RNF-03) con Quality Attribute Scenarios |
| 5 | Diagrama de Casos de Uso (vista general) |
| 6 | Especificación de Casos de Uso (CU-01 a CU-07 del MVP + CU-08 fuera de alcance) |
| 7 | Cumplimiento de RNF — mapeo a decisiones arquitectónicas |
| 8 | Anexo: Prototipos (mockups HTML de App Móvil y Aplicación Web) |
