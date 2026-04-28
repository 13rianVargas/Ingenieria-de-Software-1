# Documento de Arquitectura de Software
## E-Commerce Konrad — Sistema de Información de Comercio Electrónico

| Campo | Detalle |
|---|---|
| **Proyecto** | E-Commerce para Comercial Konrad |
| **Materia** | Ingeniería de Software I |
| **Versión** | 1.0 |
| **Fecha** | Abril 2026 |
| **Metodología** | Modelo 4+1 vistas (Kruchten) + Vista de Datos |

---

## 1. Introducción

### 1.1 Propósito

Este documento describe la arquitectura del sistema E-Commerce Konrad usando el modelo de 4+1 vistas extendido con Vista de Datos. Está dirigido al equipo académico de Ingeniería de Software I como evidencia del diseño arquitectónico del sistema.

### 1.2 Alcance

El sistema cubre los siguientes módulos funcionales:

- Registro y aprobación de vendedores (con integración Datacrédito, CIFIN y antecedentes judiciales)
- Gestión de suscripciones de vendedores
- Publicación y catálogo de productos
- Proceso de compra (carrito, pago, entrega)
- Interacción comprador-vendedor (preguntas, comentarios, calificaciones)
- Tablero de control BAM para el Director Comercial
- Administración del sistema (auditoría, logs, parametrización)

**Fuera de alcance:** implementación de sistemas bancarios externos, plataformas de redes sociales (solo integración de tendencias), infraestructura física de centros de datos.

### 1.3 Glosario

| Término | Definición |
|---|---|
| **CIFIN** | Central de Información Financiera. Entidad colombiana que reporta historial crediticio. Entrega archivos planos mensuales en FileSystem. |
| **Datacrédito** | Entidad de historial crediticio expuesta como Web Service externo. |
| **DRP** | Disaster Recovery Plan. Plan y centro de datos alterno para recuperación ante desastres. |
| **FileSystem (FS)** | Sistema de archivos del servidor donde llegan archivos planos de CIFIN y consignaciones bancarias. |
| **NAS** | Network Attached Storage. Servidor de almacenamiento compartido en red. |
| **SOAP** | Simple Object Access Protocol. Protocolo de servicios web basado en XML. |
| **TPS** | Transacciones Por Segundo. Métrica de rendimiento del sistema. |
| **BAM** | Business Activity Monitoring. Tablero de KPIs en tiempo real para el Director Comercial. |
| **SPA** | Single Page Application. Aplicación web que carga una sola página HTML y actualiza contenido dinámicamente. |
| **ORM** | Object-Relational Mapping. Capa de abstracción entre objetos del dominio y tablas relacionales. |
| **BCrypt** | Algoritmo de hashing de contraseñas. Estándar recomendado por OWASP. |
| **AOP** | Aspect-Oriented Programming. Paradigma para separar concerns transversales (auditoría, logging) del código de negocio. |

### 1.4 Objetivos Arquitectónicos

1. **Escalabilidad:** Soportar 200.000 usuarios concurrentes y 1.000 TPS mediante computación distribuida (clusters y balanceadores de carga).
2. **Alta disponibilidad:** Garantizar uptime del 99,7% con centro de datos alterno y replicación síncrona/asíncrona.
3. **Seguridad:** Autenticación robusta con roles, cifrado de contraseñas con BCrypt y comunicaciones exclusivamente sobre HTTPS.
4. **Mantenibilidad:** Auditoría centralizada de cada CRUD y log de errores mediante componentes transversales AOP.
5. **Integrabilidad:** Exposición de servicios hacia sistemas BI externos mediante SOAP; consumo de servicios externos mediante REST.
6. **Libertad de licenciamiento:** Stack 100% open source (OpenJDK, Spring Boot, Angular/React, PostgreSQL, Nginx).

### 1.5 Restricciones Arquitectónicas

- Stack obligatorio open source: Java (OpenJDK) + Spring Boot (backend), Angular o React (frontend web), PostgreSQL (BD relacional).
- Comunicaciones externas sobre HTTPS (TCP 443).
- Servicios hacia BI externos deben usar SOAP XML.
- Archivos planos de CIFIN y consignaciones bancarias llegan via FileSystem; el sistema los procesa en lotes.
- Sin licencias propietarias ni frameworks comerciales.

---

## 2. Vista de Casos de Uso

