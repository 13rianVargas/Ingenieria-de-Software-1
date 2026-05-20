# 10. Conclusiones

## 10.1 Decisiones clave

- Arquitectura hexagonal en el backend: el dominio puro queda aislado de Spring y JPA. Permite testear el negocio sin levantar contexto, y cambiar la tecnologia de persistencia sin tocar reglas de negocio.

- Stack 100% open source: OpenJDK, Spring Boot, PostgreSQL, Angular, Ionic, Tailwind, Nginx. Cumple el RNF-01 sin generar costos de licenciamiento para SuperMarket.

- pnpm como package manager único en frontend: bloqueado via preinstall en package.json. Evita lockfiles duplicados y problemas de dependencias entre miembros del equipo.

- Adjuntos PDF fuera de la BD: el NAS almacena los archivos, la BD solo guarda la ruta. Mantiene la BD pequeña y permite servir archivos directamente desde Nginx si se requiere optimizar.

- auditoría via AOP: un aspecto transversal registra TODO CRUD sin contaminar el código de negocio. La tabla auditoría es el log técnico genérico; la tabla trámite es el log de negocio especifico del flujo PQRS.

- Notificaciónes asíncronas: el correo se envía despues de la respuesta 201 al cliente. Una falla SMTP no afecta la UX; la tabla notificación actua como cola de reintentos.

- Cluster sin estado mas JWT: permite escalar horizontal y reiniciar instancias sin afectar usuarios conectados.

## 10.2 Riesgos identificados

- Disponibilidad: la arquitectura tiene una sola replica de BD y failover manual. Si SuperMarket exige uptime superior al 99,5%, se requiere un segundo centro de datos.
- Adjuntos en NAS: si el NAS falla, las PQRS pueden radicarse pero sin adjunto descargable. Mitigación: replicacion del NAS o servicio S3-compatible.
- BCrypt costo computacional: con muchas autenticaciónes concurrentes, el hashing puede ser cuello de botella. Mitigación: ajustar work factor segun la carga real.

## 10.3 Roadmap arquitectónico futuro

- Integracion BI via SOAP: si SuperMarket requiere exponer reportes a sistemas BI externos, se suma un paquete api/soap/ sin tocar el dominio.
- Cache distribuido (Redis): si la consulta de la bandeja se vuelve cuello de botella, sumar cache en read-side.
- Observabilidad: integrar Prometheus mas Grafana para métricas y trazabilidad distribuida con OpenTelemetry.

