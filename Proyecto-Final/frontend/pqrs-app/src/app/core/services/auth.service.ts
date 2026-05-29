import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  LoginCredentials, 
  AuthResponse, 
  SessionData, 
  User, 
  UserRole 
} from '../models';

/** Respuesta cruda del endpoint POST /api/auth/login del backend. */
interface BackendLoginResponse {
  token: string;
  rol: string;
  expiraEn: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl;
  private tokenKey = 'pqrs_token';
  private userKey = 'pqrs_user';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = new BehaviorSubject<boolean>(this.hasValidToken());

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.initializeSession();
  }

  /**
   * Autentica un usuario con credenciales
   * @param credentials - Identificación y contraseña
   * @returns Observable con respuesta de autenticación
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // El backend responde plano: { token, rol, expiraEn }. Lo mapeamos a la
    // estructura AuthResponse que el resto del front espera.
    return this.http.post<BackendLoginResponse>(
      `${this.apiUrl}/auth/login`,
      credentials,
      { headers }
    ).pipe(
      map(raw => this.mapLoginResponse(raw, credentials.email)),
      tap(response => {
        if (response && response.token) {
          // Synthetic user since backend only returns token and role
          const syntheticUser: User = {
            id: 'temp-id',
            identificacion: 'temp-id',
            nombre: credentials.email.split('@')[0], // derived from email
            apellido: '',
            email: credentials.email,
            // rol ya viene normalizado a UserRole por mapLoginResponse
            rol: (response.rol as UserRole) ?? UserRole.CLIENTE
          };
          
          this.storeSession({ token: response.token, user: syntheticUser });
          this.currentUserSubject.next(syntheticUser);
          this.isAuthenticated$.next(true);
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Adapta la respuesta plana del backend ({ token, rol, expiraEn }) a la
   * estructura AuthResponse interna. El backend NO envia nombre ni id; se
   * derivan del token/email. El rol se normaliza a UserRole (enum mayuscula).
   */
  private mapLoginResponse(raw: BackendLoginResponse, email: string): AuthResponse {
    const payload = this.parseToken(raw.token);
    const expiresIn = payload?.exp
      ? Math.max(0, payload.exp * 1000 - Date.now())
      : 0;
    return {
      // Forma plana (login web usa response.token / response.rol).
      token: raw.token,
      rol: this.normalizarRol(raw.rol),
      expiraEn: raw.expiraEn,
      // Forma envuelta (login mobile usa response.success / response.data).
      success: true,
      message: 'OK',
      data: {
        user: {
          id: payload?.sub ?? email,
          identificacion: payload?.sub ?? email,
          nombre: email.split('@')[0],
          rol: this.normalizarRol(raw.rol),
        },
        token: raw.token,
        expiresIn,
      },
    };
  }

  /** Normaliza el rol del backend (cliente/gestor/admin, minuscula) a UserRole. */
  private normalizarRol(rolBackend: string): UserRole {
    return (rolBackend || '').toLowerCase() === 'cliente'
      ? UserRole.CLIENTE
      : UserRole.GESTOR; // gestor y admin usan la vista web
  }

  /**
   * Cierra sesión del usuario actual
   */
  logout(): void {
    // Notificar al backend (opcional, asincrónico)
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe(
      () => console.log('Logout notificado al servidor'),
      (error) => console.warn('Error al notificar logout:', error)
    );

    // Limpiar datos locales
    this.clearSession();
    this.currentUserSubject.next(null);
    this.isAuthenticated$.next(false);
    
    // Redirigir según rol
    const role = this.getStoredUser()?.rol;
    if (role === UserRole.CLIENTE) {
      this.router.navigate(['/mobile/login']);
    } else {
      this.router.navigate(['/web/login']);
    }
  }

  /**
   * Obtiene el token JWT del almacenamiento
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Verifica si el usuario tiene un token válido
   */
  hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.parseToken(token);
      if (!payload) return false;

      // Verificar expiración (exp está en segundos)
      const expiresAt = payload.exp * 1000;
      return expiresAt > Date.now();
    } catch (error) {
      console.error('Error validando token:', error);
      return false;
    }
  }

  /**
   * Obtiene el usuario autenticado actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  /**
   * Verifica si el usuario actual tiene un rol específico
   */
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.rol === role;
  }

  /**
   * Verifica si el usuario es Cliente
   */
  isCliente(): boolean {
    return this.hasRole(UserRole.CLIENTE);
  }

  /**
   * Verifica si el usuario es Gestor
   */
  isGestor(): boolean {
    return this.hasRole(UserRole.GESTOR);
  }

  /**
   * Obtiene el rol del usuario actual
   */
  getCurrentRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user?.rol || null;
  }

  /**
   * Actualiza la contraseña del usuario
   */
  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/change-password`, {
      oldPassword,
      newPassword
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Solicita recuperación de contraseña
   */
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/request-reset`, { email }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Restablece la contraseña con token
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, {
      token,
      newPassword
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Almacena los datos de sesión en localStorage
   */
  private storeSession(data: any): void {
    try {
      localStorage.setItem(this.tokenKey, data.token);
      localStorage.setItem(this.userKey, JSON.stringify(data.user));
    } catch (error) {
      console.error('Error al almacenar sesión:', error);
    }
  }

  /**
   * Obtiene el usuario almacenado en localStorage
   */
  private getUserFromStorage(): User | null {
    try {
      const userJson = localStorage.getItem(this.userKey);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error al obtener usuario del almacenamiento:', error);
      return null;
    }
  }

  /**
   * Obtiene el usuario sin reactive subjects
   */
  private getStoredUser(): User | null {
    try {
      const userJson = localStorage.getItem(this.userKey);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Limpia los datos de sesión
   */
  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  /**
   * Decodifica manualmente un JWT (sin verificación de firma)
   * Nota: En producción, validar la firma en el backend
   */
  private parseToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const decoded = atob(parts[1]);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  /**
   * Inicializa la sesión si existe un token válido
   */
  private initializeSession(): void {
    if (this.hasValidToken()) {
      const user = this.getUserFromStorage();
      if (user) {
        this.currentUserSubject.next(user);
        this.isAuthenticated$.next(true);
      }
    }
  }

  /**
   * Manejo centralizado de errores HTTP
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = error.error.message;
    } else if (error.status) {
      const detalle = error.error?.detalle || error.error?.error;
      if (typeof detalle === 'string') {
        errorMessage = detalle;
      } else if (typeof detalle === 'object' && detalle !== null) {
        errorMessage = Object.values(detalle).join(', ');
      } else {
        // Fallback default messages
        switch (error.status) {
          case 401:
            errorMessage = 'Credenciales inválidas';
            this.clearSession();
            this.isAuthenticated$.next(false);
            break;
          case 403:
            errorMessage = 'Acceso denegado';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado';
            break;
          case 500:
            errorMessage = 'Error del servidor';
            break;
          default:
            errorMessage = `Error HTTP: ${error.status}`;
        }
      }
      
      // Specifically trigger clear session for 401 even if we got a detail message
      if (error.status === 401) {
        this.clearSession();
        this.isAuthenticated$.next(false);
      }
    }

    console.error('Error de autenticación:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