La vista de casos de uso establece los requisitos funcionales arquitectónicamente significativos, es decir, los que tienen mayor impacto en las decisiones de diseño del sistema.

### 2.1 Actores

| Actor | Descripción |
|---|---|
| **Aspirante / Vendedor** | Persona natural o jurídica que solicita ser vendedor y, una vez aprobada y con suscripción activa, publica productos. |
| **Comprador** | Usuario registrado que busca, consulta, compra productos y califica transacciones. |
| **Director Comercial** | Rol interno que revisa solicitudes de vendedores, gestiona aprobaciones y consulta el tablero BAM. |
| **Administrador del Sistema** | Rol técnico que parametriza el sistema, consulta auditoría y monitorea logs de error. |

### 2.2 Diagrama General de Casos de Uso

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Aspirante/Vendedor" as Vendedor
actor "Posible Comprador/Comprador" as Comprador
actor "Director Comercial" as Director
actor "Administrador del Sistema" as Admin

rectangle "E-Commerce Konrad" {
  usecase "1. Registrar Solicitud de Vendedor" as UC1
  usecase "2. Publicar Productos" as UC2
  usecase "3. Consultar y Comprar Productos" as UC3
  usecase "4. Gestión de Solicitudes y BAM" as UC4
  usecase "5. Administrar Sistema" as UC5
}

Vendedor --> UC1
Vendedor --> UC2

Comprador --> UC3

Director --> UC4

Admin --> UC5

@enduml
```

### 2.3 Casos de Uso Arquitectónicamente Significativos

Los siguientes casos de uso son significativos para la arquitectura porque impactan decisiones de diseño, integraciones o mecanismos de concurrencia:

| ID | Caso de Uso | Impacto Arquitectónico |
|---|---|---|
| CU-01 | Registrar Solicitud de Vendedor | Integración con Datacrédito (WS), CIFIN (FileSystem→BD), validación de tipo de persona, correo certificado. |
| CU-03 | Comprar Productos | Carrito con cálculo en tiempo real, integración pasarela de pagos (Stripe/PayPal), procesamiento consignaciones (archivo bancario). |
| CU-04 | Gestión Director Comercial | Consulta concurrente a dos fuentes de riesgo externas + consulta manual judicial + reglas de negocio con múltiples estados. |
| CU-05 | Administrar Sistema | Parametrización sin código, consulta de auditoría centralizada y logs de error: justifica los paquetes `shared/auditoria` y `shared/logging`. |

---

## 3. Vista Lógica

La vista lógica describe la descomposición del sistema en módulos, capas y componentes desde una perspectiva estática de responsabilidades.

### 3.1 Nivel 1 — Contenedores Base

Muestra los contenedores principales del sistema sin detalles internos.

```plantuml
@startuml
skinparam linetype ortho
skinparam nodesep 60
skinparam ranksep 70

title Nivel 1 - Componentes y Contenedores Base

[Aplicación Web] as WebApp
[Aplicación Móvil] as MobileApp

[Backend API (Servidor de Aplicaciones)] as Backend
database "Base de Datos Principal" as DB
folder "File System (Archivos Planos)" as FS

[Sistemas de Información Externos] as Externos

WebApp --> Backend
MobileApp --> Backend

Backend --> DB
Backend --> FS
Backend --> Externos

@enduml
```

### 3.2 Nivel 2 — Componentes Internos y Protocolos

Muestra las capas internas de cada contenedor y los protocolos de comunicación.

```plantuml
@startuml
skinparam componentStyle rectangle
skinparam linetype ortho
skinparam nodesep 50
skinparam ranksep 60
skinparam shadowing false

title Nivel 2 - Componentes Internos Agrupados y Protocolos

package "Aplicación Web (SPA)" as WebApp {
    [Vista y Lógica de Presentación Web] as WebUI
}

package "Aplicación Móvil" as MobileApp {
    [Vista y Lógica de Presentación Móvil] as MobUI
}

package "Backend API (Servidor de Aplicaciones)" as Backend {
    [Capa de Servicios REST/SOAP] as API
    [Capa de Lógica de Negocio] as Logic
    [Capa de Persistencia] as DAL
    
    API --> Logic
    Logic --> DAL
}

database "Base de Datos Principal" as DB

folder "File System (Archivos Planos)" as FS

package "Sistemas de Información Externos" as Externos {
    [Servicios de Terceros (Pagos, Riesgo, Correo, BI)] as ExtServices
}

