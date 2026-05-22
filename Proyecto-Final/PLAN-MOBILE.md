# PLAN-MOBILE — Frontend Mobile Cliente (Fase 2)

## 0. Contexto rápido

- **Owner**: Juli Avila (`@JulianAvila259`).
- **Branch**: `feature/frontend-mobile-core` (crear desde `develop`).
- **Path**: `Proyecto-Final/frontend/pqrs-app/src/app/mobile/`.
- **Estado actual** (~60 %):
  - `login/` 100 % funcional.
  - `radicar/` 100 % funcional (formulario + adjuntar PDF + validaciones).
  - `historial/` 20 % — routing + skeleton, sin UI.
  - `detalle/` 0 % — routing solo.
  - **Capacitor NO instalado**. Sin `android/` ni `ios/` folders. Sin `capacitor.config.ts`. Sin paquetes en `package.json`.
- **Definición Done**: APK Android sideload-able instalado en 2-3 celulares del equipo, login → radicar PQRS (con PDF en R2) → historial → detalle funciona end-to-end contra backend Render.
- **Bloqueado por**: PLAN-BACK.md T-2.4 (radicar) y T-2.5 (mis PQRS) para validar integración.

---

## 1. Pre-requisitos

| Herramienta | Versión | Verificar |
|---|---|---|
| Node.js | ≥ 20 LTS | `node -v` |
| pnpm | ≥ 9 | `pnpm -v` |
| **Android Studio** | Hedgehog (2023.1.1) o superior | https://developer.android.com/studio |
| Android SDK Platform 33+ (API 33) | bundled con AS | desde AS → SDK Manager |
| JDK | 17 (mismo que backend) | `java -version` (AS embebe 17) |
| Cel Android con USB debugging | API 28+ | Settings → About Phone → tap 7x "Build number" → habilitar Dev Options + USB Debugging |
| URL backend Render | (de Juli C) | `curl https://pqrs-backend-xxx.onrender.com/actuator/health` |

**Setup inicial**:

```bash
cd Proyecto-Final/frontend/pqrs-app
pnpm install
```

---

## 2. Tareas en orden estricto

### T-4.1 Instalar Capacitor (~1 hr)

**Objetivo**: agregar Capacitor + plataforma Android al proyecto monorepo.

**Pasos**:

1. Instalar paquetes Capacitor:

```bash
cd Proyecto-Final/frontend/pqrs-app
pnpm add @capacitor/core @capacitor/android
pnpm add -D @capacitor/cli
```

2. Inicializar Capacitor:

```bash
pnpm exec cap init "PQRS SuperMarket" "co.edu.konrad.pqrs" --web-dir=dist/pqrs-app/browser
```

Esto crea `capacitor.config.ts`:

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.edu.konrad.pqrs',
  appName: 'PQRS SuperMarket',
  webDir: 'dist/pqrs-app/browser',
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
};

export default config;
```

3. Sumar plataforma Android:

```bash
pnpm exec cap add android
```

Esto crea `Proyecto-Final/frontend/pqrs-app/android/` (Gradle project).

4. Instalar plugins necesarios:

```bash
pnpm add @capacitor/filesystem @capacitor/preferences @capacitor/status-bar @capacitor/app
pnpm add @capawesome/capacitor-file-picker
```

5. Sync:

```bash
pnpm exec cap sync android
```

**Verificación**:

```bash
ls android/app/build.gradle android/gradle.properties
```

Esperado: ambos archivos existen.

**Commits**:
1. `feat(mobile): add capacitor core and android platform`
2. `feat(mobile): add capacitor plugins filesystem preferences status-bar file-picker`

---

### T-4.2 Configurar Android Studio (~1 hr)

**Objetivo**: poder abrir el proyecto Android desde AS y ver el build OK.

**Pasos**:

1. Instalar Android Studio (si no está). Plataforma Hedgehog mínimo.
2. Primer arranque: AS pide instalar SDK Platform 33 + SDK Build-Tools 33 + Android Emulator (opcional).
3. Configurar `local.properties` (auto-generado al abrir proyecto):

```
sdk.dir=/Users/<usuario>/Library/Android/sdk
```

4. Abrir proyecto Android desde Capacitor:

```bash
pnpm exec cap open android
```

Esto lanza AS con el proyecto en `android/`.

5. Esperar a que Gradle sync termine (puede tomar 5-10 min primera vez).

6. Verificar:
   - Sin errores rojos en panel "Problems".
   - Build > Make Project → BUILD SUCCESSFUL.

**Sin commit** (es setup local).

---

### T-4.3 Environment + base URL (~30 min)

**Objetivo**: mobile apunta a backend Render. Aplicar mismo refactor que web.

**Pasos**:

1. Asegurar que `src/environments/environment.ts` y `environment.prod.ts` tienen `apiBaseUrl` (ya hecho en PLAN-WEB.md T-3.2 si Santi llegó primero).

2. Verificar mobile services usan `environment.apiBaseUrl`:

```bash
grep -n "localhost" src/app/mobile/**/*.ts
```

3. CORS: coordinar con Juli C — backend `SecurityConfig` debe incluir `capacitor://localhost` y `https://localhost` en `setAllowedOrigins()` (PLAN-BACK.md T-2.1 paso 2.1.5 ya lo tiene).

