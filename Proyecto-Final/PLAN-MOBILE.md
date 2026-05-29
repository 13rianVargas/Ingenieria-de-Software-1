# PLAN-MOBILE — Frontend Mobile Cliente (Fase 2)

> **CAMBIO DE ALCANCE (28-may)**: NO se genera APK. El frontend "mobile" se entrega
> como **web servida en localhost** (`ionic serve` / `ng serve`) consumiendo el backend
> en Render. Se elimina Capacitor, Android Studio y GitHub Release del alcance. La demo
> del rol Cliente se hace en el navegador (puede ser un navegador móvil apuntando al
> localhost del laptop en la misma red, o el navegador del laptop en modo responsive).

## 0. Contexto rápido

- **Owner**: Juli Avila (`@JulianAvila259`).
- **Branch**: `feature/frontend-mobile-core` (crear desde `develop`).
- **Path**: `Proyecto-Final/frontend/pqrs-app/src/app/mobile/`.
- **Backend**: `https://ingenieria-de-software-1-uxxj.onrender.com` (LIVE, verificado).
- **Estado actual** (~60 %):
  - `login/` 100 % funcional.
  - `radicar/` 100 % funcional (formulario + adjuntar PDF + validaciones).
  - `historial/` 20 % — routing + skeleton, sin UI.
  - `detalle/` 0 % — routing solo.
  - **NO se usa Capacitor**. Es una app Ionic/Angular que corre como web.
- **Definición Done**: login → radicar PQRS (con PDF a R2 vía backend) → historial → detalle
  funciona end-to-end **en el navegador contra Render**.
- **Bloqueado por**: nada. Backend ya expone todos los endpoints (ver §1.1).

---

## 1. Pre-requisitos

| Herramienta | Versión | Verificar |
|---|---|---|
| Node.js | ≥ 20 LTS | `node -v` |
| pnpm | ≥ 9 | `pnpm -v` |
| Navegador moderno | Chrome/Edge/Firefox | — |
| URL backend Render | (fija) | `curl https://ingenieria-de-software-1-uxxj.onrender.com/actuator/health` → `{"status":"UP"}` |

**Setup inicial**:

```bash
cd Proyecto-Final/frontend/pqrs-app
pnpm install
```

> **Nota cold start**: el backend free en Render hiberna tras 15 min sin tráfico. El primer
> request puede tardar ~50 s. Pre-warma con el `curl` de health antes de probar.

### 1.1 Contrato de endpoints backend (YA disponibles)

Base: `https://ingenieria-de-software-1-uxxj.onrender.com`. Todos menos login requieren
header `Authorization: Bearer <token>`.

| Método | Ruta | Uso | Respuesta |
|---|---|---|---|
| POST | `/api/auth/login` | login | `{ token, rol, expiraEn }` |
| POST | `/api/pqrs` | radicar (multipart) | `201 { radicado, fechaRadicado, estado }` |
| GET | `/api/pqrs/mis?radicado=<opt>` | mis PQRS (Cliente) | **array** de `{ id, radicado, tipo, asunto, estado, fechaRadicado, fechaCierre }` |
| GET | `/api/pqrs/{id}` | detalle + timeline | `{ id, radicado, tipo, asunto, descripcion, estado, clienteId, gestorId, fechaRadicado, fechaCierre, tramites:[{estadoAnterior, estadoNuevo, justificacion, gestorId, timestamp}], adjuntos:[{id, nombreArchivo, tipoMime, tamanoBytes, fechaSubida}] }` |
| GET | `/api/pqrs/{id}/anexo` | descargar PDF | `application/pdf` (bytes) |

> **OJO**: `/api/pqrs/mis` devuelve un **array plano, sin paginación**. No esperar
> `{items, page, size}`. Filtrar por `radicado` se hace con el query param o en cliente.

Usuario demo Cliente: `cliente@demo.com` / `Demo2026!`.

---

## 2. Tareas en orden estricto

