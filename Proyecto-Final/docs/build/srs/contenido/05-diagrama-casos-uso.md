# 5. Diagrama de Casos de Uso

El siguiente diagrama presenta la **vista de casos de uso** del MVP del sistema PQRS de SuperMarket. Muestra los 7 casos de uso obligatorios del MVP (CU-01 a CU-07), los 3 actores (Cliente, Gestor, Sistema) y las relaciones de `<<include>>` y `<<extend>>` entre ellos.

![Diagrama general de Casos de Uso del MVP](../../../diagramas/arquitectura/1-vista-casos-uso.png)

Notas:

- **CU-01 (Gestionar Registro)** entra al flujo exclusivamente como `<<include>>` desde CU-03 cuando el número de identificación del cliente no existe en la BD. No hay registro manual independiente en el MVP.
- **CU-03 (Radicar PQRS)** dispara la notificación al actor Sistema como `<<extend>>` asíncrono (envío de correo de confirmación, RF-12).
- **CU-08 (Gestionar Seguridad)** está fuera de alcance del MVP y no aparece en este diagrama. Su especificación se conserva en la sección 6 como referencia para iteraciones post-MVP.
- El actor **Administrador** queda fuera del alcance del MVP. El sistema reserva el rol `admin` en BD para administración futura (auditoría, parametrización) pero no se modela como actor en el MVP.
