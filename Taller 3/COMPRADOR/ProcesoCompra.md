flowchart TD
    %% Estilos
    classDef startEnd fill:#1a1a1a,stroke:#333,stroke-width:2px,color:#fff;
    classDef calculation fill:#b3b300,stroke:#808000,stroke-width:2px,color:#1a1a1a;
    classDef external fill:#cc5200,stroke:#993d00,stroke-width:2px,color:#fff;
    classDef decision fill:#006622,stroke:#004411,stroke-width:2px,color:#fff;

    A([Inicio: Ver Carrito de Compras]) ::: startEnd --> B[Mostrar cantidad de productos<br>y subtotal]
    
    %% Lógica de cálculo de costos
    B --> C{¿Método de entrega?} ::: decision
    C -- Domicilio --> D[Calcular Costo de Envío<br>Depende de: Ciudad + Peso Total] ::: calculation
    C -- Recoger --> E[Costo de Envío = $0] ::: calculation
    
    D --> F[Calcular Total de la Orden]
    E --> F
    
    F --> G[Sumar % Comisión por Categoría] ::: calculation
    G --> H[Sumar IVA aplicable según el producto] ::: calculation
    
    %% Proceso de Pago
    H --> I{Seleccionar Método de Pago} ::: decision
    
    I -- Pagos en línea --> J[Redirección Intermediario / Banco WS] ::: external
    I -- Tarjeta de Crédito --> K[Formulario Pasarela de Pago local] ::: external
    I -- Consignación --> L[Imprimir recibo -> Validar archivo FileSystem diario] ::: external
    
    J --> M{¿Pago Aprobado?} ::: decision
    K --> M
    L --> M
    
    M -- No --> I
    M -- Sí --> N[Compra Exitosa / Orden Generada]
    
    %% Post-Compra
    N --> O[Habilitar Calificación de Transacción]
    O --> P[Comprador asigna puntaje 1 a 10<br>y deja comentarios de atención]
    P --> Q([Fin: Ciclo de Compra Terminado]) ::: startEnd
