# AGENTS.md — Frontend Web (PQRS)

Owner: **Santiago RR** (`@SantiagoRR17`).

Aplica a todo lo que viva en `src/app/web/`. Reglas globales en [`../../../../AGENTS.md`](../../../../AGENTS.md).

---

## Audiencia

Aplicacion Web para el **Gestor** y **Administrador**. Pantallas grandes (sidebar + dashboard + tablas). NO es la app movil del cliente.

---

## Stack

- **Angular 20** — framework principal.
- **Ionic 8** — componentes UI (funcionan en desktop tambien).
- **Tailwind CSS** — utilidades de estilo.
- **TypeScript 5.9** — strict mode.
- **RxJS 7.8** — async streams.
- **Karma + Jasmine** — unit tests.
- **ESLint** — lint con `@angular-eslint` + `@typescript-eslint`.

---

## Modulos actuales

```
src/app/web/
├── login/        # autenticacion gestor/admin
├── dashboard/    # bandeja de entrada, metricas
└── tramite/      # detalle y tramitar PQRS
```

Cada modulo: `*.module.ts`, `*-routing.module.ts`, `*.page.ts/html/scss`, `*.page.spec.ts`.

---

## Patrones

### Estructura por feature

Cada nueva pantalla = un modulo lazy-loaded:

```typescript
// app-routing.module.ts
{
  path: 'web/reportes',
  loadChildren: () => import('./web/reportes/reportes.module').then(m => m.ReportesPageModule),
  canActivate: [authGuard],
  data: { roles: ['gestor', 'admin'] }
}
```

### Inyeccion de servicios

Usa `inject()` de Angular 20 sobre constructor injection cuando sea posible:

```typescript
export class DashboardPage {
  private readonly pqrsService = inject(PqrsService);
  private readonly router = inject(Router);
  // ...
}
```

### Formularios

**Reactive Forms.** No template-driven.

```typescript
loginForm = this.fb.nonNullable.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
});
```

### Estado

Servicios singleton en `core/` con `BehaviorSubject` o `signal()`. NO duplicar estado en componentes.

### HTTP

Usar `HttpClient` con interceptor de auth (ya existe en `core/interceptors/auth.interceptor.ts`). NO llamar `fetch` directo.

```typescript
this.pqrsService.listar().pipe(
  takeUntilDestroyed(this.destroyRef),
).subscribe(...)
```

### Estilos

- Tailwind utility-first. Sin estilos en `.scss` salvo casos complejos.
- Tokens semanticos definidos en `theme/variables.scss` — usalos, no hardcodees colores.
- Responsive: pensado para >= 1024px (`lg:` y `xl:` breakpoints). Si tu pantalla se rompe en mobile, OK — esto es la app web.

---

## Reglas de codigo

| Elemento | Convencion |
|---|---|
| Componentes, clases | PascalCase (`DashboardPage`) |
| Selectors | kebab-case (`app-dashboard`) |
| Servicios | PascalCase con sufijo `Service` |
| Archivos | kebab-case (`dashboard.page.ts`) |
| Variables, metodos | camelCase |
| Constantes | UPPER_SNAKE_CASE |
| Indentacion | 2 espacios |
| Imports sin usar | eliminar (ESLint lo marca) |
| `any` | evitar — usa tipos especificos o `unknown` |
| `console.log` | eliminar antes del PR |

---

## Tests

- **Unit:** Karma + Jasmine. Spec por cada componente y servicio que tocas.
- **Coverage:** apuntar a >= 60% (sin gate por ahora, pero CI lo reporta).
- **Naming:** `describe('DashboardPage', () => { it('should filter pqrs by status', ...) })`.
- **Mocks:** usar `jasmine.createSpyObj` para servicios.
- **No** depender de DOM real — usar `ComponentFixture`.

```bash
pnpm test                                    # interactivo, todo
pnpm test -- --watch=false                   # single run, para CI
pnpm test -- --include=**/dashboard.spec.ts  # solo uno
```

---

## Archivos compartidos — coordinar con Juli Avila

Si tocas estos, avisa antes y asigna a Juli Avila como reviewer:

- `src/app/core/` — services, guards, interceptors, models.
- `src/app/shared/` — componentes/pipes reutilizables.
- `src/theme/` — variables Tailwind/Ionic.
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `angular.json`, `tsconfig*.json`.

---

## Reglas operativas

- **No** dupliques codigo que ya esta en `core/` o `shared/`. Si no existe, agregalo ahi (con review de Juli Avila).
- **No** crees rutas fuera de `/web/*`. La parte mobile vive en `/mobile/*` y la gestiona Juli Avila.
- **No** importes desde `../mobile/` ni viceversa. Si necesitas codigo cross, ponlo en `core/` o `shared/`.
- **No** llames APIs sin pasar por servicios. Los componentes consumen services, no `HttpClient` directo.
- **No** hardcodees URLs de API. Usa `environment.ts`.
- **Si** un endpoint no existe en backend, abre Issue. No invente el contrato.
- **Si** un componente queda > 200 lineas, divide en sub-componentes.

---

## Que hacer cuando

| Situacion | Accion |
|---|---|
| Endpoint backend pide payload distinto | Avisa a Juli Criollo, actualiza modelo en `core/models/` |
| CI me bota lint en archivo que no toque | Verifica si rebase de develop trajo cambios — `pnpm run lint --fix` |
| Necesito componente Ionic que no esta importado | Agregalo al `imports` del modulo correspondiente |
| Tailwind no aplica clases nuevas | Revisar `tailwind.config.js` content paths — usualmente cache |
| Karma falla con `Cannot find module` | `pnpm install` (lockfile fuera de sync) |
