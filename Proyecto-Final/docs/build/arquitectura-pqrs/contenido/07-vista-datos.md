# 7. Vista de Datos

El modelo entidad-relacion completo, con todos los atributos, constraints, indices y diccionario de datos vive en el documento `11-Modelo-Entidad-Relacion.md` del proyecto. Esta seccion solo resume las entidades principales y sus relaciones para contextualizar la arquitectura.

## 7.1 Entidades principales

| Entidad | Descripcion |
|---|---|
| usuario | Centraliza Cliente, Gestor y Admin. Discriminado por rol_id. Almacena hash de clave (BCrypt). |
| rol | Catalogo de roles del sistema (cliente, gestor, admin). |
| pqrs | Cabecera de cada radicado. Estado actual, tipo, fechas, FK al cliente y al gestor asignado. |
| tramite | Log de cambios de estado de la PQRS. Una PQRS tiene N tramites. Incluye estado anterior, estado nuevo, justificacion, timestamp y gestor responsable. |
| adjunto | Metadata del PDF adjunto: nombre, ruta NAS, mime, tamaño. El archivo binario vive en NAS, no en BD. |
| notificacion | Cola de envio de correos. Estado para reintentos en caso de falla SMTP. |
| auditoria | Log tecnico generico de operaciones CRUD. Generado por AOP. |

## 7.2 Diferencia entre tramite y auditoria

Aunque ambas tablas parecen similares, cumplen roles distintos:

- tramite es el log de NEGOCIO. Es visible al Cliente. Sirve para que el cliente entienda el ciclo de vida de su PQRS (paso a en_proceso con tal justificacion, paso a resuelto con tal otra justificacion). Lo escribe el dominio explicitamente.
- auditoria es el log TECNICO. Es interno. Sirve para investigaciones forenses y trazabilidad de quien hizo que en el sistema. Se genera automaticamente por AOP en TODA operacion CRUD.

## 7.3 Decision: archivos PDF fuera de la BD

Los PDF adjuntos a las PQRS NO se almacenan como BLOB en PostgreSQL. Se almacenan en NAS y la BD guarda unicamente la ruta. Razones:

- Crecimiento del 200% en archivos no afecta el tamaño de las tablas.
- Backup de BD se mantiene pequeño y rapido.
- Los archivos se pueden servir directamente desde Nginx sin pasar por la API si se requiere optimizar.
- Cumple criterio del RNF-01: persistencia con ORM para datos relacionales, almacenamiento separado para archivos.

## 7.4 Diagrama

El diagrama MER vive en `diagramas/mer/mer-pqrs.puml` y se renderiza en `mer-pqrs.png`. La especificacion completa de cada columna (tipo SQL, nulabilidad, descripcion, ejemplo) vive en `11-Modelo-Entidad-Relacion.md` seccion 5.
