# Modelo Entidad-Relacion — Sistema PQRS

> Documento del **MER** del sistema PQRS para SuperMarket. Sirve de fuente unica de verdad para el diseño de la base de datos (`Proyecto-Final/database/`) y referencia para el dominio del backend.

---

## 1. Introduccion

El presente documento describe el modelo de datos persistente del sistema PQRS. Esta basado en los requerimientos funcionales (`7-Requerimientos-Funcionales.md`) y casos de uso (`casos-de-uso/`) del proyecto, y se alinea con la Vista de Datos del documento de arquitectura ([`9-Arquitectura-PQRS.md`](./9-Arquitectura-PQRS.md), seccion 7).

El formato PlantUML del diagrama reusa el estilo del Taller-6 (`Taller-6/Diagramas/6-Vista-Datos/1-Modelo-Entidad-Relacion.puml`) adaptado al dominio PQRS.

---

## 2. Diagrama MER

Fuente: [`diagramas/mer/mer-pqrs.puml`](./diagramas/mer/mer-pqrs.puml).

Render: `diagramas/mer/mer-pqrs.png` (generar con `plantuml mer-pqrs.puml` o herramienta equivalente).

---

## 3. Entidades y relaciones

### 3.1 Listado de entidades

| Entidad | Proposito |
|---|---|
| `rol` | Catalogo de roles del sistema: cliente, gestor, admin. |
| `usuario` | Centraliza Cliente, Gestor y Admin. Discriminado por `rol_id`. |
| `pqrs` | Cabecera de cada radicado. Estado actual + metadata. |
| `tramite` | Log de negocio: cada cambio de estado de una PQRS. |
| `adjunto` | Metadata del PDF anexado. El archivo binario vive en NAS. |
| `notificacion` | Cola de correos transaccionales. |
| `auditoria` | Log tecnico via AOP. Toda operacion CRUD del dominio. |

### 3.2 Relaciones principales

| De | A | Cardinalidad | Significado |
|---|---|---|---|
| `rol` | `usuario` | 1—N | Un rol agrupa varios usuarios. |
| `usuario` | `pqrs` (cliente_id) | 1—N | Un cliente puede radicar varias PQRS. |
| `usuario` | `pqrs` (gestor_id) | 1—N (nullable) | Un gestor tramita varias PQRS. El `gestor_id` es nullable porque al radicar la PQRS aun no esta asignada. |
| `usuario` | `tramite` (gestor_id) | 1—N | Un gestor ejecuta varios tramites. |
| `pqrs` | `tramite` | 1—N | Una PQRS pasa por varios cambios de estado (nuevo → en_proceso → resuelto → posible reapertura). Cada cambio es un tramite. |
| `pqrs` | `adjunto` | 1—N | Una PQRS puede tener varios archivos anexos. |
| `pqrs` | `notificacion` | 1—N | Una PQRS dispara varios correos (radicacion, cambios de estado). |
| `usuario` | `notificacion` | 1—N | Un usuario recibe varios correos. |
| `usuario` | `auditoria` | 1—N | Un usuario genera N entradas de auditoria a lo largo del tiempo. |

### 3.3 Diferencia entre `tramite` y `auditoria`

Tabla `tramite` = log de **negocio**. Visible al cliente. Lo escribe el dominio explicitamente cuando un Gestor cambia el estado de la PQRS. Sirve para que el cliente entienda el ciclo de vida (paso a `en_proceso` con tal justificacion, paso a `resuelto` con tal otra).

Tabla `auditoria` = log **tecnico**. Interno. Se genera automaticamente por AOP en TODA operacion CRUD del dominio. Sirve para investigaciones forenses, debugging y compliance.

No son redundantes. Cumplen roles ortogonales: uno es para el cliente, otro es para el operador del sistema.

---

## 4. Constraints e indices

### 4.1 Constraints UNIQUE

- `usuario.email` UNIQUE
- `usuario.num_doc` UNIQUE
- `pqrs.radicado` UNIQUE (formato `PQRS-YYYY-NNNNNN`)

### 4.2 Constraints CHECK

- `usuario.tipo_doc IN ('CC', 'CE', 'TI', 'PP')`
- `pqrs.tipo IN ('peticion', 'queja', 'reclamo', 'sugerencia')`
- `pqrs.estado IN ('nuevo', 'en_proceso', 'resuelto', 'rechazado')`
- `adjunto.tipo_mime = 'application/pdf'` (solo PDF permitidos)
- `adjunto.tamano_bytes <= 5242880` (5 MB max)

### 4.3 Indices recomendados

Optimizan las queries mas frecuentes del backend (bandeja, historial, notificaciones pendientes):

