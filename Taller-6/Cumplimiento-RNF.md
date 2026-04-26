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
