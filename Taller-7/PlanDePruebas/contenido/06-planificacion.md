# Planificación y Organización

## Procedimientos para las Pruebas

El proceso de pruebas sigue el siguiente flujo de trabajo:

1. **Diseño**: cada caso de prueba se documenta como un issue de GitHub
   usando la plantilla de caso de prueba. El identificador sigue el
   formato TC-NN (por ejemplo, TC-01, TC-02).
2. **Revisión**: el Líder de Pruebas verifica precondiciones, datos de
   prueba y resultado esperado antes de marcar el caso como listo para
   ejecutar. El issue pasa a estado pendiente *(status:pending)*.
3. **Asignación**: el issue se asigna a un Analista de Pruebas y se
   ubica en la columna Por ejecutar del tablero de seguimiento.
4. **Ejecución**: el analista ejecuta el caso, documenta el resultado
   obtenido en un comentario del issue con evidencia (capturas o logs).
   El estado pasa a en ejecución *(status:in-progress)*.
5. **Cierre del caso**: si el caso pasa, el estado cambia a aprobado
   *(status:passed)* y el issue se cierra. Si falla, el estado cambia a
   fallido *(status:failed)*, el issue permanece abierto y se crea un
   reporte de defecto enlazado al caso original.
6. **Seguimiento de defectos**: los defectos se priorizan por severidad.
   Los de severidad crítica *(severity:critical)* suspenden la ejecución
   hasta su corrección.
7. **Reejecución**: al corregir un defecto, el Analista reejata el caso
   original y actualiza su estado en el mismo issue. No se abre un issue
   duplicado.

## Matriz de Responsabilidades (RACI)

| Actividad | Líder de Pruebas | Analista de Pruebas | Revisor de Documentos |
|---|---|---|---|
| Diseño del Plan de Pruebas | R | C | I |
| Diseño de Casos de Prueba | A | R | I |
| Configuración GitHub Issues | R | I | I |
| Creación de casos de prueba | A | R | I |
| Ejecución de casos de prueba | A | R | I |
| Reporte de defectos | A | R | I |
| Revisión de evidencias | R | C | I |
| Generación del documento | R | I | A |
| Revisión final del documento | A | C | R |
| Entrega académica | R | I | I |

**R** = Responsable (ejecuta) · **A** = Aprobador · **C** = Consultado · **I** = Informado

## Cronograma

| Hito | Dependencia | Fecha estimada |
|------|-------------|----------------|
| Configuración GitHub Issues completada | — | 1 de mayo de 2026 |
| Diseño de casos de prueba HU-1 completado | Configuración GitHub Issues | 1 de mayo de 2026 |
| Diseño de casos de prueba HU-2 completado | Configuración GitHub Issues | 1 de mayo de 2026 |
| Ejecución Test Run completada | Diseño de casos de prueba | 3 de mayo de 2026 |
| Defectos documentados | Ejecución Test Run | 3 de mayo de 2026 |
| Documento generado y revisado | Ejecución y defectos | 3 de mayo de 2026 |
| Entrega académica | Documento aprobado | 5 de mayo de 2026 |

## Premisas

- El enunciado del taller es la fuente de verdad para definir el resultado
  esperado en cada caso de prueba.
- Los integrantes del equipo tienen acceso al repositorio de GitHub con
  permisos para crear y gestionar issues.
- No se requiere ambiente de servidor real; las pruebas se basan en la
  especificación funcional del enunciado.
- GitHub Actions está disponible en el repositorio para automatizar
  validaciones sobre el proceso de integración continua y verificar la
  consistencia de los artefactos de prueba.
