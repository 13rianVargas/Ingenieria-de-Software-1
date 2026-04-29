# Diagrama de Componentes (Nivel 1)

Este diagrama representa el nivel más alto de abstracción, mostrando únicamente los componentes o contenedores principales del sistema E-Commerce Konrad, sin detalles técnicos ni descripción en sus conexiones.

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
