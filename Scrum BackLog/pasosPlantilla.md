# Guía de Diligenciamiento del Product Backlog

Para mantener nuestro Product Backlog organizado y útil para el equipo de desarrollo, cada nueva funcionalidad o requerimiento debe registrarse siguiendo estos 6 pasos exactos:

### Paso 1: Asignar un Identificador Único (ID)
Cada tarea debe tener un código irrepetible para poder rastrearla fácilmente en las reuniones y en el código. 
* **Cómo llenarlo:** Usa un prefijo relacionado al proyecto o módulo, seguido de un consecutivo numérico. Por ejemplo: `US-001` (User Story 1) o `REQ-015`.

### Paso 2: Redactar la Historia de Usuario (User Story)
Aquí no describimos funciones técnicas, sino la necesidad desde el punto de vista del usuario final.
* **Cómo llenarlo:** Obligatoriamente debes usar la estructura estándar ágil: *"Como [rol del usuario], quiero [acción o deseo], para [beneficio o valor esperado]"*. 

### Paso 3: Definir la Prioridad (Método MoSCoW)
No todo puede ser "Urgente". El Product Owner debe clasificar qué tan vital es esta historia para el producto.
* **Cómo llenarlo:** Usa una de las 4 etiquetas del método MoSCoW:
  * **Must Have:** Crítico. Sin esto, el producto no funciona (MVP).
  * **Should Have:** Importante, pero el producto sobrevive sin él a corto plazo.
  * **Could Have:** Deseable (un "nice to have") si hay tiempo de sobra.
  * **Won't Have:** Descartado para esta versión, se evaluará a futuro.

### Paso 4: Estimar el Esfuerzo (Puntos de Historia)
Todo el equipo de desarrollo se reúne (Planning Poker) para decidir qué tan compleja es la tarea. No se mide en horas, sino en esfuerzo relativo.
* **Cómo llenarlo:** Asigna un número usando la serie de Fibonacci (1, 2, 3, 5, 8, 13...). Un 1 es un cambio minúsculo; un 13 es una tarea gigante que probablemente deba dividirse.

### Paso 5: Listar los Criterios de Aceptación
Estas son las reglas del juego. Son las condiciones que el desarrollador debe cumplir para que la historia se considere "Terminada" (Definition of Done).
* **Cómo llenarlo:** Escribe una lista de viñetas claras y testeables. Ejemplo: "1. El botón debe ser verde. 2. Debe cargar en menos de 2 segundos. 3. Debe mostrar un mensaje de error si la contraseña es incorrecta".

### Paso 6: Asignar el Sprint (Release Planning)
Una vez que el backlog está priorizado y estimado, decidimos en qué iteración de trabajo se va a desarrollar.
* **Cómo llenarlo:** Indica el Sprint objetivo. Por ejemplo: `Sprint 1` (si es parte del MVP inicial), `Sprint 2`, o déjalo en `Backlog General` si aún no está planificado.


