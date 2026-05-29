import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PQRSService } from '../../core/services/pqrs.service';
import { AuthService } from '../../core/services/auth.service';
import { CrearPQRSRequest, CrearPQRSAnonimoRequest } from '../../core/models';

@Component({
  selector: 'app-radicar',
  templateUrl: './radicar.page.html',
  styleUrls: ['./radicar.page.scss'],
  standalone: false,
})
export class RadicarPage {
  radicacionForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  archivo: File | null = null;
  esAnonimo = false;

  private formBuilder = inject(FormBuilder);
  private pqrsService = inject(PQRSService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  constructor() {
    // Sin sesion -> radicacion anonima: pedimos tambien los datos del cliente.
    this.esAnonimo = !this.authService.hasValidToken();

    const grupo: Record<string, unknown> = {
      tipo: ['', [Validators.required]],
      asunto: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]]
    };

    if (this.esAnonimo) {
      grupo['tipoDoc'] = ['CC', [Validators.required]];
      grupo['numDoc'] = ['', [Validators.required, Validators.maxLength(20)]];
      grupo['nombres'] = ['', [Validators.required, Validators.maxLength(100)]];
      grupo['apellidos'] = ['', [Validators.required, Validators.maxLength(100)]];
      grupo['email'] = ['', [Validators.required, Validators.email]];
      grupo['telefono'] = ['', [Validators.maxLength(20)]];
    }

    this.radicacionForm = this.formBuilder.group(grupo);
  }

  onArchivo(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    this.errorMessage = '';

    if (file) {
      if (file.type !== 'application/pdf') {
        this.errorMessage = 'Solo se permiten archivos PDF.';
        input.value = '';
        this.archivo = null;
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'El archivo no debe superar los 5 MB.';
        input.value = '';
        this.archivo = null;
        return;
      }
      this.archivo = file;
    } else {
      this.archivo = null;
    }
  }

  onSubmit() {
    if (this.radicacionForm.invalid) {
      this.radicacionForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const peticion$ = this.esAnonimo
      ? this.pqrsService.crearPQRSAnonimo(this.construirPayloadAnonimo(), this.archivo || undefined)
      : this.pqrsService.crearPQRS(this.construirPayload(), this.archivo || undefined);

    peticion$.subscribe({
      next: async (response) => {
        this.isLoading = false;
        const mensaje = this.esAnonimo
          ? 'PQRS radicada: ' + response.radicado + '. Te enviamos las credenciales al correo.'
          : 'PQRS radicada exitosamente: ' + response.radicado;
        const toast = await this.toastController.create({
          message: mensaje,
          duration: 4000,
          color: 'success',
          position: 'top'
        });
        await toast.present();

        this.radicacionForm.reset();
        this.archivo = null;
        // Anonimo va a login (a usar sus nuevas credenciales); con sesion al historial.
        this.router.navigate([this.esAnonimo ? '/mobile/login' : '/mobile/historial'],
          this.esAnonimo ? { queryParams: { radicado: response.radicado } } : {});
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.detalle || err.error?.message || 'Error al radicar la PQRS.';
        console.error('Error radicando PQRS:', err);
      }
    });
  }

  private construirPayload(): CrearPQRSRequest {
    const v = this.radicacionForm.value;
    return {
      tipo: v.tipo,
      asunto: v.asunto.trim(),
      descripcion: v.descripcion.trim()
    };
  }

  private construirPayloadAnonimo(): CrearPQRSAnonimoRequest {
    const v = this.radicacionForm.value;
    return {
      tipoDoc: v.tipoDoc,
      numDoc: v.numDoc.trim(),
      nombres: v.nombres.trim(),
      apellidos: v.apellidos.trim(),
      email: v.email.trim(),
      telefono: v.telefono?.trim() || undefined,
      tipo: v.tipo,
      asunto: v.asunto.trim(),
      descripcion: v.descripcion.trim()
    };
  }
}
