# 1. introducción

## 1.1 Propósito

Este documento describe la arquitectura del sistema de PQRS para SuperMarket usando el modelo 4+1 vistas de Kruchten, extendido con Vista de Datos. Cada vista enfoca un aspecto distinto del sistema y conjuntamente cubren los requerimientos funcionales (RF-01 a RF-12) y no funcionales (RNF-01 a RNF-03) definidos previamente por el equipo.

El documento esta dirigido al docente del curso Ingenieria de Software I, al equipo de desarrollo del Proyecto-Final y a cualquier reviewer técnico que necesite entender las decisiones de diseño antes de la implementacion del software.

## 1.2 Alcance

El sistema cubre las siguientes capacidades:

- radicación de PQRS con anexo PDF, tanto para clientes autenticados como anónimos.
- Registro automático de clientes nuevos al momento de radicar de forma anonima.
- autenticación separada para Cliente (App Móvil) y Gestor (App Web).
- Consulta y filtrado del historial propio (Cliente) y de la bandeja general (Gestor).
- Tramitacion de PQRS con cambio de estado y justificación obligatoria.
- Generación de reportes PDF de la bandeja, con o sin filtros aplicados.
- Notificaciónes automáticas por correo (radicación, cambio de estado, contraseña autogenerada).

Quedan fuera de alcance las integraciones con sistemas externos de BI, los reportes BAM en tiempo real, los módulos de pagos y las validaciones crediticias. No aplican al dominio PQRS.

## 1.3 Glosario

| Termino | Definicion |
|---|---|
| PQRS | Peticion, Queja, Reclamo o Sugerencia. Solicitud que el ciudadano radica ante SuperMarket. |
| Radicado | Numero único autogenerado por el sistema para hacer seguimiento a una PQRS. Formato PQRS-YYYY-NNNNNN. |
| Anexo | Documento complementario en formato PDF adjunto a una PQRS por el Cliente. |
| Bandeja | Vista web del Gestor con el listado general de todas las PQRS del sistema. |
| Trámite | Cada cambio de estado de una PQRS, incluyendo la justificación obligatoria y el timestamp. Una PQRS tiene N trámites a lo largo de su ciclo de vida. |
| JWT | JSON Web Token. Token firmado que mantiene la sesion del usuario tras un login exitoso. |
| BCrypt | Algoritmo de hashing de contraseñas recomendado por OWASP. Una sola direccion, no permite recuperacion. |
| NAS | Network Attached Storage. Servidor de almacenamiento compartido en red donde se persisten los PDF adjuntos. |
| AOP | Aspect-Oriented Programming. Separa concerns transversales como auditoría y logging del código de negocio. |
| ORM | Object-Relational Mapping. Capa de abstraccion entre objetos del dominio y tablas relacionales. JPA/Hibernate en este sistema. |
| SPA | Single Page Application. Aplicacion web que carga una sola pagina HTML y actualiza contenido dinamicamente sin recargas completas. |

## 1.4 Objetivos arquitectónicos

1. Seguridad: autenticación robusta con roles, contraseñas cifradas con BCrypt, comunicaciónes exclusivamente sobre HTTPS.
2. Mantenibilidad: capas hexagonales que aislan el dominio de la infraestructura; auditoría centralizada via AOP que no contamina el código de negocio.
3. Disponibilidad razonable: replica de base de datos para failover y backup diario sin afectar la operación en producción.
4. Tecnologia libre de licenciamiento: stack 100% open source basado en OpenJDK, Spring Boot, PostgreSQL, Angular y Nginx.
5. Interoperabilidad: API REST con contratos JSON; preparada para exponer SOAP si se requiere integracion B2B futura.
6. Dos interfaces independientes: App Móvil para el Cliente y App Web para el Gestor.

## 1.5 Restricciones arquitectónicas

- Stack 100% open source: Java OpenJDK 17, Spring Boot 3.x, Angular 20, Ionic 8, Tailwind CSS, PostgreSQL 15+.
- Comunicaciónes externas exclusivamente sobre HTTPS (TCP 443).
- Persistencia con ORM obligatoria; se selecciona JPA con Hibernate.
- Servidor de aplicaciones avalado por el cliente; se utiliza Tomcat embebido provisto por Spring Boot.
- Dos interfaces de presentacion independientes: App Móvil orientada al Cliente y App Web orientada al Gestor.
