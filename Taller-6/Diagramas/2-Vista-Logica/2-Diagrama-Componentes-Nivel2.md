# Diagrama de Componentes (Nivel 2)

Este diagrama conserva las mismas cajas (contenedores) del Nivel 1, mostrando componentes internos agrupados y comprimidos de forma genérica (capas principales). Las conexiones detallan los protocolos de comunicación de forma sencilla.

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