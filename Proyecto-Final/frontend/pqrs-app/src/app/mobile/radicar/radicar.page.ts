import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PQRSService } from '../../core/services/pqrs.service';
import { CrearPQRSRequest } from '../../core/models';

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

  private formBuilder = inject(FormBuilder);
  private pqrsService = inject(PQRSService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  constructor() {
    this.radicacionForm = this.formBuilder.group({
      tipo: ['', [Validators.required]],
      asunto: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]]
    });
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

    const pqrsData: CrearPQRSRequest = {
      tipo: this.radicacionForm.value.tipo,
      asunto: this.radicacionForm.value.asunto.trim(),
      descripcion: this.radicacionForm.value.descripcion.trim()
    };

    this.pqrsService.crearPQRS(pqrsData, this.archivo || undefined).subscribe({
      next: async (response) => {
        this.isLoading = false;
        
        const toast = await this.toastController.create({
          message: 'PQRS radicada exitosamente: ' + response.radicado,
          duration: 3000,
          color: 'success',
          position: 'top'
        });
        await toast.present();
        
        this.radicacionForm.reset();
        this.archivo = null;
        this.router.navigate(['/mobile/historial']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al radicar la PQRS.';
        console.error('Error radicando PQRS:', err);
      }
    });
  }
}
