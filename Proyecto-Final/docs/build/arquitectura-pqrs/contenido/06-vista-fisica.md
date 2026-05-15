# 6. Vista Fisica (Despliegue)

La vista fisica describe la distribucion del software en hardware y red.

Diagrama: `diagramas/arquitectura/5-vista-fisica.puml`.

## 6.1 Topologia de nodos

| Componente | Tecnologia | Puerto | Notas |
|---|---|---|---|
| Balanceador de Carga | Nginx o HAProxy | TCP 443 (HTTPS) | Unico punto de entrada publico. Sin TCP 80 (redirige a 443). |
| Servidor Web Estatico | Nginx (sirve bundle Angular) | TCP 80/443 | Sirve los assets compilados del frontend. |
| Cluster Servidores App | Java Spring Boot mas Tomcat embebido | TCP 8080 (interno) | 2 o mas instancias. Sin estado en memoria. |
| Base de Datos Primaria | PostgreSQL 15+ | TCP 5432 | Maneja todas las escrituras. |
| Base de Datos Replica | PostgreSQL 15+ standby | TCP 5432 | Replicacion asincrona. Read-only. Failover manual. |
| Almacenamiento NAS | NFS Share | TCP 2049 | Adjuntos PDF. Separado de la BD para no inflar tablas. |
| SMTP Gateway | Postfix o AWS SES | SMTP TCP 587 (TLS) | Envio de correos transaccionales. |

## 6.2 Propiedades del despliegue

- HTTPS obligatorio. El balanceador termina TLS y enruta al cluster interno por HTTP.
- Cluster sin estado. La sesion del usuario se mantiene exclusivamente por JWT. No hay sesiones en memoria del servidor, lo que permite escalar horizontal y reiniciar instancias sin afectar usuarios conectados.
- Replicacion BD asincrona. La replica recibe los cambios del primario con un retraso de milisegundos. En caso de caida del primario, se promueve manualmente la replica.
- Backup diario. Se ejecuta pg_dump sobre la replica, no sobre el primario, para no consumir IOPS en la BD que sirve produccion.
- Adjuntos en NAS, no en BD. Permite que el crecimiento del 200% en archivos no impacte el tamaño de las tablas. La metadata (ruta, mime, tamaño) si vive en BD.

## 6.3 Diferencias respecto al Taller-6 (E-Commerce)

| Aspecto | Taller-6 (E-Commerce) | Proyecto-Final (PQRS) |
|---|---|---|
| TPS objetivo | 1.000 TPS | No critico (uso interno mas ciudadanos) |
| Disponibilidad | 99,7% uptime con DRP | Replica asincrona mas backup diario |
| Centro alterno | Si, replicacion sincrona | No (replica simple en la misma region) |
| Integraciones externas | Datacredito, CIFIN, Stripe, PayPal, SOAP a BI | Solo SMTP |
| Archivos planos | CIFIN, consignaciones | Solo PDF adjuntos a PQRS |
| Roles | Vendedor, Comprador, Director, Admin | Cliente, Gestor, Admin |

La arquitectura PQRS es una simplificacion deliberada de la del E-Commerce: misma forma estructural, menos piezas.
