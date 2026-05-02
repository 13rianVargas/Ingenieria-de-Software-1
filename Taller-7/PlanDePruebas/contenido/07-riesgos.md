# Dependencias y Riesgos

## Riesgos del Proceso de Pruebas

| ID  | Riesgo | Probabilidad | Impacto | Mitigación |
|-----|--------|-------------|---------|------------|
| R-1 | La especificación funcional es narrativa (sin prototipo ejecutable), lo que puede generar ambigüedad en el resultado esperado | Media | Medio | Basar el resultado esperado estrictamente en el enunciado del taller; documentar supuestos explícitamente en cada caso |
| R-2 | Tiempo insuficiente para ejecutar todos los casos diseñados | Media | Alto | Priorizar casos de prioridad alta *(priority:alta)* y de humo *(test:smoke)*; ejecutar los críticos primero |
| R-3 | Cambio retroactivo en la especificación funcional | Baja | Alto | Congelar el enunciado del taller como referencia; cualquier cambio requiere re-revisión de los casos afectados |
| R-4 | Disponibilidad de integrantes del equipo para ejecución | Media | Medio | Distribuir casos por HU desde el inicio; cada analista responsable de su subconjunto |
| R-5 | Issues de GitHub mal configurados (etiquetas o hitos faltantes) | Baja | Bajo | Verificar la taxonomía de etiquetas antes de crear el primer caso de prueba |
| R-6 | Dependencia con servicios externos (Datacredito, CIFIN, Policía Nacional) | Alta | Alto | Excluir del alcance de pruebas según sección Alcance |

## Dependencias

- **Funcional**: los casos de prueba dependen del enunciado del taller.
  Si la especificación cambia, los casos deben revisarse.
- **Ambiente**: las pruebas de HU-1 y HU-2 se basan en la especificación
  narrativa del enunciado del taller. No existe prototipo ejecutable en
  este contexto académico.
- **Repositorio**: la configuración de GitHub Issues (etiquetas, hitos y
  plantillas) debe estar completa antes de crear los casos de prueba.