### T-4.1 Environment + base URL (~30 min)

**Objetivo**: la app apunta al backend Render. Mismo `apiBaseUrl` que usa web.

**Pasos**:

1. Confirmar `src/environments/environment.ts` y `environment.prod.ts`:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://ingenieria-de-software-1-uxxj.onrender.com/api',
};
```

2. Verificar que NINGÚN service mobile hardcodea localhost:

```bash
grep -rn "localhost" src/app/mobile/
```

3. CORS: el backend ya permite `http://localhost:4200`, `http://localhost:8100`. Si sirves
   en otro puerto, avisar a Brian para sumarlo a `SecurityConfig`.

**Commit**: `chore(mobile): point environment to render backend base url`

---

### T-4.2 Servir la app como web (~15 min)

**Objetivo**: levantar la app en el navegador.

**Pasos**:

```bash
cd Proyecto-Final/frontend/pqrs-app
pnpm ng serve            # http://localhost:4200
# o, si usas Ionic CLI:
# pnpm ionic serve       # http://localhost:8100
```

Abrir el navegador en la URL. Para vista "móvil": DevTools → toggle device toolbar
(responsive) → elegir un teléfono.

**Sin commit** (operación local).

---

### T-4.3 Validar login contra backend real (~1 hr)

**Objetivo**: `cliente@demo.com` / `Demo2026!` entra desde el navegador.

**Pasos**:

1. En la pantalla login, enviar `POST {apiBaseUrl}/auth/login` con `{ email, clave }`.
2. Guardar el `token` (ej. `localStorage`) y agregarlo como header
   `Authorization: Bearer <token>` en un HTTP interceptor para el resto de requests.
3. Tras éxito, navegar a `/mobile/historial`.

**Si falla**:
- Network error → backend hibernando (espera ~50 s) o URL mal.
- CORS → puerto no permitido; avisar a Brian.
- 401 → credenciales incorrectas (verificar email/clave).

**Logs**: DevTools → Network / Console del navegador.

**Commit**: `fix(mobile): wire login to backend and store jwt for interceptor`

---

### T-4.4 Radicar PQRS con PDF (~2 hrs)

**Objetivo**: Cliente radica PQRS con anexo PDF que sube a R2 vía backend.

**Pasos**:

1. Selector de archivo nativo del navegador (NO Capacitor):

```html
<input type="file" accept="application/pdf" (change)="onArchivo($event)" />
```

```ts
onArchivo(ev: Event) {
  const input = ev.target as HTMLInputElement;
  this.archivo = input.files?.[0] ?? null;
}
```

2. Enviar como `multipart/form-data`:

```ts
const fd = new FormData();
fd.append('pqrs', new Blob([JSON.stringify(pqrsData)], { type: 'application/json' }));
if (this.archivo) {
  fd.append('anexo', this.archivo, this.archivo.name);
}
this.http.post(`${environment.apiBaseUrl}/pqrs`, fd).subscribe(...);
```

> No setear `Content-Type` manualmente; el navegador agrega el boundary del multipart.

3. Validaciones cliente:
   - Tipo MIME `application/pdf`.
   - Tamaño ≤ 5 MB.
   - Asunto 5-200 chars.
   - Descripción ≥ 20 chars.
   - Tipo ∈ `peticion | queja | reclamo | sugerencia`.

4. Tras éxito (HTTP 201): toast "PQRS radicada: <radicado>" + navegar a `/mobile/historial`.

