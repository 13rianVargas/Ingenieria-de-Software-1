# Diagrama de Procesos (Actividades Concurrentes)

Este diagrama documenta la secuencia dinámica e interacciones para el caso de uso central de "Aprobación y Validación de Solicitudes de Vendedor", mostrando llamadas a sistemas asíncronos y toma de decisiones, sin integración API hacia Datacrédito.

```plantuml
@startuml
|Director Comercial|
start
:Selecciona "Consultar Solicitudes Pendientes";
:Carga lista de Solicitudes (Estado: PENDIENTE);
:Selecciona una Solicitud;

|Sistema E-Commerce|
:Obtiene datos del Vendedor (ID, Documentos);
:Lee archivo local **CIFIN**;
:Busca coincidencia en DB temporal;
:Retorna calificación CIFIN (Alta, Baja, Advertencia);
:Muestra resultados CIFIN en pantalla;

|Director Comercial|
:Consulta Manual: Datacrédito (Plataforma Externa);
:Consulta Manual: Antecedentes Judiciales (Policía);
:Registra resultados manuales en el sistema;

|Sistema E-Commerce|
if (Datacrédito = Alta AND CIFIN = Alta AND Antecedentes = No Requerido) then (Sí)
  :Cambia Estado a **APROBADA**;
  :Genera credenciales de acceso;
  :Envía correo con credenciales;
elseif (Alguna entidad = Baja OR Antecedentes = Requerido) then (Sí)
  :Cambia Estado a **RECHAZADA**;
  :Envía correo con motivo de rechazo;
else (No, alguna = Advertencia)
  :Cambia Estado a **DEVUELTA**;
  :Envía correo explicando reactivación;
endif

|Director Comercial|
:Notificado de la acción del sistema;
stop
@enduml
```