WebUI ---> API : HTTPS / REST JSON
MobUI ---> API : HTTPS / REST JSON

DAL ---> DB : TCP / JDBC
Logic ---> FS : File I/O (Lectura)

Logic ---> ExtServices : HTTPS / SMTP / SOAP XML

@enduml
```

**Descripción de capas del backend:**

| Capa | Responsabilidad |
|---|---|
| **Capa de Servicios REST/SOAP** | Punto de entrada. Expone endpoints REST para clientes web/móvil y endpoints SOAP para sistemas BI. Valida contratos de entrada, delega a la capa de negocio. |
| **Capa de Lógica de Negocio** | Orquesta los procesos de negocio: aprobación de vendedores, cálculo de totales de compra, evaluación de calificaciones, gestión de suscripciones. Invoca servicios externos y auditoria. |
| **Capa de Persistencia (ORM)** | Abstrae el acceso a PostgreSQL mediante JPA/Hibernate. Gestiona transacciones, consultas y mapeo objeto-relacional. |

### 3.3 Nivel 3 — Componentes Técnicos Detallados

Máximo detalle: librerías, clientes HTTP, ORM, y todos los sistemas externos diferenciados.

```plantuml
@startuml
top to bottom direction
skinparam componentStyle rectangle
skinparam linetype ortho
skinparam nodesep 70
skinparam ranksep 80
skinparam shadowing false

title Nivel 3 - Componentes Técnicos Detallados y Protocolos

' --- CAPA FRONTEND ---
together {
    package "Aplicación Web (SPA)" as WebApp {
        [Web UI Components] as WebUI
        [State Manager] as WebState
        [HTTP REST Client] as WebClient
        
        WebUI -down-> WebState
        WebState -down-> WebClient
    }

    package "Aplicación Móvil" as MobileApp {
        [Mobile Views] as MobUI
        [Local Storage] as MobStorage
        [HTTP REST Client] as MobClient
        
        MobUI -down-> MobStorage
        MobUI -down-> MobClient
    }
}

' --- CAPA BACKEND ---
package "Backend API (Servidor de Aplicaciones)" as Backend {
    together {
        [REST API Controllers] as API
        [SOAP Endpoints] as SOAP
    }
    
    [Business Service Layer] as Services
    [Data Access Layer (ORM)] as DAL
    
    API -down-> Services
    SOAP -down-> Services
    Services -down-> DAL
}

' --- CAPA PERSISTENCIA Y EXTERNOS ---
together {
    database "Base de Datos Principal" as DB
    folder "File System (Archivos Planos)" as FS
    
    package "Sistemas de Información Externos" as Externos {
        [Datacredito / CIFIN API] as ExtCredit
        [Pasarela de Pagos] as ExtPayment
        [Servidor de Correos] as ExtMail
        [Sistemas BI] as ExtBI
    }
}

' --- RELACIONES Y PROTOCOLOS ---

WebClient -down-> API : HTTPS / REST JSON
MobClient -down-> API : HTTPS / REST JSON

DAL -down-> DB : TCP / JDBC
Services -down-> FS : File I/O

Services -down-> ExtCredit : HTTPS / REST
Services -down-> ExtPayment : HTTPS / REST
Services -down-> ExtMail : TCP / SMTP
ExtBI -up-> SOAP : HTTPS / SOAP XML

@enduml
```

---

## 4. Vista de Procesos

La vista de procesos describe el comportamiento dinámico del sistema en tiempo de ejecución: flujos concurrentes, interacciones entre actores y mecanismos de comunicación.

### 4.1 Proceso: Registro de Vendedor y Aprobación

Flujo completo desde la solicitud del aspirante hasta activación como vendedor con suscripción pagada.

```plantuml
@startuml
|Aspirante a Vendedor|
start
:Ingresar datos personales\n(Nombres, ID, correo, país, ciudad, teléfono);
:Descargar formatos legales\n(Consulta centrales de riesgo\nTratamiento de datos);
:Adjuntar documentación\n(Cédula, RUT, Cámara de Comercio\nFormatos firmados);

|Sistema E-Commerce|
:Validar formato de datos;
if (¿Datos y documentos\ncompletos y válidos?) then (No)
  :Mostrar errores de validación;
  |Aspirante a Vendedor|
  :Corregir datos o documentos;
  |Sistema E-Commerce|
