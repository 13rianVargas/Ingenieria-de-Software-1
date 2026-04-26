# Diagrama de Clases (Nivel 2)

Este diagrama representa el dominio central del sistema y las relaciones lógicas entre las principales entidades del negocio (Solicitud, Vendedor, Producto, Compra).

```plantuml
@startuml
class Usuario {
  - id: int
  - tipoIdentificacion: String
  - numeroIdentificacion: String
  - nombres: String
  - apellidos: String
  - correo: String
  - clave: String
  - rol: String
  + autenticar(): boolean
}

class Vendedor {
  - pais: String
  - ciudad: String
  - telefono: String
  - estadoSuscripcion: String
  + publicarProducto(): void
}

class Comprador {
  - direccion: String
  - twitter: String
  - instagram: String
  + agregarAlCarrito(): void
  + comprar(): void
}

class SolicitudVendedor {
  - radicado: String
  - estado: String
  - fecha: Date
  - documentos: List<Documento>
  + validarEstado(): String
}

class Producto {
  - codigo: int
  - nombre: String
  - categoria: String
  - precio: double
  - cantidad: int
  - imagenes: List<Image>
  + actualizarStock(): void
}

class Carrito {
  - total: double
  + calcularTotal(): double
  + agregarItem(p: Producto, cant: int): void
}

class Compra {
  - id: int
  - fecha: Date
  - totalPagado: double
  - estadoPago: String
  + procesarPago(): boolean
}

Usuario <|-- Vendedor
Usuario <|-- Comprador

Vendedor "1" -- "*" SolicitudVendedor : "realiza"
Vendedor "1" -- "*" Producto : "publica"

Comprador "1" -- "1" Carrito : "usa"
Carrito "1" *-- "*" Producto : "contiene"
Comprador "1" -- "*" Compra : "realiza"
Compra "1" -- "1" Carrito : "se genera de"

@enduml
```