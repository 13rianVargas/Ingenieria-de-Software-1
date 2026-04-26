# Topología de Despliegue (Nivel 1)

Este diagrama representa la infraestructura general del sistema y los nodos físicos, incluyendo el centro de datos alterno para cumplir con el RNF-02 (Alta disponibilidad 99,7% y Recuperación ante desastres).

```plantuml
@startuml
skinparam linetype ortho
node "Dispositivo Cliente\n(Browser / Móvil)" as Cliente

cloud "Internet" as Internet

node "Data Center Principal" {
  node "Balanceador de Carga" as LB_Principal
  node "Cluster Servidores Web" as Web_Principal
  node "Cluster Servidores App" as App_Principal
  node "Servidor de Almacenamiento (NAS)" as NAS_Principal
  database "Cluster Base de Datos (Master)" as DB_Principal
}

node "Data Center Alterno (DRP)" {
  node "Balanceador Alterno" as LB_Alterno
  node "Cluster Servidores Web Alterno" as Web_Alterno
  node "Cluster App Alterno" as App_Alterno
  node "Servidor de Almacenamiento (NAS)" as NAS_Alterno
  database "Base de Datos (Standby)" as DB_Alterno
}

cloud "Servicios Externos" {
  node "Pasarela Pagos API" as Pagos
}

Cliente --> Internet : HTTPS
Internet --> LB_Principal
Internet ..> LB_Alterno : "Failover"

LB_Principal --> Web_Principal
Web_Principal --> App_Principal
App_Principal --> DB_Principal
App_Principal --> NAS_Principal

LB_Alterno --> Web_Alterno
Web_Alterno --> App_Alterno
App_Alterno --> DB_Alterno
App_Alterno --> NAS_Alterno

DB_Principal ..> DB_Alterno : "Replicación Síncrona/Asíncrona"
NAS_Principal ..> NAS_Alterno : "Replicación de Archivos"

App_Principal --> Pagos : HTTPS
App_Alterno --> Pagos : HTTPS

@enduml
```