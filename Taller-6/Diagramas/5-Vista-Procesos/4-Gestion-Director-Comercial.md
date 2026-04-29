# Diagrama de Procesos (Actividades Concurrentes)

Este diagrama documenta la secuencia dinámica e interacciones para el caso de uso central de "Revisión de Solicitudes de Vendedor por el Director Comercial" (alineado con `Casos-de-Uso/4-Gestion-Director-Comercial.md`). 

Se detalla a mayor profundidad la arquitectura de procesos separando las responsabilidades en múltiples carriles (swimlanes), diferenciando el sistema central de las integraciones (Web Service y Base de Datos Local). Se han ajustado los textos para optimizar el espacio horizontal y el flujo se presenta de forma secuencial para mayor claridad visual.

```plantuml
@startuml
|Director Comercial|
start
:Consultar Solicitudes\nPendientes;
:Filtrar por ID,\nEstado o Fecha;
:Seleccionar una Solicitud\n(Estado: PENDIENTE);

|Sistema E-Commerce|
:Solicitar validación de\nantecedentes financieros;

|Datacrédito (WS)|
:Procesar consulta por\nnúmero de identificación;
:Retornar calificación\n(Alta / Baja / Advertencia);

|BD Local (CIFIN)|
:Buscar registro en DB\n(Cargado previamente\ndesde FileSystem);
:Retornar calificación\n(Alta / Baja / Advertencia);

|Sistema E-Commerce|
:Consolidar calificaciones\nfinancieras;
:Requerir validación de\nantecedentes judiciales;

|Director Comercial|
:Realizar Consulta Manual\nen plataforma de la\nPolicía Nacional;
:Registrar Resultado\nen el sistema\n(Requerido / No Requerido);

|Sistema E-Commerce|
:Evaluar Reglas\nde Negocio;
if (Vida crediticia Baja\nen alguna OR\nRequerido por justicia) then (Sí)
  :Cambiar Estado a\n**RECHAZADA**;
  :Enviar correo al\nsolicitante con\nmotivo de rechazo;
elseif (Vida crediticia Advertencia\nen alguna y sin Bajas) then (Sí)
  :Cambiar Estado a\n**DEVUELTA**;
  :Enviar correo explicando\nque podrá reactivar con\ncalificación Alta;
else (Alta en ambas\ny No requerido)
  :Cambiar Estado a\n**APROBADA**;
  :Generar credenciales\nde acceso;
  :Enviar correo con credenciales\nal nuevo vendedor;
endif

|Director Comercial|
:Visualizar actualización\nde estado y notificación;
stop
@enduml
```