# Diagrama de Implementación (Componentes)

Este diagrama modela la vista de componentes de software (código, librerías, APIs), sus interfaces provistas y requeridas, destacando la capa web (Responsive) y las integraciones (SOAP para BI según RNF-03 y RNF).

```plantuml
@startuml
package "Capa Frontend (Cliente)" {
  [App E-Commerce (Web Responsive)] as AppWeb
  [App Móvil (PWA)] as AppMovil
  interface "HTTP / REST" as REST_API
}

package "Capa Backend (Servicios)" {
  [API Gateway & Enrutador] as Gateway
  [Componente Seguridad\n(OAuth2/JWT)] as CompSeguridad
  [Componente Ventas\n(Carrito, Productos)] as CompVentas
  [Componente Comercial\n(Solicitudes, Vendedores)] as CompComercial
  
  interface "SOAP Endpoint" as SOAP_BI
  [Componente Reportes (BAM)] as CompBAM
}

package "Librerías / Dependencias" {
  [Librería Encriptación BCrypt] as LibCripto
  [Librería Generador Correos] as LibCorreo
  [ORM (Hibernate/Prisma)] as ORM
}

package "Sistemas Externos" {
  [Sistema BI Corporativo] as SisBI
}

AppWeb --> REST_API : consume
AppMovil --> REST_API : consume

REST_API - Gateway
Gateway --> CompSeguridad
Gateway --> CompVentas
Gateway --> CompComercial
Gateway --> CompBAM

CompSeguridad ..> LibCripto : usa
CompComercial ..> LibCorreo : usa para notificar
CompVentas ..> LibCorreo : usa para confirmación

CompBAM - SOAP_BI
SisBI --> SOAP_BI : consume métricas

CompSeguridad ..> ORM
CompVentas ..> ORM
CompComercial ..> ORM

@enduml
```