else (Sí)
endif
:Determinar tipo de persona\n(Natural o Jurídica);
:Registrar solicitud\nen estado **PENDIENTE**;
:Generar número de radicado;
:Enviar correo certificado\ncon número de radicado;

|Director Comercial|
:Consultar solicitudes pendientes\n(por ID, estado o fecha);
:Seleccionar solicitud\ny ver detalle;

|Sistema E-Commerce|
:Consultar Datacrédito\n(Web Service externo);
:Leer archivo CIFIN\ndesde FileSystem → BD local;
:Consolidar calificaciones\ncrediticias;

|Director Comercial|
:Consultar antecedentes judiciales\nmanualmente en Policía Nacional;
:Registrar resultado\n(Requerido / No Requerido);

|Sistema E-Commerce|
:Evaluar reglas de negocio;
if (Crédito Baja en alguna\nO requerido por justicia) then (Sí)
  :Cambiar estado a **RECHAZADA**;
  :Enviar correo con motivo;
  stop
elseif (Crédito Advertencia\nen alguna entidad) then (Sí)
  :Cambiar estado a **DEVUELTA**;
  :Enviar correo explicando\ncondición de reactivación;
  stop
else (Crédito Alta en ambas\ny No requerido)
  :Cambiar estado a **APROBADA**;
  :Generar credenciales de acceso;
  :Enviar correo con credenciales;
endif

|Aspirante a Vendedor|
:Seleccionar plan de suscripción\n(Mensual / Semestral / Anual);
:Realizar pago;

|Sistema E-Commerce|
:Verificar pago;
if (¿Pago confirmado?) then (Sí)
  :Cambiar estado a **ACTIVA**;
  :Habilitar publicación de productos;
  stop
else (No)
  :Mantener en APROBADA\npendiente de pago;
  stop
endif
@enduml
```

### 4.2 Proceso: Compra de Productos

Flujo desde la búsqueda hasta la calificación post-transacción.

```plantuml
@startuml
|Comprador|
start
:Buscar producto\n(nombre, categoría,\nrango de precios, características);

|Sistema E-Commerce|
:Ejecutar búsqueda en catálogo (BD);
:Retornar resultados\n(imagen, precio, categoría);

|Comprador|
:Ver detalle del producto;
if (¿Desea comprar?) then (No)
  stop
else (Sí)
endif
:Agregar producto(s) al carrito;

|Sistema E-Commerce|
:Calcular total:\n1. Precio base × cantidad\n2. Comisión por categoría\n3. IVA si aplica;

|Comprador|
:Seleccionar forma de entrega\n(Tienda / Domicilio);
:Seleccionar forma de pago\n(Línea / Tarjeta / Consignación);

|Sistema E-Commerce|
if (¿Pago en línea o tarjeta?) then (Sí)
  :Redirigir a pasarela de pagos;
  :Recibir número de aprobación;
else (Consignación)
  :Leer archivo plano bancario\n(FileSystem → BD local);
  :Verificar consignación;
endif

if (¿Pago exitoso?) then (Sí)
  :Registrar compra (estado: PAGADO);
  :Notificar vendedor;
  :Actualizar stock;
  :Enviar confirmación por correo;
else (No)
  :Notificar error;
  stop
endif

|Comprador|
:Calificar transacción\n(1 a 10 + comentarios);

|Sistema E-Commerce|
:Registrar calificación;
:Actualizar reputación vendedor;
if (¿10 calif. < 3 O promedio < 5?) then (Sí)
  :Cambiar suscripción a **CANCELADA**;
  :Notificar al vendedor;
else (No)
endif
stop
@enduml
```

### 4.3 Proceso: Gestión de Solicitudes — Director Comercial

Flujo de revisión crediticia y judicial con múltiples swimlanes de integración.

```plantuml
@startuml
|Director Comercial|
start
:Consultar Solicitudes\nPendientes;
:Filtrar por ID,\nEstado o Fecha;
:Seleccionar una Solicitud\n(Estado: PENDIENTE);

|Sistema E-Commerce|
:Solicitar validación de\nantecedentes financieros;

|Datacrédito (WS)|
:Procesar consulta por\nnúmero de identificación;
:Retornar calificación\n(Alta / Baja / Advertencia);

|BD Local (CIFIN)|
:Buscar registro en DB\n(Cargado previamente\ndesde FileSystem);
:Retornar calificación\n(Alta / Baja / Advertencia);

