# Diagrama de Actividades - Registro de Vendedor

## Contexto: E-Commerce Comercial Konrad

```mermaid
flowchart TD
    A((Inicio)) --> B[Ingresar datos personales y adjuntar documentos]
    B --> C{¿Persona natural o jurídica?}
    C -->|Natural| D[Validar documentos persona natural]
    C -->|Jurídica| E[Validar documentos persona jurídica]
    D --> F{¿Datos y documentos válidos?}
    E --> F
    F -->|No| B
    F -->|Sí| G[Registrar solicitud como PENDIENTE]
    G --> H[Mostrar número de solicitud]
    H --> I((Fin))
```

## Listado de Actividades

| #   | Actividad                                                  |
| --- | ---------------------------------------------------------- |
| 1   | Ingresar datos personales y adjuntar documentos requeridos |
| 2   | Verificar tipo de persona (natural o jurídica)             |
| 3   | Validar formato de datos y documentos completos            |
| 4   | Registrar solicitud en estado PENDIENTE                    |
| 5   | Mostrar número de solicitud al solicitante                 |
