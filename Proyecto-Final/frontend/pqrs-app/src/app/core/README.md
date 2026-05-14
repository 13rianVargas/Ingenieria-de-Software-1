# Core - Capa de Servicios Globales

## 📁 Estructura

```
core/
├── models/           # Interfaces y tipos del sistema
│   ├── user.model.ts
│   ├── pqrs.model.ts
│   ├── auth.model.ts
│   ├── api-response.model.ts
│   └── index.ts
├── services/         # Servicios de negocio
│   ├── auth.service.ts         # Autenticación y gestión de sesión
│   ├── pqrs.service.ts         # Operaciones CRUD de PQRS
│   └── index.ts
├── guards/           # Guards de rutas
│   ├── auth.guard.ts           # AuthGuard y RoleGuard
│   └── index.ts
├── interceptors/     # Interceptores HTTP
│   ├── auth.interceptor.ts     # Adjunta JWT, maneja errores
│   └── index.ts
└── index.ts          # Exporta todo
```

## 🔑 Servicios Principales

### AuthService

Gestiona autenticación, sesión y tokens JWT.

**Métodos principales:**

```typescript
// Autenticación
login(credentials: LoginCredentials): Observable<AuthResponse>
logout(): void
updatePassword(oldPassword: string, newPassword: string): Observable<any>

// Verificaciones
hasValidToken(): boolean
isCliente(): boolean
isGestor(): boolean
hasRole(role: UserRole): boolean

// Datos
getToken(): string | null
getCurrentUser(): User | null
getCurrentRole(): UserRole | null
```

**Uso:**

```typescript
// En un componente
import { AuthService } from '@app/core';

export class LoginComponent {
  constructor(private authService: AuthService) {}

  login(credentials: LoginCredentials) {
    this.authService.login(credentials).subscribe(
      (response) => {
        if (response.success) {
          // Redirigir automáticamente (AuthService lo hace)
        }
      },
      (error) => {
        console.error('Error de login:', error.message);
      }
    );
  }

  logout() {
    this.authService.logout();
  }

  checkRole() {
    if (this.authService.isGestor()) {
      // Mostrar opciones de Gestor
    }
  }
}
```

### PQRSService

Operaciones CRUD completas para PQRS.

**Métodos principales:**

```typescript
// Crear y actualizar
crearPQRS(pqrs: CrearPQRSRequest, archivo?: File): Observable<ApiResponse<PQRS>>
actualizarEstado(radicado: string, actualizar: ActualizarPQRSRequest): Observable<ApiResponse<PQRS>>

// Consultar
obtenerBandeja(filtros?: PQRSFilter, page?: number, pageSize?: number): Observable<ApiResponse<PQRSResponse>>
obtenerHistorial(clienteId: string, page?: number, pageSize?: number): Observable<ApiResponse<PQRSResponse>>
obtenerPorRadicado(radicado: string): Observable<ApiResponse<PQRS>>
filtrarPQRS(filtros: PQRSFilter, page?: number, pageSize?: number): Observable<ApiResponse<PQRSResponse>>

// Descargas y reportes
descargarAnexo(radicado: string): Observable<Blob>
generarReporte(filtros?: PQRSFilter): Observable<Blob>

// Validación
validarPDF(archivo: File): boolean
```

**Uso:**

```typescript
// Radicar PQRS
this.pqrsService.crearPQRS(pqrsData, pdfFile).subscribe(
  (response) => {
    if (response.success) {
      const radicado = response.data?.radicado;
      alert(`PQRS radicada: ${radicado}`);
    }
  },
  (error) => alert('Error: ' + error.message)
);

// Obtener historial del cliente
this.pqrsService.obtenerHistorial(clienteId).subscribe(
  (response) => {
    this.pqrsList = response.data?.data || [];
  }
);

// Filtrar con estado
const filtros: PQRSFilter = { estado: EstadoPQRS.NUEVO };
this.pqrsService.filtrarPQRS(filtros).subscribe(...);

// Descargar anexo
this.pqrsService.descargarAnexo(radicado).subscribe();

// Generar reporte
this.pqrsService.generarReporte(filtros).subscribe();
```

## 🛡️ Guards de Rutas

### AuthGuard

Verifica que el usuario esté autenticado. Si no, redirige al login.

```typescript
// En app-routing.module.ts
{
  path: 'mobile/radicar',
  canActivate: [AuthGuard],
  loadChildren: () => import('./mobile/radicar/radicar.module').then(m => m.RadicarPageModule)
}
```

### RoleGuard

Verifica que el usuario tenga el rol requerido.

```typescript
// En app-routing.module.ts
{
  path: 'web/dashboard',
  canActivate: [AuthGuard, RoleGuard],
  data: { role: UserRole.GESTOR },
  loadChildren: () => import('./web/dashboard/dashboard.module').then(m => m.DashboardPageModule)
}
```

## 🔌 Interceptores

### AuthInterceptor

- Adjunta el JWT a todas las requests (en header `Authorization: Bearer <token>`)
- Maneja errores 401 (sesión expirada) y redirige al login
- Evita adjuntar token a recursos estáticos

### HeadersInterceptor

- Agrega headers comunes a todas las requests
- `X-Requested-With: XMLHttpRequest`
- `Accept: application/json`

## 📦 Variables de Entorno

**environment.ts** (Desarrollo):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

**environment.prod.ts** (Producción):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.supermarket-pqrs.com/api'
};
```

## ✅ Checklist de Integración

Al crear un nuevo componente que use autenticación o PQRS:

- [ ] Importar servicios desde `@app/core`
- [ ] Inyectar en constructor: `constructor(private authService: AuthService, private pqrsService: PQRSService)`
- [ ] Suscribirse a observables en `ngOnInit` y desuscribirse en `ngOnDestroy`
- [ ] Manejar errores con `catchError` o `.subscribe(..., error => {})`
- [ ] Para guardianes, agregar `canActivate: [AuthGuard, RoleGuard]` en rutas sensibles
- [ ] Validar roles con `authService.isGestor()`, `authService.isCliente()` antes de mostrar UI

## 📚 Referencias

- Models: `src/app/core/models/`
- Servicios: `src/app/core/services/`
- Guards: `src/app/core/guards/`
- Interceptores: `src/app/core/interceptors/`