**Tests manuales** (TCs PF-native issues #37-#46):
- TC-001 Radicar autenticado happy path.
- TC-005 Adjuntar JPG → error (cliente o backend 422).
- TC-006 Adjuntar PDF 6 MB → error.
- TC-007 Radicar sin adjunto → OK.

**Commit**: `feat(mobile): radicar pqrs with html file input and multipart upload`

---

### T-4.5 Historial CU-04 (~5 hrs)

**Objetivo**: `/mobile/historial` lista las PQRS del Cliente.

**Archivos**:
- `src/app/mobile/historial/historial.page.{ts,html,scss}`

**HTML** (Ionic):

```html
<ion-header>
  <ion-toolbar>
    <ion-title>Mis Radicados</ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="cerrarSesion()"><ion-icon name="log-out" /></ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-refresher slot="fixed" (ionRefresh)="recargar($event)">
    <ion-refresher-content />
  </ion-refresher>

  <ion-searchbar placeholder="Buscar por radicado" [(ngModel)]="filtroRadicado" (ionInput)="buscar()" />

  <div *ngIf="loading" class="text-center p-4"><ion-spinner /></div>

  <div *ngIf="!loading && radicados.length === 0" class="text-center p-8 text-gray-500">
    Aún no has radicado PQRS.
    <ion-button routerLink="/mobile/radicar" class="mt-4">Radicar Nueva PQRS</ion-button>
  </div>

  <ion-list>
    <ion-item *ngFor="let p of radicados" [routerLink]="['/mobile/detalle', p.id]" detail>
      <ion-label>
        <h2>{{ p.radicado }}</h2>
        <p>{{ p.tipo | titlecase }} · {{ p.fechaRadicado | date:'short' }}</p>
        <app-status-badge [estado]="p.estado" />
      </ion-label>
    </ion-item>
  </ion-list>
</ion-content>
```

> **Navegar al detalle por `id`** (no por radicado): el endpoint de detalle es `/api/pqrs/{id}`.

**Servicio** (`pqrs.service.ts`):

```ts
// /mis devuelve un ARRAY plano (sin paginación)
misRadicados(radicado?: string): Observable<PqrsResumen[]> {
  let params = new HttpParams();
  if (radicado) params = params.set('radicado', radicado);
  return this.http.get<PqrsResumen[]>(`${environment.apiBaseUrl}/pqrs/mis`, { params });
}
```

**TS**:

```ts
ngOnInit() { this.cargar(); }

cargar() {
  this.loading = true;
  this.pqrsService.misRadicados(this.filtroRadicado).subscribe({
    next: (data) => { this.radicados = data; this.loading = false; },
    error: () => { this.loading = false; this.toast('Error cargando radicados'); }
  });
}

recargar(ev: any) { this.cargar(); ev.target.complete(); }
buscar() { /* debounce 300ms y volver a llamar cargar() */ }
```

**Tests manuales**:
- Cliente con 0 PQRS → empty state.
- Cliente con ≥ 1 PQRS → muestra lista.
- Pull-to-refresh actualiza.
- Buscar por radicado filtra.

**Commit**: `feat(mobile): add historial page with list filter and refresh`

---

### T-4.6 Detalle PQRS + timeline (~4 hrs)

**Objetivo**: `/mobile/detalle/:id` muestra detalle + timeline de tramites + botón descargar anexo.
**Solo lectura** para el Cliente (no cambia estado).

**Servicio**:

```ts
detalle(id: number): Observable<PqrsDetalle> {
  return this.http.get<PqrsDetalle>(`${environment.apiBaseUrl}/pqrs/${id}`);
}

descargarAnexo(id: number): Observable<Blob> {
  return this.http.get(`${environment.apiBaseUrl}/pqrs/${id}/anexo`, { responseType: 'blob' });
}
```

**HTML**:

```html
<ion-content>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ pqrs?.radicado }}</ion-card-title>
      <ion-card-subtitle><app-status-badge [estado]="pqrs?.estado" /></ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <p><strong>Tipo:</strong> {{ pqrs?.tipo }}</p>
      <p><strong>Fecha:</strong> {{ pqrs?.fechaRadicado | date:'medium' }}</p>
      <p><strong>Asunto:</strong> {{ pqrs?.asunto }}</p>
      <p>{{ pqrs?.descripcion }}</p>
      <ion-button *ngIf="pqrs?.adjuntos?.length" (click)="descargar()" expand="block">
        <ion-icon name="download" slot="start" /> Descargar Anexo
      </ion-button>
    </ion-card-content>
  </ion-card>

  <ion-card>
    <ion-card-header><ion-card-title>Historial de Estados</ion-card-title></ion-card-header>
    <ion-card-content>
      <ion-list *ngIf="pqrs?.tramites?.length">
        <ion-item *ngFor="let t of pqrs.tramites">
          <ion-label>
            <h3>{{ t.estadoAnterior }} → {{ t.estadoNuevo }}</h3>
            <p>{{ t.timestamp | date:'short' }}</p>
            <p>{{ t.justificacion }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <p *ngIf="!pqrs?.tramites?.length" class="text-gray-500">Sin movimientos aún.</p>
    </ion-card-content>
  </ion-card>
</ion-content>
```

**Descargar anexo en el navegador** (sin Capacitor — anchor + object URL):

```ts
descargar() {
  this.pqrsService.descargarAnexo(this.pqrs.id).subscribe((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.pqrs.radicado}-anexo.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
```

**Tests manuales**:
- PQRS sin tramites → "Sin movimientos aún".
- PQRS tramitada por gestor → muestra timeline ordenado.
- PQRS con adjunto → botón descarga el PDF y se abre/guarda correctamente.

**Commit**: `feat(mobile): add detalle page with timeline and pdf download`

---

## 3. Coordinación

- **Bloqueado por**: nada. Backend LIVE con todos los endpoints (§1.1).
- **Bloquea a**: nadie (mobile es hoja del grafo).
- **CORS**: si sirves en un puerto distinto a 4200/8100, pedir a Brian sumarlo a
  `SecurityConfig.corsConfigurationSource()`.

---

## 4. Troubleshooting

| Error | Fix |
|---|---|
| Primer request tarda ~50 s o falla | Backend Render hibernado. Pre-warm con `curl .../actuator/health` y reintentar. |
| CORS bloquea desde el navegador | Puerto no permitido. Avisar a Brian para sumarlo a `setAllowedOrigins()`. |
| 401 en todas las llamadas | Falta el header `Authorization: Bearer <token>` (revisar interceptor) o token expirado (re-login). |
| Multipart no sube el PDF | No setear `Content-Type` a mano; dejar que el navegador ponga el boundary. |
| 422 al adjuntar | El archivo no es `application/pdf` o supera 5 MB (validación backend). |
| Descarga abre PDF en blanco | Usar `responseType: 'blob'` en el GET del anexo. |
| `/mis` no pagina | Correcto: devuelve array plano. No esperar `items/page/size`. |

---

## 5. Definition of Done

- [ ] T-4.1 environment apunta a Render.
- [ ] T-4.2 app levanta en el navegador (`ng serve` / `ionic serve`).
- [ ] T-4.3 login funciona contra backend Render + token persistido.
- [ ] T-4.4 radicar PQRS con PDF funciona (sube a R2 vía backend).
- [ ] T-4.5 historial muestra PQRS del Cliente con filtro + pull-to-refresh.
- [ ] T-4.6 detalle muestra PQRS + timeline + descarga de anexo.
- [ ] TCs PF-native (issues #37-#46) ejecutados en el navegador.
- [ ] PR `feature/frontend-mobile-core` mergeado a `develop`.

> **Fuera de alcance** (eliminado 28-may): Capacitor, Android Studio, build APK,
> GitHub Release, instalación en celulares. Si en el futuro se retoma el APK, basta con
> `pnpm add @capacitor/core @capacitor/android` + `cap init/add/sync` sobre esta misma base.

---

**Cronograma**: sin dependencia de backend (ya está LIVE). T-4.1 + T-4.2 + T-4.3 en un bloque;
T-4.4 + T-4.5 + T-4.6 en el siguiente. Demo del rol Cliente en navegador. Total estimado ~12 hrs.
