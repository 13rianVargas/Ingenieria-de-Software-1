# Cumplimiento de Requerimientos No Funcionales (RNF)

A continuación, se detalla de qué manera la arquitectura diseñada y plasmada en los distintos diagramas (PlantUML) resuelve y da cumplimiento a los Requerimientos No Funcionales (RNF) definidos en el `Taller-5/1-RNF.md`.

---

## 1. RNF-01: Seguridad en Autenticación y Contraseñas

**Descripción breve:** El sistema debe asegurar el acceso, gestionar perfiles, validar y cifrar contraseñas (mínimo 8 caracteres, mayúsculas, minúsculas, números) y usar canales seguros.

**¿Cómo se aborda arquitectónicamente?**

*   **Vista Lógica (Nivel 1):** Se diseñó un paquete específico llamado `Módulo de Seguridad`, que aísla las responsabilidades de "Autenticación y Autorización" y "Criptografía de Contraseñas", asegurando que la lógica de validación de los criterios de complejidad esté centralizada.
*   **Vista de Implementación (Diagrama de Componentes):** Se introdujo explícitamente el uso de la librería externa `Librería Encriptación BCrypt` para asegurar que las contraseñas nunca se almacenen en texto plano. Todos los componentes transaccionales son expuestos a través de una interfaz `REST / HTTPS`, exigiendo comunicación cifrada.
*   **Vista Física (Topología de Despliegue):** El diagrama evidencia que la comunicación desde el `Dispositivo Cliente` hasta el `Balanceador de Carga` a través de Internet se realiza exclusivamente vía `HTTPS`.
*   **Vista de Datos (Modelo ER):** En la entidad `Usuario`, el atributo correspondiente a la contraseña se ha nombrado intencionalmente como `clave_hash`, indicando que a nivel de persistencia de base de datos se guarda el dato encriptado. El atributo `rol` garantiza la división de perfiles y permisos (Admin, Vendedor, Comprador).

---

## 2. RNF-02: Desempeño y Alta Disponibilidad

**Descripción breve:** Soporte para 200.000 usuarios concurrentes, 1.000 TPS, 99,7% de disponibilidad (uptime) y centro de datos alterno para Disaster Recovery (DRP).

**¿Cómo se aborda arquitectónicamente?**

*   **Vista Física (Topología Nivel 1):** Es la vista que ataca directamente este RNF. Se modelaron explícitamente **Clústeres** (Cluster Servidores Web, Cluster Servidores App, Cluster Base de Datos Master), en lugar de nodos únicos, lo que provee tolerancia a fallos y capacidad de escalamiento horizontal (para soportar las 1.000 TPS).
*   **Vista Física (Centro de Datos Alterno):** El diagrama Nivel 1 muestra un nodo paralelo completo etiquetado como `Data Center Alterno (DRP)`, con un `Balanceador Alterno` y `Base de Datos (Standby)`. Se ilustra la relación de `"Failover"` desde Internet y la `"Replicación Síncrona/Asíncrona"` entre la BD principal y la alterna, mitigando desastres.
*   **Vista Lógica y de Implementación:** El uso de un `API Gateway` permite gestionar el enrutamiento y balanceo de peticiones internas, evitando cuellos de botella en la comunicación directa cliente-servidor.

---

## 3. RNF-03: Interfaz Gráfica y Diseño Adaptativo (Responsive)

**Descripción breve:** Interfaz responsive para diferentes pantallas (smartphones, tablets, escritorio) e imagen corporativa parametrizable desde un panel administrativo.

**¿Cómo se aborda arquitectónicamente?**

*   **Vista de Implementación (Diagrama de Componentes):** En la Capa Frontend, el nodo principal se especifica como `App E-Commerce (Web Responsive)`, documentando que el software que interactuará con el usuario se construirá utilizando Single Page Applications (ej. React o Angular) o tecnologías de Progressive Web App (`App Móvil (PWA)`) que adaptan el DOM automáticamente a cualquier resolución mediante CSS breakpoints y diseños fluidos.
*   **Vista de Casos de Uso (Administrador del Sistema):** En el diagrama general y en el específico de Administración, se incluye el caso de uso `Parametrizar Imagen Corporativa`. El actor `Administrador` interactúa directamente con este caso, garantizando que el requerimiento de parametrizar logos y colores sin desarrollo de código esté contemplado como parte de las funciones base del sistema.
*   **Vista Lógica (Paquetes):** El `Módulo Web y UI` incluye el `Dashboard Director/Admin` como interfaz dedicada desde donde se consume la parametrización de los temas visuales.

---

## 4. RNF-04: Almacenamiento y Crecimiento de Datos

**Descripción breve:** El sistema debe soportar un crecimiento esperado del 200% en documentos, archivos y datos, con backup diario de la base de datos sin afectar la operación.

**¿Cómo se aborda arquitectónicamente?**

