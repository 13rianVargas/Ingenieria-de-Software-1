# AGENTS.md — Frontend Mobile (PQRS)

Owner: **Juli Avila** (`@JulianAvila259`).

Aplica a todo lo que viva en `src/app/mobile/`. Reglas globales en [`../../../../AGENTS.md`](../../../../AGENTS.md).

---

## Audiencia

Aplicacion **del Cliente final**. Pantallas pequenas (mobile-first). Empaquetada con **Capacitor** para Android/iOS nativo + tambien corre como PWA en navegador.

---

## Stack

- **Angular 20** — framework principal.
- **Ionic 8** — componentes UI mobile-first (gestos, transitions, plataforma-adaptado).
- **Capacitor** — bridge a APIs nativas (camara, push, storage).
- **Tailwind CSS** — utilidades.
- **TypeScript 5.9** — strict mode.
- **RxJS 7.8** — async streams.
- **Karma + Jasmine** — unit tests.

---

## Modulos actuales

```
src/app/mobile/
├── login/        # autenticacion cliente
├── radicar/      # crear nuevo PQRS (form + adjuntos)
├── historial/    # lista de PQRS del cliente
└── detalle/      # detalle + seguimiento de un radicado
```

Cada modulo: `*.module.ts`, `*-routing.module.ts`, `*.page.ts/html/scss`, `*.page.spec.ts`.

---

## Patrones

### Estructura por feature

Cada nueva pantalla = un modulo lazy-loaded:

```typescript
// app-routing.module.ts
{
  path: 'mobile/perfil',
  loadChildren: () => import('./mobile/perfil/perfil.module').then(m => m.PerfilPageModule),
  canActivate: [authGuard],
  data: { roles: ['cliente'] }
}
```

### Componentes Ionic mobile

Preferir componentes con comportamiento nativo:

- `<ion-content>` con `scroll-events` para infinite scroll.
- `<ion-refresher>` para pull-to-refresh.
- `<ion-modal>` y `<ion-action-sheet>` sobre dialogs custom.
- `<ion-back-button>` con `defaultHref` para navegacion atras.

### Formularios

**Reactive Forms.** Validar mientras el usuario tipea, mostrar errores en vivo:

```typescript
radicarForm = this.fb.nonNullable.group({
  tipo: ['', Validators.required],
  asunto: ['', [Validators.required, Validators.maxLength(200)]],
  descripcion: ['', [Validators.required, Validators.minLength(20)]],
});
```

### Inyeccion

```typescript
export class RadicarPage {
  private readonly pqrsService = inject(PqrsService);
  private readonly toast = inject(ToastController);
  // ...
}
```

### HTTP

Usar `HttpClient` con interceptor de auth ya configurado en `core/interceptors/`. NO llamar `fetch` directo.

### Capacitor APIs

Para acceso nativo (camara, archivos):

```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

const photo = await Camera.getPhoto({
  resultType: CameraResultType.Uri,
  quality: 80,
});
```

Cuando agregues plugin Capacitor: `pnpm add @capacitor/<plugin>` + `npx cap sync`.

### Estilos

- Tailwind utility-first. Responsive default = mobile, breakpoints `sm:` `md:` para tablet.
- Usar `safe-area-inset-*` para notches/home indicator en iOS.
- Theming dark/light: `prefers-color-scheme` + variables CSS Ionic.

### Gestos y feedback

- Loading state visible en cada llamada async (`<ion-skeleton-text>` o spinner).
- Haptics suave en acciones importantes (`Haptics.impact()` de Capacitor).
- Toast/alert para errores, no `console.error`.

---

## Reglas de codigo

| Elemento | Convencion |
|---|---|
| Componentes, clases | PascalCase (`RadicarPage`) |
| Selectors | kebab-case (`app-radicar`) |
| Servicios | PascalCase con sufijo `Service` |
| Archivos | kebab-case (`radicar.page.ts`) |
| Variables, metodos | camelCase |
| Indentacion | 2 espacios |
| `any` | evitar — usa tipos especificos |
| `console.log` | eliminar antes del PR |

---

## Tests

- **Unit:** Karma + Jasmine. Spec por componente y servicio.
- **Coverage:** apuntar a >= 60%.
- **Mock de Ionic controllers:** `jasmine.createSpyObj` con metodos relevantes.

```bash
pnpm test                                    # interactivo
pnpm test -- --watch=false                   # single run para CI
pnpm test -- --include=**/radicar.spec.ts    # solo uno
```

---

## Archivos compartidos — coordinar con Santi

Si tocas estos, avisa antes y asigna a Santi como reviewer:

- `src/app/core/` — services, guards, interceptors, models.
- `src/app/shared/` — componentes/pipes reutilizables.
- `src/theme/` — variables Tailwind/Ionic.
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `angular.json`, `tsconfig*.json`.
- `capacitor.config.ts` — config Capacitor.

---

## Reglas operativas

- **No** dupliques codigo que ya esta en `core/` o `shared/`. Si falta, agregalo ahi con review de Santi.
- **No** crees rutas fuera de `/mobile/*`. La parte web vive en `/web/*` y la gestiona Santi.
- **No** importes desde `../web/` ni viceversa. Si necesitas codigo cross, ponlo en `core/` o `shared/`.
- **No** llames APIs sin pasar por servicios. Componentes consumen services.
- **No** hardcodees URLs. Usa `environment.ts`.
- **No** asumas conexion estable — implementa retry y mensajes de error.
- **Si** un endpoint backend no existe, abre Issue. No inventes el contrato.
- **Si** sumas plugin Capacitor, documenta en este AGENTS.md y avisa al equipo.

---

## Que hacer cuando

| Situacion | Accion |
|---|---|
| Necesito acceso a camara/geo/storage nativo | Buscar plugin Capacitor oficial, `pnpm add` + `cap sync` |
| Build PWA distinto a build Android | Configurar via `angular.json` configurations + Capacitor |
| Diseño rompe en iPhone notch | Aplicar `pt-safe`, `pb-safe` (Tailwind safe area) o `padding: var(--ion-safe-area-top)` |
| Endpoint backend pide payload distinto | Avisar a Juli Criollo, actualizar modelo en `core/models/` |
| CI lint reclama imports muertos | `pnpm run lint --fix` |
| Karma no encuentra dependencia | `pnpm install` (lockfile out of sync) |
