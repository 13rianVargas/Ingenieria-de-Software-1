# PLAN-WEB — Frontend Web Gestor (Fase 2)

## 0. Contexto rápido

- **Owner**: Santi Rocha (`@SantiagoRR17`).
- **Branch**: `feature/frontend-web-core` (crear desde `develop`).
- **Path**: `Proyecto-Final/frontend/pqrs-app/src/app/web/`.
- **Estado actual** (avanzado):
  - `login/` 100 % funcional.
  - `dashboard/` 95 % (paginación + filtros conectados; falta apuntar a backend real).
  - `tramite/` 0 % — stub routing solo.
  - `core/` (auth, pqrs, guards, interceptors, models): completo.
  - `shared/`: vacío, debe crear LoadingSpinner, ErrorAlert, StatusBadge, PdfPreview.
- **Definición Done**: web Gestor conecta a backend Render, login → bandeja → tramitar → reporte PDF funciona end-to-end. TC manual ejecutado por Brian.
- **Bloqueado por**: PLAN-BACK.md (necesita URL backend Render + endpoints listos).

---

## 1. Pre-requisitos

| Herramienta | Versión | Verificar |
|---|---|---|
| Node.js | ≥ 20 LTS | `node -v` |
| pnpm | ≥ 9 | `pnpm -v` |
| Angular CLI | bundled vía pnpm | `pnpm ng version` |
| URL backend Render | (de Juli C) | `curl https://pqrs-backend-xxx.onrender.com/actuator/health` → `{"status":"UP"}` |

**Setup inicial**:

```bash
cd Proyecto-Final/frontend/pqrs-app
pnpm install
```

> Si `npm install` o `yarn install` se ejecutó por error, ver troubleshooting §4.

---

## 2. Tareas en orden estricto

### T-3.1 (skip — Capacitor no aplica para web)

Sin acción.

---

### T-3.2 Environment config (~30 min)

**Objetivo**: variables `apiBaseUrl` apuntan a backend según entorno.

**Archivos**:

- `src/environments/environment.ts` (dev):

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
  appName: 'PQRS SuperMarket — Gestor',
};
```

- `src/environments/environment.prod.ts`:

```ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://pqrs-backend-<HASH>.onrender.com/api',   // sustituir cuando T-2.10 entregue URL
  appName: 'PQRS SuperMarket — Gestor',
};
```

**Refactor**: en `src/app/core/services/auth.service.ts`, `pqrs.service.ts`, etc., reemplazar cualquier hardcode `http://localhost:3000` por `environment.apiBaseUrl`.

**Comando**:

```bash
grep -rn "localhost:3000\|http://localhost:" src/app/core/services/ src/app/web/ src/app/mobile/
```

Resultado esperado tras refactor: vacío.

**Commit**: `refactor(web): replace hardcoded backend url with environment apibase`

---

### T-3.3 Validar login con backend real (~1 hr)

**Objetivo**: probar login Gestor con `gestor@demo.com` / `Demo2026!` contra backend Render.

**Pasos**:

