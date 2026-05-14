import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

/**
 * Interceptor HTTP que:
 * - Adjunta token JWT a cada request
 * - Maneja errores de autenticación (401)
 * - Redirige a login si la sesión expira
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    
    // Obtener el token
    const token = this.authService.getToken();
    
    // Si existe token, clonar la request y agregar header Authorization
    if (token && this.shouldAttachToken(request.url)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } else if (this.shouldAttachToken(request.url)) {
      // Agregar Content-Type aunque no haya token
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      })
    );
  }

  /**
   * Maneja errores HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    
    if (error.status === 401) {
      // Sesión expirada o no autenticado
      console.warn('Sesión expirada o credenciales inválidas');
      
      // Limpiar sesión
      this.authService.logout();
      
      // Redirigir al login
      const redirectUrl = this.router.url.includes('/web') ? '/web/login' : '/mobile/login';
      this.router.navigate([redirectUrl]);
    } else if (error.status === 403) {
      console.warn('Acceso denegado - Permisos insuficientes');
    } else if (error.status === 500) {
      console.error('Error del servidor:', error.message);
    } else if (error.status === 0) {
      console.error('Error de conectividad - Verifica tu conexión a internet');
    }

    return throwError(() => error);
  }

  /**
   * Determina si se debe adjuntar el token a la solicitud
   * Evita adjuntar token a recursos estáticos
   */
  private shouldAttachToken(url: string): boolean {
    // No adjuntar token a recursos estáticos
    const staticResources = ['.png', '.jpg', '.gif', '.css', '.js'];
    return !staticResources.some(resource => url.includes(resource));
  }
}

/**
 * Interceptor para agregar headers comunes a todas las requests
 */
@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    
    // Agregar headers comunes
    const modifiedRequest = request.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
      }
    });

    return next.handle(modifiedRequest);
  }
}