|Sistema E-Commerce|
:Consolidar calificaciones\nfinancieras;
:Requerir validación de\nantecedentes judiciales;

|Director Comercial|
:Realizar Consulta Manual\nen plataforma de la\nPolicía Nacional;
:Registrar Resultado\nen el sistema\n(Requerido / No Requerido);

|Sistema E-Commerce|
:Evaluar Reglas\nde Negocio;
if (Vida crediticia Baja\nen alguna OR\nRequerido por justicia) then (Sí)
  :Cambiar Estado a\n**RECHAZADA**;
  :Enviar correo al\nsolicitante con\nmotivo de rechazo;
elseif (Vida crediticia Advertencia\nen alguna y sin Bajas) then (Sí)
  :Cambiar Estado a\n**DEVUELTA**;
  :Enviar correo explicando\nque podrá reactivar con\ncalificación Alta;
else (Alta en ambas\ny No requerido)
  :Cambiar Estado a\n**APROBADA**;
  :Generar credenciales\nde acceso;
  :Enviar correo con credenciales\nal nuevo vendedor;
endif

|Director Comercial|
:Visualizar actualización\nde estado y notificación;
stop
@enduml
```

---

## 5. Vista de Despliegue / Física

La vista física describe la distribución del software en la infraestructura de hardware y red.

### 5.1 Topología Nivel 1 — Visión General

Muestra los nodos principales, clusters y el centro de datos alterno (DRP).

```
Dispositivo Cliente (Web/Móvil)
        │ HTTPS
        ▼
    [Internet]
     │         │ Failover (HTTPS)
     ▼         ▼
┌─────────────────────┐   ┌──────────────────────────┐
│  DATA CENTER        │   │  DATA CENTER ALTERNO (DRP)│
│  PRINCIPAL          │   │                          │
│                     │   │                          │
│  Balanceador Carga  │   │  Balanceador Alterno     │
│  (HAProxy/Nginx)    │   │  (HAProxy/Nginx)         │
│         │           │   │         │                │
│  Cluster Serv. Web  │   │  Cluster Serv. Web Alt.  │
│  (Nginx/Apache)     │   │                          │
│         │           │   │         │                │
│  Cluster Serv. App  │◄──►  Cluster Serv. App Alt. │
│  (Spring Boot API)  │   │                          │
│      │       │      │   │      │       │           │
│  Cluster BD   NAS   │══►│  Cluster BD   NAS        │
│  (PostgreSQL) (NFS) │   │  (Standby)    (Réplica)  │
└─────────────────────┘   └──────────────────────────┘
        │                           │
        └──────────┬────────────────┘
                   ▼
         [Pasarela de Pagos]
         (Stripe / PayPal - HTTPS)
```

**Diagrama D2 fuente:** [`Vista-Fisica/1-Topologia-Despliegue-Nivel1.d2`](../Vista-Fisica/1-Topologia-Despliegue-Nivel1.d2)

### 5.2 Topología Nivel 2 — Detalle Técnico

Detalla componentes internos de cada nodo y protocolos específicos (puertos TCP).

| Componente | Tecnología | Puerto |
|---|---|---|
| Balanceador de Carga | HAProxy / Nginx | TCP 443 (HTTPS entrada) |
| Cluster Servidores Web | Nginx / Apache | TCP 80/8080 |
| Cluster Servidores App | Java Spring Boot | TCP 3000/8080 |
| Base de Datos | PostgreSQL | TCP 5432 |
| Almacenamiento NAS | NFS Share | TCP 2049 |
| Pasarela de Pagos | Stripe / PayPal (externa) | HTTPS TCP 443 |

**Replicación entre Data Centers:**
- BD Principal → BD Standby: replicación síncrona/asíncrona TCP.
- NAS Principal → NAS Alterno: sincronización via rsync TCP.

**Diagrama D2 fuente:** [`Vista-Fisica/2-Topologia-Despliegue-Nivel2.d2`](../Vista-Fisica/2-Topologia-Despliegue-Nivel2.d2)

---

## 6. Vista de Implementación

La vista de implementación describe la organización del código fuente en módulos, paquetes y dependencias.

### 6.1 Estructura de Paquetes

```
========================================================================================
|                BACKEND                     |        WEB FRONTEND        |    MOBILE   |
========================================================================================

