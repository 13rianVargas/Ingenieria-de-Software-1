import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PQRSService } from '../../core/services/pqrs.service';
import { PQRS, TipoPQRS, EstadoPQRS } from '../../core/models';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false,
})
export class DetallePage implements OnInit, OnDestroy {

  pqrs: PQRS | null = null;
  isLoading = false;
  errorMessage = '';
  isDownloading = false;

  private radicado = '';
  private destroy$ = new Subject<void>();

  private route = inject(ActivatedRoute);
  private pqrsService = inject(PQRSService);
  private router = inject(Router);

  ngOnInit() {
    this.radicado = this.route.snapshot.paramMap.get('radicado') || '';
    if (this.radicado) {
      this.cargarDetalle();
    } else {
      this.errorMessage = 'Radicado no especificado';
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDetalle(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.pqrsService.obtenerPorId(this.radicado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response) {
            // Map PqrsDetalle to legacy PQRS format for mobile view
            this.pqrs = {
              id: response.id,
              radicado: response.radicado,
              tipo: response.tipo,
              asunto: response.asunto,
              estado: response.estado,
              fechaRadicado: response.fechaRadicado,
              fechaCierre: response.fechaCierre,
              comentarios: response.descripcion,
              fechaCreacion: response.fechaRadicado,
              anexoPdf: response.adjuntos && response.adjuntos.length > 0 ? response.adjuntos[0].nombreArchivo : undefined,
              justificacion: response.tramites && response.tramites.length > 0 ? response.tramites[response.tramites.length - 1].justificacion : undefined
            } as PQRS;
          } else {
            this.errorMessage = 'No se encontró la PQRS';
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al cargar el detalle';
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

  volver(): void {
    this.router.navigate(['/mobile/historial']);
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

  formatearFecha(fecha: Date | string | undefined): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace('.', '');
  }

}