*   **Vista Física (Topología Nivel 1 — Data Center Principal):** Se modela explícitamente un nodo independiente `Servidor de Almacenamiento (NAS)`, separado del cluster de base de datos. Esto permite escalar el almacenamiento de archivos planos (CIFIN, consignaciones, documentos adjuntos de solicitudes) de forma horizontal sin impactar la BD relacional. El nodo `NAS_Alterno` en el Data Center DRP garantiza replicación de archivos.
*   **Vista Física (Replicación):** La relación `"Replicación de Archivos"` entre `NAS_Principal` y `NAS_Alterno`, y la `"Replicación Síncrona/Asíncrona"` entre clusters de BD, aseguran que el backup diario se materialice en el centro alterno sin ventana de parada en producción.
*   **Vista de Implementación (Capa Infraestructura):** El paquete `infrastructure/persistencia/archivos` gestiona la escritura y lectura de archivos planos en el FileSystem (archivos CIFIN, consignaciones bancarias). El paquete `infrastructure/persistencia/cache` permite separar datos volátiles (sesiones, carrito) del almacenamiento persistente, reduciendo la carga sobre la BD durante picos de tráfico.
*   **Vista de Datos (Modelo ER):** Las entidades `SolicitudVendedor` (atributo `docs_url: JSON`) y `Producto` (imágenes referenciadas) almacenan rutas a archivos en el NAS en lugar de BLOBs en BD, controlando el crecimiento de la base de datos relacional.

---

## 5. RNF-05: Mantenimiento — Auditoría y Log de Errores

**Descripción breve:** El sistema debe registrar auditoría por cada acción CRUD (acción, usuario, fecha, hora) y un log de errores por cada falla producida.

**¿Cómo se aborda arquitectónicamente?**

*   **Vista de Implementación (Paquete `shared`):** Los paquetes `shared/auditoria` y `shared/logging` son componentes transversales del backend. Al estar en `shared` (y no en un módulo de negocio específico), se aplican de forma centralizada a través de interceptores o aspectos AOP, garantizando que TODO CRUD en cualquier módulo quede registrado sin duplicar código.
*   **Vista Lógica (Nivel 2 — Capa de Servicios):** La `Capa de Lógica de Negocio` invoca los servicios de auditoría antes/después de cada operación de escritura, materializando el registro: qué acción, qué usuario (obtenido del contexto de seguridad), cuándo.
*   **Vista de Casos de Uso (Administrador del Sistema):** El diagrama `5-Administracion-Sistema.md` incluye explícitamente los casos de uso `Consultar Auditoría` y `Consultar Logs de Errores` como funciones del actor `Administrador`, cerrando el ciclo: los datos se escriben en `shared/auditoria` y `shared/logging`, y se consumen desde la interfaz de administración.
*   **Vista Física (Topología):** Los logs de error se escriben en el `Servidor de Almacenamiento (NAS)` como archivos separados de los datos transaccionales, facilitando su consulta sin degradar la BD principal.

---

## 6. RNF-06: Tecnología Libre de Licenciamiento

**Descripción breve:** Toda la tecnología utilizada debe ser libre de licenciamiento (open source), en sus últimas versiones estables, reconocidas y con soporte activo.

**¿Cómo se aborda arquitectónicamente?**

*   **Vista de Implementación (Stack tecnológico):** Toda la estructura de paquetes está diseñada para un stack 100% open source:
    - **Backend:** Java (OpenJDK) + Spring Boot → libre de licencia, LTS activo.
    - **Frontend Web:** Angular o React → MIT License, soporte activo de Google/Meta.
    - **Base de Datos:** PostgreSQL → BSD License, reconocida como la BD relacional open source más avanzada.
    - **Servidor Web/Proxy:** Nginx → BSD-like License, estándar de industria.
    - **Librería de Cifrado:** BCrypt (implementación OpenSource) → libre, sin licencia propietaria.
*   **Vista Lógica (Nivel 3):** Los componentes `Data Access Layer (ORM)` hacen referencia al uso de Hibernate/JPA (LGPL), y el `HTTP REST Client` del frontend usa clientes HTTP de código abierto (Axios/Fetch API).
*   **Vista Física (Topología):** Los balanceadores de carga modelados pueden implementarse con HAProxy o Nginx (ambos open source), y el cluster de BD con PostgreSQL Patroni para alta disponibilidad, sin incurrir en licencias propietarias.

---

## 7. RNF-07: Integración mediante SOAP hacia Sistemas Externos (BI)

**Descripción breve:** Los servicios expuestos hacia sistemas externos como BI deben implementarse mediante SOAP.

**¿Cómo se aborda arquitectónicamente?**

*   **Vista Lógica (Nivel 3 — SOAP Endpoints):** El diagrama de Nivel 3 modela explícitamente el componente `[SOAP Endpoints]` como punto de exposición separado de los `[REST API Controllers]`. Ambos conviven en la capa de entrada del backend pero sirven contratos distintos: REST para clientes web/móvil, SOAP para integraciones B2B/BI.
*   **Vista de Implementación (Paquete `api/soap`):** El paquete `api/soap/bi_exports` del backend concentra todos los web services SOAP expuestos hacia herramientas de Business Intelligence externas. Al estar aislado en su propio paquete, el contrato WSDL puede evolucionar sin afectar las APIs REST del frontend.
*   **Vista Lógica (Nivel 3 — Protocolo):** La flecha `ExtBI -up-> SOAP : HTTPS / SOAP XML` documenta que la comunicación desde los sistemas BI externos va cifrada (HTTPS) con payload SOAP XML, cumpliendo tanto el RNF-07 (SOAP) como el RNF-01 de seguridad (HTTPS).
