# Diagrama de Componentes (Nivel 3)

Este diagrama representa el nivel más técnico y detallado (el anterior Nivel 2). Mantiene los contenedores base pero desglosa los componentes internos exactos, librerías y dependencias (State Manager, ORM, clientes HTTP), junto con sus protocolos de comunicación específicos en cada flecha. Se ha estructurado el layout (arriba hacia abajo) para una visualización más limpia, simétrica y estética.

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

' Front a Back
WebClient -down-> API : HTTPS / REST JSON
MobClient -down-> API : HTTPS / REST JSON

' Back a Persistencia
DAL -down-> DB : TCP / JDBC
Services -down-> FS : File I/O

' Back a Externos
Services -down-> ExtCredit : HTTPS / REST
Services -down-> ExtPayment : HTTPS / REST
Services -down-> ExtMail : TCP / SMTP
ExtBI -up-> SOAP : HTTPS / SOAP XML

@enduml
```