com.konrad.ecommerce.backend        com.konrad.ecommerce.web      com.konrad.ecommerce.mobile
│                                   │                             │
├── api                             ├── app                       ├── app
│   ├── rest                        │   ├── routing               │   ├── navigation
│   │   ├── auth                    │   ├── auth_guards           │   ├── session
│   │   ├── solicitudes_vendedor    │   └── theme_runtime         │   └── theme
│   │   ├── compradores             │                             │
│   │   ├── catalogo                ├── core                      ├── core
│   │   ├── carrito_checkout        │   ├── api_client            │   ├── api_client
│   │   ├── pagos                   │   ├── state_management      │   ├── secure_storage
│   │   ├── suscripciones           │   ├── interceptors          │   ├── local_db
│   │   ├── reputacion              │   └── error_handling        │   └── push_notifications
│   │   ├── director_comercial      │                             │
│   │   └── administracion          ├── shared                    ├── shared
│   │                               │   ├── ui_components         │   ├── ui_components
│   └── soap                        │   ├── forms_validations     │   ├── forms_validations
│       └── bi_exports              │   └── utils                 │   └── utils
│                                   │                             │
├── application                     ├── modules                   ├── features
│   ├── commands                    │   ├── auth                  │   ├── auth
│   ├── queries                     │   ├── portal_vendedor       │   ├── comprador
│   └── workflows                   │   ├── portal_comprador      │   ├── vendedor
│                                   │   ├── director_comercial    │   ├── notificaciones
├── domain                          │   └── administracion        │   └── resources
│   ├── identidad                   │                             │
│   ├── onboarding_vendedor         ├── assets                    │
│   ├── suscripcion_vendedor        │   ├── styles_responsive     │
│   ├── catalogo_productos          │   └── images                │
│   ├── compras                     │                             │
│   ├── reputacion                  │                             │
│   ├── analitica_bam               │                             │
│   ├── promociones                 │                             │
│   └── parametrizacion             │                             │
│                                   │                             │
├── infrastructure                  │                             │
│   ├── persistencia                │                             │
│   │   ├── relacional              │                             │
│   │   ├── archivos                │                             │
│   │   └── cache                   │                             │
│   ├── integraciones_externas      │                             │
│   │   ├── datacredito_client      │                             │
│   │   ├── cifin_loader            │                             │
│   │   ├── consignaciones_loader   │                             │
│   │   ├── pasarela_pagos          │                             │
│   │   ├── correo_certificado      │                             │
│   │   └── social_trends           │                             │
│   └── batch_jobs                  │                             │
│                                   │                             │
└── shared                          │                             │
    ├── security                    │                             │
    ├── auditoria                   │                             │
    ├── logging                     │                             │
    ├── error_handling              │                             │
    └── configuracion               │                             │

========================================================================================
```

**Imagen:** [`Vista-Implementacion/1-Diagrama-Implentacion.png`](../Vista-Implementacion/1-Diagrama-Implentacion.png)

### 6.2 Descripción de Módulos Clave

| Módulo / Paquete | Responsabilidad |
|---|---|
| `api/rest/` | Controllers REST por dominio funcional. Validan entrada y delegan a la capa de aplicación. |
| `api/soap/bi_exports` | Web Services SOAP expuestos hacia sistemas BI externos. Contrato definido en WSDL. |
| `domain/` | Entidades y reglas de negocio puras. Sin dependencias de infraestructura. |
| `infrastructure/integraciones_externas/` | Clientes para Datacrédito, CIFIN, consignaciones, pasarela de pagos y correo certificado. |
| `infrastructure/persistencia/archivos` | Lectura y procesamiento de archivos planos (CIFIN, consignaciones) desde FileSystem. |
| `shared/auditoria` | Aspecto transversal: registra toda acción CRUD (qué acción, quién, cuándo). |
| `shared/logging` | Aspecto transversal: captura y persiste errores del sistema. |
| `shared/security` | Módulo de autenticación, autorización por roles y cifrado de contraseñas (BCrypt). |

---

## 7. Vista de Datos

La vista de datos describe el modelo de persistencia relacional: entidades, atributos y relaciones.

### 7.1 Modelo Entidad-Relación

```plantuml
@startuml
skinparam linetype ortho
hide methods
hide stereotypes

