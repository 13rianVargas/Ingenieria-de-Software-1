# 1. Introduccion

## 1.1 Proposito

Este documento describe la arquitectura del sistema de PQRS para SuperMarket usando el modelo 4+1 vistas de Kruchten, extendido con Vista de Datos. Cada vista enfoca un aspecto distinto del sistema y conjuntamente cubren los requerimientos funcionales (RF-01 a RF-12) y no funcionales (RNF-01 a RNF-03) definidos previamente por el equipo.

El documento esta dirigido al docente del curso Ingenieria de Software I, al equipo de desarrollo del Proyecto-Final y a cualquier reviewer tecnico que necesite entender las decisiones de diseño antes de la implementacion del software.

## 1.2 Alcance

El sistema cubre las siguientes capacidades:

- Radicacion de PQRS con anexo PDF, tanto para clientes autenticados como anonimos.
- Registro automatico de clientes nuevos al momento de radicar de forma anonima.
- Autenticacion separada para Cliente (App Movil) y Gestor (App Web).
- Consulta y filtrado del historial propio (Cliente) y de la bandeja general (Gestor).
- Tramitacion de PQRS con cambio de estado y justificacion obligatoria.
- Generacion de reportes PDF de la bandeja, con o sin filtros aplicados.
- Notificaciones automaticas por correo (radicacion, cambio de estado, contraseña autogenerada).

Quedan fuera de alcance las integraciones con sistemas externos de BI, los reportes BAM en tiempo real, los modulos de pagos y las validaciones crediticias. Esos elementos pertenecian al caso de estudio del Taller-6 (E-Commerce Konrad) y no aplican al dominio PQRS.

## 1.3 Glosario

| Termino | Definicion |
|---|---|
| PQRS | Peticion, Queja, Reclamo o Sugerencia. Solicitud que el ciudadano radica ante SuperMarket. |
| Radicado | Numero unico autogenerado por el sistema para hacer seguimiento a una PQRS. Formato PQRS-YYYY-NNNNNN. |
| Anexo | Documento complementario en formato PDF adjunto a una PQRS por el Cliente. |
| Bandeja | Vista web del Gestor con el listado general de todas las PQRS del sistema. |
| Tramite | Cada cambio de estado de una PQRS, incluyendo la justificacion obligatoria y el timestamp. Una PQRS tiene N tramites a lo largo de su ciclo de vida. |
| JWT | JSON Web Token. Token firmado que mantiene la sesion del usuario tras un login exitoso. |
| BCrypt | Algoritmo de hashing de contraseñas recomendado por OWASP. Una sola direccion, no permite recuperacion. |
| NAS | Network Attached Storage. Servidor de almacenamiento compartido en red donde se persisten los PDF adjuntos. |
| AOP | Aspect-Oriented Programming. Separa concerns transversales como auditoria y logging del codigo de negocio. |
| ORM | Object-Relational Mapping. Capa de abstraccion entre objetos del dominio y tablas relacionales. JPA/Hibernate en este sistema. |
| SPA | Single Page Application. Aplicacion web que carga una sola pagina HTML y actualiza contenido dinamicamente sin recargas completas. |

## 1.4 Objetivos arquitectonicos

1. Seguridad: autenticacion robusta con roles, contraseñas cifradas con BCrypt, comunicaciones exclusivamente sobre HTTPS.
2. Mantenibilidad: capas hexagonales que aislan el dominio de la infraestructura; auditoria centralizada via AOP que no contamina el codigo de negocio.
3. Disponibilidad razonable: replica de base de datos para failover y backup diario sin afectar la operacion en produccion.
4. Tecnologia libre de licenciamiento: stack 100% open source basado en OpenJDK, Spring Boot, PostgreSQL, Angular y Nginx.
5. Interoperabilidad: API REST con contratos JSON; preparada para exponer SOAP si se requiere integracion B2B futura.
6. Dos interfaces independientes: App Movil para el Cliente y App Web para el Gestor.

## 1.5 Restricciones arquitectonicas

- Stack 100% open source: Java OpenJDK 17, Spring Boot 3.x, Angular 20, Ionic 8, Tailwind CSS, PostgreSQL 15+.
- Comunicaciones externas exclusivamente sobre HTTPS (TCP 443).
- Persistencia con ORM obligatoria; se selecciona JPA con Hibernate.
- Servidor de aplicaciones avalado por el cliente; se utiliza Tomcat embebido provisto por Spring Boot.
- Dos interfaces de presentacion independientes: App Movil orientada al Cliente y App Web orientada al Gestor.
