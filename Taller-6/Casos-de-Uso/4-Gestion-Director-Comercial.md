# Caso de Uso: Gestión del Director Comercial

Diagrama específico para las actividades del Director Comercial, incluyendo la revisión de solicitudes, validación de antecedentes y uso del tablero de control (BAM).

```plantuml
@startuml
left to right direction

actor "Director Comercial" as Director

rectangle "Módulo de Gestión Comercial" {
  usecase "Consultar Solicitudes Pendientes" as UC1
  usecase "Aprobar/Rechazar/Devolver Solicitud" as UC2
  usecase "Validar Antecedentes Judiciales" as UC3
  usecase "Validar Estado Financiero" as UC3_1
  usecase "Ver Tablero de Control (BAM)" as UC4
  usecase "Gestionar Tendencias y Promociones" as UC5
}

Director --> UC1
Director --> UC2
Director --> UC3
Director --> UC3_1
Director --> UC4
Director --> UC5

UC2 ..> UC3 : <<include>>
UC2 ..> UC3_1 : <<include>>

@enduml
```