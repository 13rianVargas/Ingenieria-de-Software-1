import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PQRSService } from '../../core/services/pqrs.service';
import { AuthService } from '../../core/services/auth.service';
import { PQRS, TipoPQRS, EstadoPQRS, User } from '../../core/models';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: false,
})
export class HistorialPage implements OnInit, OnDestroy {

  pqrsList: PQRS[] = [];
  filteredList: PQRS[] = [];
  searchTerm = '';
  isLoading = false;
  errorMessage = '';
  currentUser: User | null = null;
  private destroy$ = new Subject<void>();

  private page = 1;
  private pageSize = 20;

  private pqrsService = inject(PQRSService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadHistorial();
    }
  }

  loadHistorial(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.pqrsService.obtenerHistorial(
      this.currentUser.id,
      this.page,
      this.pageSize
    ).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.pqrsList = response.data.data;
          this.filteredList = [...this.pqrsList];
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Error al cargar el historial';
      }
    });
  }

  filtrarRadicados(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredList = [...this.pqrsList];
      return;
    }
    this.filteredList = this.pqrsList.filter(p =>
      p.radicado.toLowerCase().includes(term)
    );
  }

  onSearch(event: any): void {
    this.searchTerm = event.detail?.value ?? event.target?.value ?? '';
    this.filtrarRadicados();
  }

  verDetalle(radicado: string): void {
    this.router.navigate(['/mobile/detalle', radicado]);
  }

  nuevaPQRS(): void {
    this.router.navigate(['/mobile/radicar']);
  }

  refresh(event: any): void {
    this.page = 1;
    this.loadHistorial();
    setTimeout(() => event.target.complete(), 500);
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
      [EstadoPQRS.NUEVO]: 'bg-blue-100 text-blue-800',
      [EstadoPQRS.EN_PROCESO]: 'bg-yellow-100 text-yellow-800',
      [EstadoPQRS.RESUELTO]: 'bg-green-100 text-green-800',
      [EstadoPQRS.RECHAZADO]: 'bg-red-100 text-red-800'
    };
    return classes[estado] || 'bg-gray-100 text-gray-800';
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
      month: 'short',
      year: 'numeric'
    }).replace('.', '');
  }

  tieneAnexo(pqrs: PQRS): boolean {
    return !!pqrs.anexoPdf;
  }

}
