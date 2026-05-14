# Resumen de Desarrollo y Actualización de Frontend

Este documento resume las tareas realizadas para establecer el esqueleto base de la aplicación Frontend (Mobile y Web) del sistema de PQRS, así como las mejoras de seguridad implementadas en la gestión de dependencias.

## 🛠️ Tareas Realizadas

1. **Migración a PNPM (Seguridad)**
   - Se eliminaron los rastros de `npm` (`node_modules` y `package-lock.json`).
   - Se reinstalaron las dependencias utilizando `pnpm` para generar un `pnpm-lock.yaml` seguro.
   - Se añadió un script `"preinstall": "npx only-allow pnpm"` en el `package.json` para bloquear el uso accidental de gestores vulnerables.

2. **Implementación de Layouts Móviles (App Cliente)**
   - Se tradujeron los mockups HTML a componentes nativos de Angular/Ionic con TailwindCSS.
   - Componentes integrados: `login`, `radicar`, `historial`, `detalle`.
   - Se enlazaron los botones para simular el flujo de navegación real.

3. **Implementación de Layouts Web (App Gestor)**
   - Se tradujeron los mockups HTML a componentes de Angular/Ionic con TailwindCSS adaptados para pantallas grandes (Sidebars, Dashboards).
   - Componentes integrados: `login`, `dashboard`, `tramite`.
   - Se enlazaron las acciones (como el botón "Tramitar" de la tabla) para simular la navegación del gestor.

4. **Configuración de Enrutamiento (`app-routing.module.ts`)**
   - Se estructuraron las rutas dividiéndolas en `/mobile/...` y `/web/...`.
   - Se dejó la ruta raíz (`/`) para que redirija por defecto a `/mobile/login`.

---

## 🚀 Comandos para Arrancar el Proyecto

Abre tu terminal, asegúrate de tener `pnpm` instalado y ejecuta los siguientes comandos:

```bash
# 1. Ubicarse en el directorio de la aplicación frontend
cd Proyecto-Final/frontend/pqrs-app

# 2. Instalar dependencias (si es necesario)
pnpm install

# 3. Levantar el servidor de desarrollo
pnpm start
# (O alternativamente: pnpm exec ionic serve)
```

---

## 📱 Cómo probar la parte Móvil (Cliente)

1. Una vez que el servidor esté corriendo, abre tu navegador.
2. Ingresa a la ruta: [http://localhost:4200/mobile/login](http://localhost:4200/mobile/login) (o simplemente a la raíz `http://localhost:4200/`).
3. Presiona **F12** para abrir las herramientas de desarrollador (DevTools).
4. Activa la **Vista de Dispositivo** (Toggle Device Toolbar) para simular la pantalla de un celular (ej. iPhone 12 SE o Pixel 5).
5. Navega libremente interactuando con los botones de la interfaz.

## 💻 Cómo probar la parte Web (Gestor)

1. En el mismo navegador, cambia la URL a: [http://localhost:4200/web/login](http://localhost:4200/web/login).
2. Si tienes abierta la vista de dispositivos de las DevTools, **desactívala** para ver la pantalla completa como si estuvieras en un monitor de escritorio.
3. Inicia sesión simuladamente y prueba el flujo de la bandeja de entrada y el trámite de radicados.

---

## 📝 Propuesta de Commit

A continuación, se detalla el mensaje de commit siguiendo la convención (*Conventional Commits*) para registrar estos cambios en el repositorio:

```text
feat(frontend): migrate to pnpm and implement initial UI layouts

- Switch package manager from npm to pnpm for improved security
- Add preinstall hook to enforce pnpm usage
- Create and style mobile UI components (login, radicar, historial, detalle) based on mockups
- Create and style web UI components (login, dashboard, tramite) based on mockups
- Update app routing to handle /mobile and /web paths independently
```