- `idx_pqrs_estado` sobre `pqrs(estado)` — filtros de Bandeja.
- `idx_pqrs_cliente` sobre `pqrs(cliente_id, fecha_radicado DESC)` — historial del cliente.
- `idx_pqrs_gestor` sobre `pqrs(gestor_id)` — asignacion gestor.
- `idx_tramite_pqrs` sobre `tramite(pqrs_id, timestamp DESC)` — historial de cambios de una PQRS.
- `idx_notificacion_estado` sobre `notificacion(estado)` — retry de correos pendientes.
- `idx_auditoria_usuario` sobre `auditoria(usuario_id, timestamp DESC)` — forensics.

---

## 5. Diccionario de Datos

> Esta seccion cubre el entregable opcional **#15 Diccionario de Datos**. Especifica cada columna del modelo: tipo SQL, nulabilidad, descripcion, ejemplo y validaciones.

### 5.1 Tabla `rol`

| Columna | Tipo SQL | Null | Descripcion | Ejemplo | Validaciones |
|---|---|---|---|---|---|
| id | SERIAL | NO | PK auto-incremental | 1 | Generado por la BD |
| nombre | VARCHAR(20) | NO | Nombre del rol | "cliente" | UNIQUE, IN ('cliente','gestor','admin') |

### 5.2 Tabla `usuario`

| Columna | Tipo SQL | Null | Descripcion | Ejemplo | Validaciones |
|---|---|---|---|---|---|
| id | SERIAL | NO | PK auto-incremental | 42 | Generado por la BD |
| rol_id | INT | NO | FK a `rol(id)` | 1 | REFERENCES rol(id) |
| tipo_doc | VARCHAR(4) | NO | Tipo de documento | "CC" | IN ('CC','CE','TI','PP') |
| num_doc | VARCHAR(20) | NO | Numero de documento | "1020304050" | UNIQUE, solo digitos para CC/TI, alfanumerico para PP |
| nombres | VARCHAR(100) | NO | Nombres del usuario | "Juan Carlos" | Longitud 2..100 |
| apellidos | VARCHAR(100) | NO | Apellidos | "Perez Lopez" | Longitud 2..100 |
| email | VARCHAR(150) | NO | Correo electronico | "jcperez@gmail.com" | UNIQUE, regex RFC 5322 simplificado |
| telefono | VARCHAR(20) | YES | Telefono movil | "3001234567" | Solo digitos, 10..15 caracteres |
| clave_hash | VARCHAR(255) | NO | Hash BCrypt de la clave | "$2a$12$..." | BCrypt cost 12 |
| fecha_creacion | TIMESTAMP | NO | Timestamp de alta | "2026-05-15 10:00:00" | DEFAULT NOW() |

### 5.3 Tabla `pqrs`

| Columna | Tipo SQL | Null | Descripcion | Ejemplo | Validaciones |
|---|---|---|---|---|---|
| id | SERIAL | NO | PK auto-incremental | 100 | Generado por la BD |
| radicado | VARCHAR(20) | NO | Numero publico del radicado | "PQRS-2026-000123" | UNIQUE, formato `PQRS-YYYY-NNNNNN` |
| tipo | VARCHAR(20) | NO | Categoria de la PQRS | "queja" | IN ('peticion','queja','reclamo','sugerencia') |
| asunto | VARCHAR(200) | NO | Asunto corto | "Producto vencido" | Longitud 5..200 |
| descripcion | TEXT | NO | Descripcion detallada | "El producto X..." | Longitud minima 20 caracteres |
| estado | VARCHAR(20) | NO | Estado actual | "nuevo" | IN ('nuevo','en_proceso','resuelto','rechazado'), DEFAULT 'nuevo' |
| cliente_id | INT | NO | FK al usuario que radico | 42 | REFERENCES usuario(id), rol cliente |
| gestor_id | INT | YES | FK al gestor asignado | 5 | REFERENCES usuario(id), rol gestor, nullable hasta asignacion |
| fecha_radicado | TIMESTAMP | NO | Fecha de radicacion | "2026-05-15 10:05:00" | DEFAULT NOW() |
| fecha_cierre | TIMESTAMP | YES | Fecha de cierre (si aplica) | "2026-05-20 16:30:00" | Solo si estado IN ('resuelto','rechazado') |

### 5.4 Tabla `tramite`

| Columna | Tipo SQL | Null | Descripcion | Ejemplo | Validaciones |
|---|---|---|---|---|---|
| id | SERIAL | NO | PK | 200 | Generado por la BD |
| pqrs_id | INT | NO | FK a la PQRS | 100 | REFERENCES pqrs(id) |
| gestor_id | INT | NO | Gestor que ejecuta el cambio | 5 | REFERENCES usuario(id), rol gestor |
| estado_anterior | VARCHAR(20) | NO | Estado antes del cambio | "nuevo" | IN ('nuevo','en_proceso','resuelto','rechazado') |
| estado_nuevo | VARCHAR(20) | NO | Estado despues del cambio | "en_proceso" | IN ('nuevo','en_proceso','resuelto','rechazado') |
| justificacion | TEXT | NO | Razon del cambio | "Se inicia investigacion..." | Longitud minima 10 caracteres, no solo espacios |
| timestamp | TIMESTAMP | NO | Fecha del cambio | "2026-05-15 11:00:00" | DEFAULT NOW() |

