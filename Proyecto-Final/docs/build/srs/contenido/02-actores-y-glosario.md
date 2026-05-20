# 2. Actores y Glosario

## 2.1 Actores del Sistema

| Actor | Descripción | Requerimientos Asociados |
| :--- | :--- | :--- |
| Cliente (Ciudadano) | Actor principal. Persona natural que utiliza la App Móvil para registrar, consultar y radicar sus PQRS. | RF-01, RF-03, RF-04, RF-05 |
| Gestor de PQRS | Empleado de SuperMarket que utiliza la Aplicación Web para gestionar, tramitar y revisar las solicitudes ingresadas. | RF-06, RF-07, RF-08, RF-09, RF-10, RF-11 |
| Sistema | Actor secundario automático que dispara eventos del backend: envío de correos, generación de contraseñas, persistencia automática de registros. | RF-02, RF-12 |

## 2.2 Glosario de Términos

| Término | Descripción |
| :--- | :--- |
| PQRS | Peticiones, Quejas, Reclamos o Sugerencias. Motivo principal del contacto del cliente con SuperMarket. |
| Radicado | Número único autogenerado por el sistema utilizado para hacer seguimiento a una PQRS. Formato `PQRS-YYYY-NNNNNN`. |
| Anexo | Documento complementario (exclusivamente en formato PDF, máx. 5 MB) adjunto a la PQRS por el Cliente. |
| Estado del Radicado | Condición en la que se encuentra la PQRS (Nuevo, En proceso, Resuelto, Rechazado). |
| Bandeja de Entrada | Vista de la Aplicación Web donde el Gestor visualiza el listado general de todas las PQRS. |
| HU | Historia de Usuario. Descripción funcional desde la perspectiva del actor: "Como X, quiero Y, para Z". |
| CA | Criterios de Aceptación. Condiciones verificables que un RF debe cumplir para considerarse implementado. Formato Dado/Cuando/Entonces. |
| MVP | Minimum Viable Product. Subconjunto mínimo de funcionalidades suficiente para entregar valor y validar el sistema. En este proyecto: las 12 funcionalidades obligatorias. |
| Sprint | Iteración de duración fija (2 semanas) en la cual el equipo entrega un incremento del producto. |
| JWT | JSON Web Token. Estándar de token firmado utilizado para mantener la sesión del usuario autenticado sin estado en el servidor. |
| BCrypt | Algoritmo de hashing de contraseñas con factor de costo configurable. Usado para almacenar `usuario.clave_hash` (cost 12). |
| JPA / Hibernate | Java Persistence API y su implementación de referencia. ORM utilizado por el backend Spring Boot para mapear entidades de dominio a tablas relacionales. |
| AOP | Aspect-Oriented Programming. Patrón usado por el módulo de auditoría para interceptar operaciónes CRUD del dominio sin acoplar código. |
| NAS | Network Attached Storage. Sistema de archivos compartido donde se almacenan los PDFs adjuntos de las PQRS (la BD solo guarda la metadata). |
| SMTP / SMTPS | Protocolo de envío de correo electrónico. SMTPS es la variante sobre TLS, usada por el módulo de notificaciónes. |
| ORM | Object-Relational Mapping. Capa entre objetos del dominio y tablas relacionales. |
| RF | Requerimiento Funcional. Especifica una acción que el sistema debe ejecutar. |
| RNF | Requerimiento No Funcional. Especifica una restricción transversal (calidad, rendimiento, seguridad, integración). |
| SRS | Software Requirements Specification (este documento). |
| SAD | Software Architecture Document (`9-Arquitectura-PQRS.md`). |
| STP | Software Test Plan (`12-Plan-Pruebas-PQRS.md`). |
