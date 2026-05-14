# Arquitectura Frontend - E-Commerce Comercial Konrad

Este directorio contiene la implementación del lado del cliente (Frontend) para el sistema de PQRS de SuperMarket. 

Para cumplir a cabalidad con los requerimientos técnicos y de negocio optimizando tiempos, se ha adoptado una arquitectura **Monorepo (Single Codebase)**. Esto significa que **tanto la Aplicación Web (Gestor) como la App Móvil (Cliente)** comparten el mismo repositorio y la misma base de código.

## 🛠️ Stack Tecnológico Seleccionado

*   **Angular:** Framework principal estructurado y robusto (Exigido en el contexto funcional).
*   **Ionic Framework:** Librería de componentes UI híbrida que se adapta visualmente a iOS, Android y Web nativamente.
*   **TailwindCSS:** Framework de CSS utilitario para acelerar la maquetación y cumplir con el diseño responsivo (**RNF-03**).
*   **Capacitor:** Herramienta de Ionic para compilar el código web a binarios nativos móviles (`.apk` / `.ipa`).

## 📂 Estructura del Proyecto (`pqrs-app/`)

Se ha diseñado la siguiente estructura lógica dentro del proyecto para separar las vistas según el rol, compartiendo la lógica de negocio:

```text
frontend/
└── pqrs-app/               <-- Raíz del proyecto
    ├── android/            <-- Binarios Android (Generados por Capacitor)
    ├── ios/                <-- Binarios iOS (Generados por Capacitor)
    ├── src/
    │   ├── app/
    │   │   ├── core/       <-- Lógica global: Servicios API REST, Autenticación, Guards.
    │   │   ├── shared/     <-- Componentes UI compartidos (Modales, Alertas, Botones Tailwind).
    │   │   ├── mobile/     <-- Páginas exclusivas de la App Cliente (Radicación, Historial).
    │   │   └── web/        <-- Páginas exclusivas de la App Web (Bandeja Gestor, Reportes).
    │   ├── assets/         <-- Imágenes institucionales, Logos, PDFs base.
    │   ├── theme/          <-- Variables globales de Theming (Colores de SuperMarket).
    │   └── environments/   <-- Variables de entorno (URLs del Backend).
    ├── tailwind.config.js  <-- Configuración de Theming y Responsive.
    └── capacitor.config.ts <-- Configuración de empaquetado móvil.
```

## 🎯 Cumplimiento de Requerimientos No Funcionales (RNF)

1.  **RNF-01 (Arquitectura Tecnológica):** Al usar Angular, se cumple la exigencia del cliente. Capacitor resuelve el despliegue dual (Web y Móvil).
2.  **RNF-02 (Seguridad):** El enrutamiento de Angular estará protegido por *Guards* que verificarán el rol (Cliente/Gestor) antes de cargar los módulos `mobile/` o `web/`.
3.  **RNF-03 (Interfaz Adaptativa y Theming):** TailwindCSS maneja las reglas *Responsive* fluidas, e Ionic provee componentes de tamaño táctil adecuado para móviles. El Theming corporativo se controla desde `theme/variables.scss`.

## 🚀 Comandos para Desarrolladores

Para iniciar el entorno de desarrollo local, ubícate en la carpeta `pqrs-app` y ejecuta:

```bash
# 1. Instalar dependencias
pnpm install

# 2. Levantar servidor local (Web)
pnpm exec ionic serve

# 3. Compilar y sincronizar para Móvil (Android)
pnpm exec ionic build
pnpm exec cap sync android
pnpm exec cap open android
```