entity "Usuario" as Usuario {
  * id : INT
  --
  tipo_doc : VARCHAR(10)
  num_doc : VARCHAR(50)
  nombres : VARCHAR(100)
  apellidos : VARCHAR(100)
  correo : VARCHAR(150)
  clave_hash : VARCHAR(255)
  rol : VARCHAR(20)
  fecha_registro : TIMESTAMP
}

entity "SolicitudVendedor" as SolicitudVendedor {
  * id : INT
  --
  usuario_id : INT <<FK>>
  radicado : VARCHAR(50)
  estado : VARCHAR(20)
  docs_url : JSON
  datacredito_val : VARCHAR(20)
  cifin_val : VARCHAR(20)
  antecedentes_val : BOOLEAN
}

entity "Suscripcion" as Suscripcion {
  * id : INT
  --
  vendedor_id : INT <<FK>>
  tipo : VARCHAR(20)
  fecha_inicio : DATE
  fecha_fin : DATE
  estado : VARCHAR(20)
}

entity "Producto" as Producto {
  * id : INT
  --
  vendedor_id : INT <<FK>>
  nombre : VARCHAR(150)
  categoria : VARCHAR(50)
  precio : DECIMAL
  stock : INT
  estado : VARCHAR(20)
}

entity "Compra" as Compra {
  * id : INT
  --
  comprador_id : INT <<FK>>
  fecha : TIMESTAMP
  total : DECIMAL
  estado_pago : VARCHAR(20)
  tipo_entrega : VARCHAR(50)
}

entity "DetalleCompra" as DetalleCompra {
  * id : INT
  --
  compra_id : INT <<FK>>
  producto_id : INT <<FK>>
  cantidad : INT
  precio_unitario : DECIMAL
}