4. En `capacitor.config.ts`, sumar `server.allowNavigation`:

```ts
server: {
  androidScheme: 'https',
  cleartext: false,
  allowNavigation: ['pqrs-backend-<HASH>.onrender.com'],
},
```

**Commit**: `chore(mobile): configure capacitor server allowed navigation for render backend`

---

### T-4.4 Validar login mobile contra backend real (~1 hr)

**Objetivo**: usuario `cliente@demo.com` / `Demo2026!` puede entrar desde APK.

**Pasos**:

1. Build web bundle:
   ```bash
   pnpm ng build --configuration=production
   ```
2. Sync:
   ```bash
   pnpm exec cap sync android
   ```
3. Run en emulador o cel real:
   ```bash
   pnpm exec cap run android
   ```
   (Requiere cel conectado USB con debug habilitado, o emulator running).

4. App abre → login → ingresar credenciales → debe pedir POST `/api/auth/login` al Render URL.

**Logs**:
- Chrome DevTools remoto: en navegador desktop, ir a `chrome://inspect`. Seleccionar el dispositivo.
- Logcat AS: filtrar por tag `Capacitor`.

**Si falla**:
- Network error → backend caído o URL mal. Verificar `environment.prod.ts`.
- CORS → backend no permite `capacitor://localhost`.
- SSL handshake → `cleartext: false` correcto, pero URL debe ser HTTPS.

**Commit**: `fix(mobile): polish login error handling for capacitor backend integration`

---

### T-4.5 Validar Radicar PQRS con PDF (~2 hrs)

**Objetivo**: Cliente en APK radica PQRS con anexo PDF que sube a R2 vía backend.

**Pasos**:

1. Verificar `src/app/mobile/radicar/radicar.page.ts` usa `@capawesome/capacitor-file-picker` para abrir selector PDF:

```ts
import { FilePicker } from '@capawesome/capacitor-file-picker';

async seleccionarPdf() {
  const result = await FilePicker.pickFiles({ types: ['application/pdf'], multiple: false });
  if (result.files.length > 0) {
    this.archivoSeleccionado = result.files[0];
  }
}
```

2. Enviar al backend con FormData:

```ts
const fd = new FormData();
fd.append('pqrs', new Blob([JSON.stringify(pqrsData)], { type: 'application/json' }));
if (this.archivoSeleccionado) {
  const blob = await fetch(`data:${this.archivoSeleccionado.mimeType};base64,${this.archivoSeleccionado.data}`).then(r => r.blob());
  fd.append('anexo', blob, this.archivoSeleccionado.name);
}
this.http.post(`${environment.apiBaseUrl}/pqrs`, fd).subscribe(...);
```

3. Validaciones cliente:
   - Tipo MIME `application/pdf`.
   - Tamaño ≤ 5 MB.
   - Asunto 5-200 chars.
   - Descripción ≥ 20 chars.

4. Tras éxito (HTTP 201): mostrar toast "PQRS radicada: <radicado>" + navegar a `/mobile/historial`.

