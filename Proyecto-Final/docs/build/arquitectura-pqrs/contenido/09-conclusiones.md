# 9. Conclusiones

## 9.1 Decisiones clave

1. Arquitectura hexagonal en el backend: el dominio puro queda aislado de Spring y JPA. Permite testear el negocio sin levantar contexto, y cambiar la tecnologia de persistencia sin tocar reglas de negocio.

2. Stack 100% open source: OpenJDK, Spring Boot, PostgreSQL, Angular, Ionic, Tailwind, Nginx. Cumple el RNF-01 sin generar costos de licenciamiento para SuperMarket.

3. pnpm como package manager unico en frontend: bloqueado via preinstall en package.json. Evita lockfiles duplicados y problemas de dependencias entre miembros del equipo.

4. Adjuntos PDF fuera de la BD: el NAS almacena los archivos, la BD solo guarda la ruta. Mantiene la BD pequeña y permite servir archivos directamente desde Nginx si se requiere optimizar.

5. Auditoria via AOP: un aspecto transversal registra TODO CRUD sin contaminar el codigo de negocio. La tabla auditoria es el log tecnico generico; la tabla tramite es el log de negocio especifico del flujo PQRS.

6. Notificaciones asincronas: el correo se envia despues de la respuesta 201 al cliente. Una falla SMTP no afecta la UX; la tabla notificacion actua como cola de reintentos.

7. Cluster sin estado mas JWT: permite escalar horizontal y reiniciar instancias sin afectar usuarios conectados.

## 9.2 Riesgos identificados

- Disponibilidad: la arquitectura tiene una sola replica de BD y failover manual. Si SuperMarket exige uptime superior al 99,5%, se requiere un segundo centro de datos.
- Adjuntos en NAS: si el NAS falla, las PQRS pueden radicarse pero sin adjunto descargable. Mitigacion: replicacion del NAS o servicio S3-compatible.
- BCrypt costo computacional: con muchas autenticaciones concurrentes, el hashing puede ser cuello de botella. Mitigacion: ajustar work factor segun la carga real.

## 9.3 Roadmap arquitectonico futuro

- Integracion BI via SOAP: si SuperMarket requiere exponer reportes a sistemas BI externos, se suma un paquete api/soap/ sin tocar el dominio.
- Cache distribuido (Redis): si la consulta de la bandeja se vuelve cuello de botella, sumar cache en read-side.
- Observabilidad: integrar Prometheus mas Grafana para metricas y trazabilidad distribuida con OpenTelemetry.

## 9.4 Estado de aprobacion

Documento del Proyecto-Final (Sistema PQRS). Pendiente de revision por el docente del curso.

Equipo:

- Avila Cortes Julian David (frontend mobile)
- Criollo Homez Julian Felipe (backend)
- Rocha Ramirez Santiago (frontend web)
- Vargas Clavijo Brian Steven (database, comodin, documentacion)