Usuario ||--o| SolicitudVendedor
Usuario ||--o{ Suscripcion
Usuario ||--o{ Producto
Usuario ||--o{ Compra

Compra ||--|{ DetalleCompra
Producto ||--o{ DetalleCompra

@enduml
```

### 7.2 Descripción de Entidades Principales

| Entidad | Descripción | Atributos clave |
|---|---|---|
| **Usuario** | Centraliza todos los actores del sistema (Vendedor, Comprador, Admin, Director). El atributo `rol` determina el perfil. | `clave_hash` (BCrypt), `rol` |
| **SolicitudVendedor** | Registra el proceso de onboarding del vendedor, incluyendo resultados de verificación crediticia y judicial. | `estado` (PENDIENTE/APROBADA/RECHAZADA/DEVUELTA/ACTIVA), `datacredito_val`, `cifin_val`, `antecedentes_val` |
| **Suscripcion** | Controla la vigencia del vendedor en la plataforma. El campo `estado` soporta los estados EN MORA y CANCELADA. | `tipo` (mensual/semestral/anual), `estado` |
| **Producto** | Catálogo de productos publicados por vendedores activos. `docs_url` en `SolicitudVendedor` y las imágenes de `Producto` referencian rutas en el NAS. | `categoria`, `precio`, `stock` |
| **Compra** | Encabezado de la transacción de compra. | `estado_pago`, `tipo_entrega` |
| **DetalleCompra** | Ítem por ítem de cada compra (relación M:N entre Compra y Producto). | `cantidad`, `precio_unitario` |

---

## 8. Requerimientos No Funcionales

Extraídos del enunciado del sistema y formalizados según categorías funcionales.

| ID | Nombre | Prioridad | Descripción resumida |
|---|---|---|---|
| RNF-01 | Seguridad en Autenticación y Contraseñas | Alta | Módulo de autenticación con roles, contraseñas cifradas con BCrypt, comunicaciones HTTPS, correos certificados. |
| RNF-02 | Desempeño y Alta Disponibilidad | Alta | 200.000 usuarios concurrentes, 1.000 TPS, uptime 99,7%, centro de datos alterno (DRP), backup diario. |
| RNF-03 | Interfaz Gráfica Responsive | Media | Interfaz adaptativa para móvil/tablet/escritorio. Parametrización de imagen corporativa desde panel admin sin tocar código. |
| RNF-04 | Almacenamiento y Crecimiento | Alta | Soporte para crecimiento del 200% en datos y archivos. Backup diario sin afectar producción. |
| RNF-05 | Mantenimiento — Auditoría y Logs | Alta | Registro de auditoría por cada CRUD (acción, usuario, fecha, hora). Log de errores por cada falla. |
| RNF-06 | Tecnología Libre de Licenciamiento | Media | Stack 100% open source en sus últimas versiones estables con soporte activo. |
| RNF-07 | Integración SOAP hacia BI | Media | Servicios expuestos hacia sistemas externos de BI deben usar protocolo SOAP/XML. |

---

## 9. Trazabilidad RNF ↔ Arquitectura

Esta matriz responde directamente a la pregunta del enunciado: ¿en qué vista, en qué capa, en qué componente, en qué clase se está abordando cada RNF?

| RNF | Vista(s) | Capa | Componente / Paquete | Mecanismo concreto |
|---|---|---|---|---|
| **RNF-01** Seguridad | Lógica (N3), Física, Implementación, Datos | Infraestructura / Seguridad / BD | `shared/security`, `api/rest/auth`, HTTPS en balanceador, `Usuario.clave_hash` | BCrypt para hash de contraseñas. HTTPS desde cliente hasta balanceador (TCP 443). Roles en `Usuario.rol` restringen acceso por endpoint. |
| **RNF-02** Desempeño | Física (N1 y N2), Lógica | Infraestructura (clusters) | Cluster Serv. Web, Cluster Serv. App, Cluster BD, Balanceador (HAProxy/Nginx), Data Center DRP | Clusters horizontales absorben 200k usuarios concurrentes. Balanceador distribuye TPS. Failover automático al DRP con replicación síncrona de BD. |
| **RNF-03** Responsive | Implementación, Casos de Uso | Frontend / Admin | `web/assets/styles_responsive`, `web/modules/administracion/parametrizacion`, CU-05 (Administrar Sistema) | SPA con CSS breakpoints. Panel de parametrización de imagen corporativa sin modificar código. |
| **RNF-04** Almacenamiento | Física, Implementación, Datos | Infraestructura / Persistencia / NAS | `NAS_Principal`, `NAS_Alterno`, `infrastructure/persistencia/archivos`, `SolicitudVendedor.docs_url`, `Compra` (historial) | Archivos en NAS (no BLOBs en BD). Replicación NAS→NAS_Alterno via rsync. Cluster BD con réplica para backup sin downtime. |
| **RNF-05** Mantenimiento | Implementación, Lógica, Casos de Uso | Cross-cutting / Negocio / Admin | `shared/auditoria`, `shared/logging`, `web/modules/administracion/auditoria`, `web/modules/administracion/logs_errores` | AOP intercepta toda operación CRUD → escribe en tabla de auditoría. Errores capturados globalmente en `shared/logging` → FileSystem de logs. CU-05 permite consultar desde UI. |
| **RNF-06** Tecnología | Implementación | Todo el stack | Todo el árbol de paquetes | Spring Boot (Apache License), Angular/React (MIT), PostgreSQL (BSD), Nginx (BSD), BCrypt (open source). Sin licencias propietarias en ninguna capa. |
| **RNF-07** Integración SOAP | Lógica (N3), Implementación | API / Integración | `api/soap/bi_exports`, componente `[SOAP Endpoints]` del Nivel 3 | SOAP Endpoints independientes de los REST Controllers. Contrato WSDL versionado. Comunicación cifrada HTTPS / SOAP XML (TCP 443). |

---

## 10. Referencias

| Recurso | Ubicación |
|---|---|
| Contexto y enunciado del taller | [`Taller-6/0-Contexto-Taller-6.md`](../0-Contexto-Taller-6.md) |
| RNF formales (Taller 5) | [`Taller-5/1-RNF.md`](../../Taller-5/1-RNF.md) |
| Cumplimiento RNF detallado | [`Taller-6/Cumplimiento-RNF.md`](../Cumplimiento-RNF.md) |
| Casos de uso (diagramas) | [`Taller-6/Casos-de-Uso/`](../Casos-de-Uso/) |
| Vista Lógica (3 niveles) | [`Taller-6/Vista-Logica/`](../Vista-Logica/) |
| Vista Procesos (3 diagramas) | [`Taller-6/Vista-Procesos/`](../Vista-Procesos/) |
| Vista Física (D2 N1 y N2) | [`Taller-6/Vista-Fisica/`](../Vista-Fisica/) |
| Vista Implementación (ASCII + PNG) | [`Taller-6/Vista-Implementacion/`](../Vista-Implementacion/) |
| Vista Datos (MER PlantUML) | [`Taller-6/Vista-Datos/`](../Vista-Datos/) |