**Tests manuales** (corresponden a TCs PF-native issues #37-#46):
- TC-001 Radicar autenticado happy path.
- TC-005 Adjuntar JPG → error.
- TC-006 Adjuntar PDF 6 MB → error.
- TC-007 Radicar sin adjunto → OK.

**Commit**: `feat(mobile): integrate file picker pdf for radicar pqrs flow`

---

### T-4.6 Historial CU-04 (~5 hrs)

**Objetivo**: `/mobile/historial` lista PQRS del Cliente.

**Archivos**:
- `src/app/mobile/historial/historial.page.ts`
- `src/app/mobile/historial/historial.page.html`
- `src/app/mobile/historial/historial.page.scss`

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
    <ion-item *ngFor="let p of radicados" [routerLink]="['/mobile/detalle', p.radicado]" detail>
      <ion-label>
        <h2>{{ p.radicado }}</h2>
        <p>{{ p.tipo | titlecase }} · {{ p.fechaRadicado | date:'short' }}</p>
        <app-status-badge [estado]="p.estado" />
      </ion-label>
    </ion-item>
  </ion-list>

  <ion-infinite-scroll (ionInfinite)="cargarMas($event)">
    <ion-infinite-scroll-content />
  </ion-infinite-scroll>
</ion-content>
```

**TS**:

```ts
ngOnInit() {
  this.cargar();
}

cargar() {
  this.loading = true;
  this.pqrsService.misRadicados({ radicado: this.filtroRadicado, page: 0, size: 20 }).subscribe({
    next: (data) => { this.radicados = data.items; this.loading = false; },
    error: () => { this.loading = false; this.toast('Error cargando radicados'); }
  });
}

recargar(ev: any) { this.cargar(); ev.target.complete(); }
buscar() { /* debounce 300ms */ }
cargarMas(ev: any) { /* paginate */ }
```

**Servicio** (`pqrs.service.ts`):

```ts
misRadicados(filtros: { radicado?: string; page: number; size: number }): Observable<PagedResponse<PqrsResumen>> {
  const params = new HttpParams({ fromObject: filtros as any });
  return this.http.get<PagedResponse<PqrsResumen>>(`${environment.apiBaseUrl}/pqrs/mis`, { params });
}
```

**Tests manuales**:
- Cliente con 0 PQRS → empty state.
- Cliente con 1 PQRS → muestra.
- Pull-to-refresh actualiza.
- Buscar por radicado filtra.

**Commit**: `feat(mobile): add historial page with list filter refresh and infinite scroll`

---

### T-4.7 Detalle PQRS (~4 hrs)

**Objetivo**: `/mobile/detalle/:radicado` muestra detalle + timeline + botón descargar anexo.

**Similar al T-3.5 del PLAN-WEB.md** pero **solo lectura para Cliente** (no permite cambiar estado).

**HTML**:

```html
<ion-content>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ pqrs?.radicado }}</ion-card-title>
      <ion-card-subtitle>
        <app-status-badge [estado]="pqrs?.estado" />
      </ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <p><strong>Tipo:</strong> {{ pqrs?.tipo }}</p>
      <p><strong>Fecha:</strong> {{ pqrs?.fechaRadicado | date:'medium' }}</p>
      <p><strong>Asunto:</strong> {{ pqrs?.asunto }}</p>
      <p>{{ pqrs?.descripcion }}</p>
      <ion-button *ngIf="pqrs?.adjunto" (click)="descargarAnexo()" expand="block">
        <ion-icon name="download" slot="start" /> Descargar Anexo
      </ion-button>
    </ion-card-content>
  </ion-card>

  <ion-card>
    <ion-card-header><ion-card-title>Historial de Estados</ion-card-title></ion-card-header>
    <ion-card-content>
      <ion-list *ngIf="tramites.length > 0">
        <ion-item *ngFor="let t of tramites">
          <ion-label>
            <h3>{{ t.estadoAnterior }} → {{ t.estadoNuevo }}</h3>
            <p>{{ t.timestamp | date:'short' }}</p>
            <p>{{ t.justificacion }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <p *ngIf="tramites.length === 0" class="text-gray-500">Sin movimientos aún.</p>
    </ion-card-content>
  </ion-card>
</ion-content>
```

**Descargar anexo en mobile** (Capacitor Filesystem):

```ts
import { Filesystem, Directory } from '@capacitor/filesystem';

async descargarAnexo() {
  const blob = await firstValueFrom(this.pqrsService.descargarAnexo(this.pqrs.id));
  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = (reader.result as string).split(',')[1];
    await Filesystem.writeFile({
      path: `${this.pqrs.radicado}-anexo.pdf`,
      data: base64,
      directory: Directory.Documents,
    });
    this.toast('Anexo descargado en Documents');
  };
  reader.readAsDataURL(blob);
}
```

**Commit**: `feat(mobile): add detalle pqrs page with status timeline and pdf download`

---

### T-4.8 Build APK release (~2 hrs)

**Objetivo**: generar `app-debug.apk` o `app-release.apk` instalable.

**Pasos** (APK debug, suficiente para sideload demo):

1. Build web prod:

```bash
pnpm ng build --configuration=production
```

2. Sync:

```bash
pnpm exec cap sync android
```

3. Build APK desde Android Studio:
   - Open `android/` en AS.
   - Menu Build → Build Bundle(s) / APK(s) → **Build APK(s)**.
   - Esperar BUILD SUCCESSFUL.
   - APK queda en `android/app/build/outputs/apk/debug/app-debug.apk` (~ 15-25 MB).

4. Alternativa CLI:

```bash
cd android && ./gradlew assembleDebug
```

5. Verificar firma debug:

```bash
keytool -printcert -jarfile app/build/outputs/apk/debug/app-debug.apk
```

**Para APK release firmada** (opcional, no requerida demo):

1. Generar keystore:
```bash
keytool -genkey -v -keystore release.keystore -alias pqrs -keyalg RSA -keysize 2048 -validity 10000
```
2. Configurar `signingConfig` en `android/app/build.gradle`.
3. `./gradlew assembleRelease`.

**Sin commit del APK** (gitignored). Sí commitear cambios de Gradle/Capacitor config si los hubo.

---

### T-4.9 Publicar APK en GitHub Release (~30 min)

**Objetivo**: APK distribuible vía URL pública.

**Pasos**:

1. Crear tag:
```bash
git tag v0.1.0-mvp
git push origin v0.1.0-mvp
```

2. Crear Release con APK:

```bash
gh release create v0.1.0-mvp \
  --title "PQRS Mobile MVP v0.1.0" \
  --notes "Versión MVP para feria académica. APK debug sideload. Requiere Android 9+ (API 28)." \
  Proyecto-Final/frontend/pqrs-app/android/app/build/outputs/apk/debug/app-debug.apk
