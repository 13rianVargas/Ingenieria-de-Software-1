import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { PQRSService } from '../../core/services/pqrs.service';
import { CrearPQRSRequest, TipoPQRS, User } from '../../core/models';

@Component({
  selector: 'app-radicar',
  templateUrl: './radicar.page.html',
  styleUrls: ['./radicar.page.scss'],
  standalone: false,
})
export class RadicarPage implements OnInit, OnDestroy {

  radicacionForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  selectedFile: File | undefined = undefined;
  fileName = '';
  currentUser: User | null = null;
  private destroy$ = new Subject<void>();

  // Opciones para los selects
  tiposDocumento = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'NIT', label: 'NIT' }
  ];

  tiposPQRS = [
    { value: TipoPQRS.PETICION, label: 'Petición' },
    { value: TipoPQRS.QUEJA, label: 'Queja' },
    { value: TipoPQRS.RECLAMO, label: 'Reclamo' },
    { value: TipoPQRS.SUGERENCIA, label: 'Sugerencia' }
  ];

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private pqrsService = inject(PQRSService);
  private router = inject(Router);

  constructor() {
    this.initializeForm();
  }

  ngOnInit() {
    // Verificar si el usuario está autenticado
    this.currentUser = this.authService.getCurrentUser();

    // Si está autenticado, precargar datos personales
    if (this.currentUser) {
      this.preloadUserData();
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
    this.radicacionForm = this.formBuilder.group({
      // Datos personales
      tipoDocumento: ['CC', [Validators.required]],
      numeroIdentificacion: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{8,12}$/),
        Validators.minLength(8),
        Validators.maxLength(12)
      ]],
      nombreCompleto: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      telefono: ['', [
        Validators.pattern(/^[0-9]{7,10}$/),
        Validators.minLength(7),
        Validators.maxLength(10)
      ]],

      // Datos de la PQRS
      tipoPQRS: ['', [Validators.required]],
      comentarios: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]]
    });
  }

  /**
   * Precarga los datos del usuario autenticado
   */
  private preloadUserData(): void {
    if (this.currentUser) {
      // Nota: En una implementación real, estos datos vendrían del perfil del usuario
      // Por ahora, dejamos los campos vacíos para que el usuario los complete
      this.radicacionForm.patchValue({
        numeroIdentificacion: this.currentUser.identificacion,
        email: this.currentUser.email || '',
        nombreCompleto: this.currentUser.nombre || ''
      });
    }
  }

  /**
   * Maneja la selección de archivo PDF
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (!file) {
      this.clearFile();
      return;
    }

    // Validar que sea PDF
    if (!this.pqrsService.validarPDF(file)) {
      this.errorMessage = 'Solo se permiten archivos PDF';
      this.clearFile();
      return;
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      this.errorMessage = 'El archivo no puede superar los 5MB';
      this.clearFile();
      return;
    }

    this.selectedFile = file;
    this.fileName = file.name;
    this.errorMessage = ''; // Limpiar errores previos
  }

  /**
   * Limpia la selección de archivo
   */
  private clearFile(): void {
    this.selectedFile = undefined;
    this.fileName = '';
    // Resetear el input file
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /**
   * Remueve el archivo seleccionado
   */
  removeFile(): void {
    this.clearFile();
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.radicacionForm.invalid) {
      this.markFormGroupTouched();
      this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.radicacionForm.value;

    const pqrsData: CrearPQRSRequest = {
      tipo: formData.tipoPQRS,
      comentarios: formData.comentarios.trim(),
      clienteIdentificacion: formData.numeroIdentificacion.trim(),
      clienteNombre: formData.nombreCompleto.trim(),
      clienteEmail: formData.email.trim().toLowerCase(),
      clienteTelefono: formData.telefono ? formData.telefono.trim() : undefined
    };

    this.pqrsService.crearPQRS(pqrsData, this.selectedFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success && response.data) {
            this.successMessage = `PQRS radicada exitosamente. Número de radicado: ${response.data.radicado}`;
            this.radicacionForm.reset();
            this.clearFile();

            // Redirigir al historial después de 3 segundos
            setTimeout(() => {
              this.router.navigate(['/mobile/historial']);
            }, 3000);
          } else {
            this.errorMessage = response.message || 'Error al radicar la PQRS';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error de conexión. Intente nuevamente.';
          console.error('Error al radicar PQRS:', error);
        }
      });
  }

  /**
   * Navega hacia atrás
   */
  goBack(): void {
    this.router.navigate(['/mobile/historial']);
  }

  /**
   * Marca todos los campos del formulario como tocados
   */
  private markFormGroupTouched(): void {
    Object.keys(this.radicacionForm.controls).forEach(key => {
      const control = this.radicacionForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verifica si un campo tiene errores y ha sido tocado
   */
  hasError(fieldName: string): boolean {
    const field = this.radicacionForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getErrorMessage(fieldName: string): string {
    const field = this.radicacionForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    if (field.errors['email']) {
      return 'Ingrese un correo electrónico válido';
    }
    if (field.errors['pattern']) {
      if (fieldName === 'numeroIdentificacion') {
        return 'Solo se permiten números';
      }
      if (fieldName === 'telefono') {
        return 'Solo se permiten números';
      }
      if (fieldName === 'nombreCompleto') {
        return 'Solo se permiten letras y espacios';
      }
    }
    if (field.errors['minlength']) {
      return `Debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    if (field.errors['maxlength']) {
      return `No puede exceder ${field.errors['maxlength'].requiredLength} caracteres`;
    }

    return 'Campo inválido';
  }

  /**
   * Obtiene la etiqueta legible para un campo
   */
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      tipoDocumento: 'Tipo de documento',
      numeroIdentificacion: 'Número de identificación',
      nombreCompleto: 'Nombre completo',
      email: 'Correo electrónico',
      telefono: 'Teléfono',
      tipoPQRS: 'Tipo de radicado',
      comentarios: 'Comentarios'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Getters para facilitar el acceso a los controles del formulario
   */
  get tipoDocumento() { return this.radicacionForm.get('tipoDocumento'); }
  get numeroIdentificacion() { return this.radicacionForm.get('numeroIdentificacion'); }
  get nombreCompleto() { return this.radicacionForm.get('nombreCompleto'); }
  get email() { return this.radicacionForm.get('email'); }
  get telefono() { return this.radicacionForm.get('telefono'); }
  get tipoPQRS() { return this.radicacionForm.get('tipoPQRS'); }
  get comentarios() { return this.radicacionForm.get('comentarios'); }
}


