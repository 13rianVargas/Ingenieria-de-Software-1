# 7. Vista de Datos

El modelo entidad-relación completo, con todos los atributos, constraints, indices y diccionario de datos vive en la **sección 8** de este mismo documento (Modelo Entidad-Relación). Esta sección solo resume las entidades principales y sus relaciónes para contextualizar la arquitectura.

## 7.1 Entidades principales

| Entidad | descripción |
|---|---|
| usuario | Centraliza Cliente, Gestor y Admin. Discriminado por el atributo `rol` (CHECK enum, sin tabla catalogo separada). Almacena hash de clave (BCrypt). |
| pqrs | Cabecera de cada radicado. Estado actual, tipo, fechas, FK al cliente y al gestor asignado. |
| trámite | Log de cambios de estado de la PQRS. Una PQRS tiene N trámites. Incluye estado anterior, estado nuevo, justificación, timestamp y gestor responsable. |
| adjunto | Metadata del PDF adjunto: nombre, ruta NAS, mime, tamaño. El archivo binario vive en NAS, no en BD. |
| notificación | Cola de envio de correos. Estado para reintentos en caso de falla SMTP. |
| auditoría | Log técnico genérico de operaciónes CRUD. Generado por AOP. |

## 7.2 Diferencia entre trámite y auditoría

Aunque ambas tablas parecen similares, cumplen roles distintos:

- trámite es el log de NEGOCIO. Es visible al Cliente. Sirve para que el cliente entienda el ciclo de vida de su PQRS (paso a en_proceso con tal justificación, paso a resuelto con tal otra justificación). Lo escribe el dominio explicitamente.
- auditoría es el log TÉCNICO. Es interno. Sirve para investigaciones forenses y trazabilidad de quien hizo que en el sistema. Se genera automaticamente por AOP en TODA operación CRUD.

## 7.3 Decision: archivos PDF fuera de la BD

Los PDF adjuntos a las PQRS NO se almacenan como BLOB en PostgreSQL. Se almacenan en NAS y la BD guarda únicamente la ruta. Razones:

- Crecimiento del 200% en archivos no afecta el tamaño de las tablas.
- Backup de BD se mantiene pequeño y rápido.
- Los archivos se pueden servir directamente desde Nginx sin pasar por la API si se requiere optimizar.
- Cumple criterio del RNF-01: persistencia con ORM para datos relacionales, almacenamiento separado para archivos.
