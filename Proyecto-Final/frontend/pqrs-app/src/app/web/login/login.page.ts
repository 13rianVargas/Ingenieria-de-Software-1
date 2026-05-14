import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { LoginCredentials } from '../../core/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    // Verificar si ya está autenticado
    if (this.authService.hasValidToken()) {
      this.redirectBasedOnRole();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa el formulario reactivo con validaciones
   */
  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      identificacion: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{8,12}$/), // Solo números, 8-12 dígitos
        Validators.minLength(8),
        Validators.maxLength(12)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)
      ]]
    });
  }

  /**
   * Maneja el envío del formulario de login
   */
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: LoginCredentials = {
      identificacion: this.loginForm.value.identificacion.trim(),
      password: this.loginForm.value.password
    };

    this.authService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            console.log('Login exitoso:', response.data?.user?.nombre);
            this.redirectBasedOnRole();
          } else {
            this.errorMessage = response.message || 'Error desconocido';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error de conexión. Intente nuevamente.';
          console.error('Error de login:', error);
        }
      });
  }

  /**
   * Redirige según el rol del usuario autenticado
   */
  private redirectBasedOnRole(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      if (user.rol === 'CLIENTE') {
        this.router.navigate(['/mobile/historial']);
      } else if (user.rol === 'GESTOR') {
        this.router.navigate(['/web/dashboard']);
      }
    }
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Getters para facilitar el acceso a los controles del formulario
   */
  get identificacion() { return this.loginForm.get('identificacion'); }
  get password() { return this.loginForm.get('password'); }

  /**
   * Verifica si un campo tiene errores y ha sido tocado
   */
  hasError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    if (field.errors['pattern']) {
      return 'Solo se permiten números';
    }
    if (field.errors['minlength']) {
      return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    if (field.errors['maxlength']) {
      return `${this.getFieldLabel(fieldName)} no puede exceder ${field.errors['maxlength'].requiredLength} caracteres`;
    }

    return 'Campo inválido';
  }

  /**
   * Obtiene la etiqueta legible para un campo
   */
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      identificacion: 'Número de identificación',
      password: 'Contraseña'
    };
    return labels[fieldName] || fieldName;
  }
}