1. `pnpm start` (sirve en http://localhost:4200).
2. Navegador → `/web/login` → ingresar credenciales.
3. Verificar:
   - Petición `POST /api/auth/login` (DevTools Network).
   - Response con `{ token, rol: "gestor", expiraEn }`.
   - Token guardado en `localStorage` (clave `pqrs.token`).
   - Redirect a `/web/dashboard`.

**Si falla**:
- 401 → backend no encuentra usuario / hash incorrecto. Coordinar con Brian (seeds).
- CORS → backend no permite `http://localhost:4200`. Coordinar con Juli C (SecurityConfig).
- 500 → backend logs. Pedir a Juli C.

**Ajustes posibles**:

- `auth.service.ts` error handler: mostrar mensaje user-friendly según código HTTP.
- Mostrar loader durante request.

**Commit**: `fix(web): polish login error handling and loader for backend integration`

---

### T-3.4 Dashboard conectado a backend (~2 hrs)

**Objetivo**: `/web/dashboard` muestra PQRS reales desde `GET /api/pqrs`.

**Pasos**:

1. Verificar `pqrs.service.ts` método `obtenerBandeja(filtros)` apunta a `${environment.apiBaseUrl}/pqrs`.
2. Componentizar paginación con `page` y `size` query params.
3. Manejar 401 → interceptor redirige a `/web/login`.
4. Filtros `?estado` y `?tipo` envían query params al backend.
5. Loading state: skeleton rows mientras carga.
6. Empty state: mensaje "Sin PQRS coincidentes con los filtros" si array vacío.
7. Click en fila → navega a `/web/tramite/:id`.

**Tests manuales**:

- Login Gestor → bandeja muestra 3 PQRS demo.
- Filtro estado=nuevo → muestra 2.
- Filtro tipo=queja → muestra 1.
- Click fila → navega a tramite (página en T-3.5).

**Commit**: `feat(web): connect dashboard to real backend bandeja endpoint with filters`

---

### T-3.5 Tramite page CU-06 (~6 hrs) — CRÍTICO

**Objetivo**: `/web/tramite/:radicado` permite Gestor ver detalle + cambiar estado + descargar anexo.

**Archivos a crear/editar**:

- `src/app/web/tramite/tramite.page.ts`
- `src/app/web/tramite/tramite.page.html`
- `src/app/web/tramite/tramite.page.scss`
- `src/app/web/tramite/tramite-routing.module.ts` (si no existe)
- `src/app/web/tramite/tramite.module.ts`

**Estructura HTML** (Tailwind + Ionic):

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start"><ion-back-button defaultHref="/web/dashboard" /></ion-buttons>
    <ion-title>Tramitar PQRS</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="p-4">
  <!-- Info PQRS -->
  <section class="bg-white shadow rounded p-4 mb-4">
    <h2 class="text-xl font-bold">{{ pqrs?.radicado }}</h2>
    <dl class="grid grid-cols-2 gap-2 mt-2">
      <dt>Cliente:</dt><dd>{{ pqrs?.clienteNombre }}</dd>
      <dt>Tipo:</dt><dd>{{ pqrs?.tipo | titlecase }}</dd>
      <dt>Fecha:</dt><dd>{{ pqrs?.fechaRadicado | date:'medium' }}</dd>
      <dt>Estado actual:</dt><dd><app-status-badge [estado]="pqrs?.estado" /></dd>
    </dl>
    <p class="mt-4 text-gray-700">{{ pqrs?.descripcion }}</p>
    <button *ngIf="pqrs?.adjunto" (click)="descargarAnexo()" class="mt-4 btn-primary">
      📎 Descargar Anexo PDF
    </button>
  </section>

  <!-- Timeline tramites previos -->
  <section class="bg-white shadow rounded p-4 mb-4">
    <h3 class="font-semibold mb-2">Historial de Trámites</h3>
    <ol class="border-l pl-4">
      <li *ngFor="let t of tramites" class="mb-3">
        <span class="font-medium">{{ t.estadoAnterior }} → {{ t.estadoNuevo }}</span>
        <span class="text-sm text-gray-500"> ({{ t.timestamp | date:'short' }})</span>
        <p class="text-gray-700">{{ t.justificacion }}</p>
      </li>
    </ol>
  </section>

  <!-- Formulario cambio estado -->
  <form [formGroup]="form" (ngSubmit)="guardar()" class="bg-white shadow rounded p-4">
    <h3 class="font-semibold mb-2">Cambiar Estado</h3>
    <ion-item>
      <ion-label position="stacked">Nuevo Estado *</ion-label>
      <ion-select formControlName="estado">
        <ion-select-option value="en_proceso">En proceso</ion-select-option>
        <ion-select-option value="resuelto">Resuelto</ion-select-option>
        <ion-select-option value="rechazado">Rechazado</ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Justificación * (mínimo 10 caracteres)</ion-label>
      <ion-textarea formControlName="justificacion" rows="4" />
    </ion-item>
    <div *ngIf="form.controls.justificacion.errors?.['minlength']" class="text-red-600 text-sm mt-1">
      Justificación debe tener al menos 10 caracteres.
    </div>
    <button type="submit" [disabled]="form.invalid || loading" class="mt-4 btn-primary">
      {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
    </button>
  </form>
</ion-content>
```

**Lógica TS**:

```ts
ngOnInit() {
  const radicado = this.route.snapshot.paramMap.get('radicado')!;
  this.pqrsService.obtenerPorRadicado(radicado).subscribe(p => this.pqrs = p);
  this.pqrsService.obtenerTramites(radicado).subscribe(t => this.tramites = t);
}

descargarAnexo() {
  this.pqrsService.descargarAnexo(this.pqrs.id).subscribe(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${this.pqrs.radicado}-anexo.pdf`; a.click();
    URL.revokeObjectURL(url);
  });
}

guardar() {
  this.loading = true;
  this.pqrsService.tramitar(this.pqrs.id, this.form.value).subscribe({
    next: () => { this.toast('Estado actualizado'); this.router.navigate(['/web/dashboard']); },
    error: (e) => { this.toast(e.error?.message || 'Error al guardar'); this.loading = false; }
  });
}
```

**Sumar al `pqrs.service.ts`**:

```ts
obtenerTramites(radicado: string): Observable<Tramite[]> {
  return this.http.get<Tramite[]>(`${environment.apiBaseUrl}/pqrs/${radicado}/tramites`);
}

descargarAnexo(id: number): Observable<Blob> {
  return this.http.get(`${environment.apiBaseUrl}/pqrs/${id}/anexo`, { responseType: 'blob' });
}

tramitar(id: number, body: { estado: string; justificacion: string }): Observable<void> {
  return this.http.put<void>(`${environment.apiBaseUrl}/pqrs/${id}/estado`, body);
}
```

**Tests manuales**:
- Gestor abre PQRS estado "nuevo".
- Cambia a "en_proceso" con justificación 12 chars → guarda OK → toast → vuelve a dashboard.
- Intenta guardar con justificación 5 chars → botón deshabilitado.
- Intenta sin estado seleccionado → botón deshabilitado.
- Descarga anexo PDF → archivo se descarga al disco.

**Commit**: `feat(web): add tramite page with state change form and tramites timeline`

---

### T-3.6 Reporte PDF CU-07 (~1 hr)

**Objetivo**: botón "Exportar PDF" en dashboard descarga reporte.

**Pasos**:

1. Sumar botón `<button (click)="exportarPdf()">Exportar PDF</button>` en `dashboard.page.html` topbar.
2. Método en `dashboard.page.ts`:

```ts
exportarPdf() {
  const filtros = { estado: this.filtroEstado, tipo: this.filtroTipo };
  this.pqrsService.exportarReporte(filtros).subscribe(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Reporte_Bandeja_PQRS.pdf'; a.click();
    URL.revokeObjectURL(url);
  });
}
```

3. Sumar al `pqrs.service.ts`:

```ts
exportarReporte(filtros: PQRSFilter): Observable<Blob> {
  const params = new HttpParams({ fromObject: filtros as any });
  return this.http.get(`${environment.apiBaseUrl}/pqrs/reporte`, { responseType: 'blob', params });
}
```

**Tests manuales**:
- Dashboard sin filtros → exportar → PDF con 3 filas.
- Dashboard filtro estado=nuevo → exportar → PDF con 2 filas.

**Commit**: `feat(web): add export pdf button on dashboard with filters`

---

### T-3.7 Shared components (~3 hrs)

**Objetivo**: componentes reutilizables para evitar duplicación.

**Archivos a crear** en `src/app/shared/components/`:

- **LoadingSpinner**: `<app-loading-spinner [show]="loading" />` mostrar overlay con spinner Ionic.
- **ErrorAlert**: `<app-error-alert [message]="errorMsg" />` mostrar banner rojo dismissible.
- **StatusBadge**: `<app-status-badge [estado]="pqrs.estado" />` chip color según estado (nuevo=azul, en_proceso=amarillo, resuelto=verde, rechazado=rojo).
- **PdfPreview**: `<app-pdf-preview [url]="anexoUrl" />` visor PDF inline (opcional con `ngx-extended-pdf-viewer` o iframe).

**Cada componente**: standalone Angular 17+, template inline corto, scss con Tailwind apply.

**Commit**: `feat(web): add shared components loading errorelement statusbadge pdfpreview`

---

### T-3.8 Build prod + verify (~30 min)

**Objetivo**: bundle producción optimizado.

**Pasos**:

1. Build:
   ```bash
   pnpm ng build --configuration=production
   ```
2. Verificar:
   - `dist/pqrs-app/browser/` existe.
   - Tamaño `main-*.js` < 2 MB (gzip).
   - Sin warnings críticos.

3. (Opcional) Servir local prod build:
   ```bash
   pnpm dlx serve dist/pqrs-app/browser -p 4200
   ```

**Commit**: `chore(web): verify production build artifacts size and warnings`

---

## 3. Coordinación

- **Bloqueado por**:
  - PLAN-BACK.md T-2.2 (login JWT) para empezar T-3.3.
  - PLAN-BACK.md T-2.6 (bandeja) para T-3.4.
  - PLAN-BACK.md T-2.7 (tramitar) para T-3.5.
  - PLAN-BACK.md T-2.8 (reportes) para T-3.6.
  - PLAN-BACK.md T-2.10 (deploy Render) para `environment.prod.ts`.
- **Bloquea a**: PLAN-CICD.md T-5.2 (mobile-ci build verifica también web bundle).

**Estrategia mientras backend no está**: usar Postman mock o JSON Server local para desbloquear T-3.4 y T-3.5.

---

## 4. Troubleshooting

| Error | Fix |
|---|---|
| `pnpm install` falla con error de npm | Borrar `node_modules/` y reinstalar con pnpm. Verificar `package.json` no tiene `lockfileVersion` de npm. |
| CORS preflight 403 | Backend no permite origin. Pedir a Juli C sumar `http://localhost:4200` en `SecurityConfig`. |
| `EADDRINUSE :4200` | Otro `ng serve` corriendo. `lsof -i :4200` → `kill <PID>`. |
| Login retorna 200 pero no redirige | Interceptor de auth no guarda token. Revisar `auth.service.ts` método `login()` → debe llamar `setSession()`. |
| Build prod fails con `budget exceeded` | Bajar `assets` size o aumentar budgets en `angular.json` > architect > build > configurations > production > budgets. |
| Ionic warnings sobre experimentalDecorators | Verificar `tsconfig.json` tiene `"experimentalDecorators": true`. |

---

## 5. Definition of Done

- [ ] T-3.2 environment config sin hardcode localhost.
- [ ] T-3.3 login funciona contra backend Render.
- [ ] T-3.4 dashboard conecta + filtra + pagina.
- [ ] T-3.5 tramite page funciona end-to-end (descargar anexo + cambiar estado).
- [ ] T-3.6 exportar PDF funciona con filtros.
- [ ] T-3.7 4 shared components creados.
- [ ] T-3.8 build prod < 2 MB sin warnings críticos.
- [ ] TC manual ejecutado (login → bandeja → tramitar → reporte).
- [ ] PR `feature/frontend-web-core` mergeado a `develop`.

---

**Cronograma ajustado** (ver `PLAN-MAESTRO.md` §2): T-3.2 + prep T-3.3 en D1-D2 (22-23 may); T-3.3 validado + T-3.4 dashboard en D3-D5 (24-26 may); T-3.5 tramite + T-3.7 shared en D6-D8 (27-29 may); T-3.6 reporte + T-3.8 build prod en D9-D10 (30-31 may); smoke web D11 (1-jun); demo D12 (2-jun). Total ~13 hrs en 10 días.