```

3. URL queda como `https://github.com/13rianVargas/Ingenieria-de-Software-1/releases/download/v0.1.0-mvp/app-debug.apk`.

4. Instalar en cels demo:
   - Abrir URL en Chrome móvil → descargar.
   - Settings → Security → "Instalar apps desconocidas" → habilitar para Chrome.
   - Tap APK descargada → Instalar.

**Sin commit** (operación GitHub).

---

## 3. Coordinación

- **Bloqueado por**:
  - PLAN-BACK.md T-2.2 (login) → T-4.4.
  - PLAN-BACK.md T-2.4 (radicar + R2) → T-4.5.
  - PLAN-BACK.md T-2.5 (mis PQRS) → T-4.6.
  - PLAN-BACK.md T-2.6 + T-2.7 (detalle + tramites) → T-4.7.
  - PLAN-BACK.md T-2.10 (deploy Render) → T-4.3 environment prod.
- **Bloquea a**: nadie (mobile es hoja del grafo).

**Estrategia mientras backend no está**: usar JSON Server o mock service para desbloquear UI dev.

---

## 4. Troubleshooting

| Error | Fix |
|---|---|
| `cap sync` falla con "Could not find @capacitor/android" | Asegurar `pnpm add @capacitor/android` (no devDep). |
| `gradle sync failed` | Java version mismatch. AS usa embedded JDK 17. Revisar Settings → Build > Gradle > Gradle JDK = embedded. |
| `cap run android` no detecta cel | USB debug habilitado. `adb devices` debe listar el cel. Cambiar cable USB (algunos son solo carga). |
| APK no instala "App not installed" | Versión Android < API 28. O ya hay APK firmada con otra key. Desinstalar versión previa. |
| Backend CORS bloquea desde APK | `setAllowedOrigins(["capacitor://localhost", "https://localhost", ...])` en SecurityConfig. |
| File picker no retorna data en Android | Permitir permission `READ_EXTERNAL_STORAGE` en `AndroidManifest.xml`. |
| Filesystem.writeFile error "permission denied" | Sumar `<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />` (solo si API < 29). |

---

## 5. Definition of Done

- [ ] T-4.1 Capacitor + Android platform instalados.
- [ ] T-4.2 Android Studio configurado, Gradle sync OK.
- [ ] T-4.3 environment + allowNavigation configurado.
- [ ] T-4.4 login funciona contra backend Render.
- [ ] T-4.5 radicar PQRS con PDF funciona (sube a R2 via backend).
- [ ] T-4.6 historial muestra PQRS del Cliente con filtro + pull-to-refresh.
- [ ] T-4.7 detalle muestra PQRS + timeline + descargar anexo.
- [ ] T-4.8 APK debug compilado sin errores.
- [ ] T-4.9 APK publicado en GitHub Release v0.1.0-mvp.
- [ ] APK instalado en 2-3 cels del equipo.
- [ ] TCs PF-native (issues #37-#46) ejecutados sobre APK.
- [ ] PR `feature/frontend-mobile-core` mergeado a `develop`.

---

**Cronograma ajustado** (ver `PLAN-MAESTRO.md` §2): T-4.1 + T-4.2 + T-4.3 en D1-D2 (22-23 may); T-4.4 + T-4.5 en D3-D5 (24-26 may); T-4.6 + T-4.7 en D6-D8 (27-29 may); T-4.8 build APK en D9-D10 (30-31 may); **T-4.9 GH Release APK + instalar en cels es D11 obligatorio (1-jun)**; demo D12 (2-jun). Total ~17 hrs en 10 días.
