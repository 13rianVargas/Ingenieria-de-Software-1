import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PQRSService } from '../../core/services/pqrs.service';
import { PQRS, TipoPQRS, EstadoPQRS, ActualizarPQRSRequest } from '../../core/models';

@Component({
  selector: 'app-tramite',
  templateUrl: './tramite.page.html',
  styleUrls: ['./tramite.page.scss'],
  standalone: false,
})
export class TramitePage implements OnInit, OnDestroy {

  pqrs: PQRS | null = null;
  gestionForm!: FormGroup;

  isLoading = false;
  isSaving = false;
  isDownloading = false;
  errorMessage = '';
  successMessage = '';

  radicado = '';
  private destroy$ = new Subject<void>();

  estadosDisponibles = [
    { value: EstadoPQRS.EN_PROCESO, label: 'En Proceso' },
    { value: EstadoPQRS.RESUELTO, label: 'Resuelto' },
    { value: EstadoPQRS.RECHAZADO, label: 'Rechazado' }
  ];

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private pqrsService = inject(PQRSService);
  private router = inject(Router);

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.radicado = this.route.snapshot.paramMap.get('radicado') || '';
    if (this.radicado) {
      this.cargarPQRS();
    } else {
      this.errorMessage = 'Radicado no especificado';
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.gestionForm = this.formBuilder.group({
      nuevoEstado: ['', [Validators.required]],
      justificacion: ['', [Validators.required, Validators.pattern(/\S/)]]
    });
  }

  cargarPQRS(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.pqrsService.obtenerPorRadicado(this.radicado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success && response.data) {
            this.pqrs = response.data;
          } else {
            this.errorMessage = response.message || 'No se encontró la PQRS';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al cargar la PQRS';
        }
      });
  }

  descargarAnexo(): void {
    if (!this.pqrs?.anexoPdf) return;

    this.isDownloading = true;
    this.pqrsService.descargarAnexo(this.radicado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isDownloading = false;
        },
        error: () => {
          this.isDownloading = false;
        }
      });
  }

  guardarCambios(): void {
    if (this.gestionForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.gestionForm.value;
    const actualizar: ActualizarPQRSRequest = {
      estado: formValue.nuevoEstado,
      justificacion: formValue.justificacion.trim()
    };

    this.pqrsService.actualizarEstado(this.radicado, actualizar)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSaving = false;
          if (response.success) {
            this.successMessage = 'Estado actualizado exitosamente. Se notificará al cliente por correo.';
            this.gestionForm.reset();
            this.cargarPQRS();
          } else {
            this.errorMessage = response.message || 'Error al actualizar el estado';
          }
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Error al guardar los cambios';
        }
      });
  }

  volver(): void {
    this.router.navigate(['/web/dashboard']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.gestionForm.controls).forEach(key => {
      const control = this.gestionForm.get(key);
      control?.markAsTouched();
    });
  }

  hasError(fieldName: string): boolean {
    const field = this.gestionForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.gestionForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (fieldName === 'nuevoEstado' && field.errors['required']) {
      return 'Debe seleccionar un estado';
    }
    if (fieldName === 'justificacion') {
      if (field.errors['required'] || field.errors['pattern']) {
        return 'Para cambiar el estado, la justificación es obligatoria';
      }
    }
    return 'Campo inválido';
  }

  getEstadoLabel(estado: EstadoPQRS): string {
    const labels: Record<string, string> = {
      [EstadoPQRS.NUEVO]: 'Nuevo',
      [EstadoPQRS.EN_PROCESO]: 'En Proceso',
      [EstadoPQRS.RESUELTO]: 'Resuelto',
      [EstadoPQRS.RECHAZADO]: 'Rechazado'
    };
    return labels[estado] || estado;
  }

  getEstadoClass(estado: EstadoPQRS): string {
    const classes: Record<string, string> = {
      [EstadoPQRS.NUEVO]: 'bg-blue-100 text-blue-800 border-blue-200',
      [EstadoPQRS.EN_PROCESO]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [EstadoPQRS.RESUELTO]: 'bg-green-100 text-green-800 border-green-200',
      [EstadoPQRS.RECHAZADO]: 'bg-red-100 text-red-800 border-red-200'
    };
    return classes[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  getTipoLabel(tipo: TipoPQRS): string {
    const labels: Record<string, string> = {
      [TipoPQRS.PETICION]: 'Petición',
      [TipoPQRS.QUEJA]: 'Queja',
      [TipoPQRS.RECLAMO]: 'Reclamo',
      [TipoPQRS.SUGERENCIA]: 'Sugerencia'
    };
    return labels[tipo] || tipo;
  }

  formatearFecha(fecha: Date | string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).replace('.', '');
  }

}
