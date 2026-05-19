# 8. Anexo — Prototipos (Mockups de UI)

Conforme al estándar IEEE 830, los prototipos de interfaz de usuario se anexan al SRS como **requisitos visuales** que ilustran el comportamiento esperado. Los 7 mockups del MVP están implementados en HTML interactivo y viven en el repositorio bajo `Proyecto-Final/docs/mockups/`.

## 8.1 Catálogo de Prototipos

| # | Pantalla | Tipo | Caso de Uso asociado | Archivo |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Login Cliente | App Móvil | CU-02 | `mockup-mobile-login.html` |
| 2 | Radicar PQRS | App Móvil | CU-03 | `mockup-mobile-radicar.html` |
| 3 | Detalle Radicado | App Móvil | CU-04 | `mockup-mobile-detalle.html` |
| 4 | Mis Radicados (Historial) | App Móvil | CU-04 | `mockup-mobile-historial.html` |
| 5 | Login Gestor | Aplicación Web | CU-02 | `mockup-web-login.html` |
| 6 | Bandeja de Radicados (Dashboard) | Aplicación Web | CU-05, CU-07 | `mockup-web-dashboard.html` |
| 7 | Tramitar Radicado | Aplicación Web | CU-06 | `mockup-web-tramite.html` |

## 8.2 Cobertura de los CUs MVP

- **CU-01 (Gestionar Registro)** — no requiere mockup propio porque el flujo MVP es exclusivamente automático (sin pantalla "Registrarse" independiente). El registro ocurre transparente al cliente durante CU-03.
- **CU-02 (Autenticarse)** — cubierto por `mockup-mobile-login.html` y `mockup-web-login.html`.
- **CU-03 (Radicar PQRS)** — cubierto por `mockup-mobile-radicar.html`.
- **CU-04 (Consultar PQRS Propias)** — cubierto por `mockup-mobile-historial.html` (listado) y `mockup-mobile-detalle.html` (detalle de un radicado).
- **CU-05 (Gestionar Bandeja)** — cubierto por `mockup-web-dashboard.html`.
- **CU-06 (Tramitar PQRS)** — cubierto por `mockup-web-tramite.html`.
- **CU-07 (Generar Reportes)** — reutiliza el dashboard web (`mockup-web-dashboard.html`); el botón "Exportar PDF" forma parte de esa misma pantalla.

## 8.3 Acceso a los prototipos

Los mockups son archivos HTML autocontenidos. Para revisarlos:

1. Clonar el repositorio del proyecto.
2. Abrir cualquier archivo `*.html` dentro de `Proyecto-Final/docs/mockups/` con un navegador moderno (Chrome, Firefox, Safari, Edge).
3. Los mockups son estáticos: no requieren backend ni servidor. Sirven exclusivamente como guía visual de la interfaz esperada.

## 8.4 Reglas de diseño aplicadas

- **Mobile-first** para la App del Cliente (Angular + Ionic + Capacitor).
- **Desktop-first** para la Aplicación Web del Gestor (Angular + Ionic + Tailwind).
- Paleta consistente entre las dos interfaces (definida en los CSS embebidos de los mockups).
- Componentes accesibles: contraste WCAG AA, navegación por teclado, labels asociados a inputs.

> **Nota sobre el alcance MVP**: el mockup [`Taller-4/mockup/Registro.html`](../../../../../Taller-4/mockup/Registro.html) existe como referencia visual de una eventual pantalla de Registro Manual independiente, pero está **fuera del alcance del MVP**. La funcionalidad correspondiente (#17 en `1-Funcionalidades.md`) está clasificada como mejora post-MVP.
