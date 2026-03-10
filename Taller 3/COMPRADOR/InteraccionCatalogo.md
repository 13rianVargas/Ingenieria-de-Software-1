```mermaid
flowchart TD
    %% Estilos
    classDef startEnd fill:#1a1a1a,stroke:#333,stroke-width:2px,color:#fff;
    classDef state fill:#004d99,stroke:#003366,stroke-width:2px,color:#fff;
    classDef interaction fill:#660066,stroke:#4d004d,stroke-width:2px,color:#fff;
    classDef decision fill:#006622,stroke:#004411,stroke-width:2px,color:#fff;

    A([Inicio: Visitante en el E-Commerce]) ::: startEnd --> B{¿Está registrado?} ::: decision
    
    %% Registro
    B -- No --> C[Diligencia Formulario de Registro<br>Nombres, ID, País, Redes, etc.]
    C --> D[Sistema envía credenciales por correo]
    D --> E[Inicio de Sesión] ::: state
    B -- Sí --> E
    
    %% Búsqueda
    E --> F[Busca productos por criterios:<br>Nombre, Cat, Subcat, Precio, Palabra clave] ::: interaction
    F --> G[Sistema muestra listado:<br>Imagen principal, Precio, Características, Categoría]
    
    %% Detalle e Interacción
    G --> H[Comprador selecciona un producto]
    H --> I[Ver Detalle:<br>Imágenes, reputación, comentarios y preguntas] ::: state
    
    I --> J{Acciones sobre el producto} ::: decision
    J -- Duda --> K[Realizar pregunta al vendedor] ::: interaction
    J -- Interés --> L([Agregar al Carrito de Compras]) ::: startEnd
```