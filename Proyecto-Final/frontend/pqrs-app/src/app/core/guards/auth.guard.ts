import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router,
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Guard que verifica si el usuario está autenticado
 * Previene acceso a rutas protegidas sin sesión válida
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const isAuthenticated = this.authService.hasValidToken();
    
    if (isAuthenticated) {
      return true;
    }

    // No autenticado - redirigir al login según el rol
    const role = this.authService.getCurrentRole();
    
    if (state.url.includes('/mobile')) {
      this.router.navigate(['/mobile/login']);
    } else if (state.url.includes('/web')) {
      this.router.navigate(['/web/login']);
    } else {
      this.router.navigate(['/mobile/login']);
    }

    return false;
  }
}

/**
 * Guard que verifica si el usuario tiene un rol específico
 * Usado para restringir acceso a rutas según rol (CLIENTE o GESTOR)
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Obtener el rol requerido desde los datos de la ruta
    const requiredRole = route.data['role'];
    
    if (!requiredRole) {
      return true; // Sin restricción de rol
    }

    // Verificar autenticación
    if (!this.authService.hasValidToken()) {
      this.router.navigate(['/mobile/login']);
      return false;
    }

    // Verificar rol
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser && currentUser.rol === requiredRole) {
      return true;
    }

    // Rol insuficiente - redirigir
    if (currentUser) {
      console.warn(`Acceso denegado: Usuario con rol ${currentUser.rol} intentó acceder a recurso de ${requiredRole}`);
    }

    // Redirigir según el rol actual
    if (state.url.includes('/web')) {
      this.router.navigate(['/mobile/login']);
    } else {
      this.router.navigate(['/web/login']);
    }

    return false;
  }
}

/**
 * Guard para prevenir salir de la aplicación si hay cambios sin guardar
 */
@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanActivate {
  
  canActivate(): boolean {
    // Placeholder para futura implementación
    return true;
  }
}