### 5.5 Tabla `adjunto`

| Columna | Tipo SQL | Null | Descripcion | Ejemplo | Validaciones |
|---|---|---|---|---|---|
| id | SERIAL | NO | PK | 300 | Generado por la BD |
| pqrs_id | INT | NO | FK a la PQRS | 100 | REFERENCES pqrs(id) ON DELETE CASCADE |
| nombre_archivo | VARCHAR(255) | NO | Nombre original | "factura.pdf" | Longitud 1..255 |
| url_nas | VARCHAR(500) | NO | Ruta en NAS | "/nas/pqrs/2026/05/PQRS-2026-000123-001.pdf" | Path valido |
| tipo_mime | VARCHAR(50) | NO | Tipo MIME | "application/pdf" | Solo `application/pdf` |
| tamano_bytes | BIGINT | NO | Tamaño en bytes | 102400 | <= 5242880 (5 MB) |
| fecha_subida | TIMESTAMP | NO | Fecha de subida | "2026-05-15 10:05:30" | DEFAULT NOW() |

### 5.6 Tabla `notificacion`

| Columna | Tipo SQL | Null | Descripcion | Ejemplo | Validaciones |
|---|---|---|---|---|---|
| id | SERIAL | NO | PK | 400 | Generado por la BD |
| usuario_id | INT | NO | Destinatario | 42 | REFERENCES usuario(id) |
| pqrs_id | INT | YES | PQRS relacionada (si aplica) | 100 | REFERENCES pqrs(id) |
| tipo | VARCHAR(30) | NO | Tipo de notificacion | "radicado_creado" | IN ('radicado_creado','cambio_estado','clave_autogenerada','recordatorio') |
| plantilla | VARCHAR(50) | NO | Identificador de plantilla | "email_radicado_es" | Existe en `pqrs-notificaciones` |
| enviado_en | TIMESTAMP | YES | Fecha de envio exitoso | "2026-05-15 10:05:35" | NULL si aun no enviada |
| estado | VARCHAR(20) | NO | Estado del envio | "enviada" | IN ('pendiente','enviada','fallida') |
| intentos | INT | NO | Numero de reintentos | 0 | DEFAULT 0, max 5 |

### 5.7 Tabla `auditoria`

| Columna | Tipo SQL | Null | Descripcion | Ejemplo | Validaciones |
|---|---|---|---|---|---|
| id | SERIAL | NO | PK | 500 | Generado por la BD |
| usuario_id | INT | YES | Usuario que ejecuto la accion | 5 | REFERENCES usuario(id), nullable si fue sistema |
| accion | VARCHAR(50) | NO | Tipo de accion | "tramitar_pqrs" | Vocabulario controlado por AOP aspect |
| entidad | VARCHAR(50) | NO | Tabla afectada | "pqrs" | Nombre de tabla del sistema |
| entidad_id | INT | NO | ID de la fila afectada | 100 | FK soft (no enforced) |
| ip | VARCHAR(45) | YES | IP del cliente | "192.168.1.10" | IPv4 o IPv6 |
| timestamp | TIMESTAMP | NO | Fecha de la accion | "2026-05-15 11:00:00" | DEFAULT NOW() |
| payload_json | JSONB | YES | Snapshot del cambio | `{"estado_anterior":"nuevo","estado_nuevo":"en_proceso"}` | JSON valido |

---

## 6. Cobertura entregables

> Este documento cubre tres entregables del Proyecto-Final:
>
> 1. **#9 Modelo Entidad-Relacion** (obligatorio) — secciones 2, 3, 4.
> 2. **#13 Modelo Conceptual** (opcional) — las entidades y relaciones aqui definidas representan los **conceptos del dominio PQRS** a nivel abstracto, ademas del nivel relacional. No se genera un modelo conceptual separado para evitar redundancia.
> 3. **#15 Diccionario de Datos** (opcional) — seccion 5.

---

## 7. Referencias cruzadas

- Casos de uso: [`casos-de-uso/`](./casos-de-uso/) — fuente de las entidades modeladas.
- Requerimientos funcionales: [`7-Requerimientos-Funcionales.md`](./7-Requerimientos-Funcionales.md) — cada RF se traduce a operaciones sobre estas entidades.
- Documento de arquitectura: [`9-Arquitectura-PQRS.md`](./9-Arquitectura-PQRS.md) — Vista de Datos (seccion 7).
- Referencia metodologica: [`../Taller-6/Diagramas/6-Vista-Datos/1-Modelo-Entidad-Relacion.puml`](../../Taller-6/Diagramas/6-Vista-Datos/1-Modelo-Entidad-Relacion.puml) — formato base reusado.
- Implementacion: cuando Brian arranque el modulo DB, las migraciones Flyway en `Proyecto-Final/database/migrations/` materializaran este modelo.
