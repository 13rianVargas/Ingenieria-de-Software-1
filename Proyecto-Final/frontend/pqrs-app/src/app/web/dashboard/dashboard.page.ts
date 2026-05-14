import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PQRSService } from '../../core/services/pqrs.service';
import { AuthService } from '../../core/services/auth.service';
import { PQRS, TipoPQRS, EstadoPQRS, PQRSFilter, User } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {

  EstadoPQRS = EstadoPQRS; // expuesto para el template

  pqrsList: PQRS[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  filtroTipo = '';
  filtroEstado = '';

  isLoading = false;
  errorMessage = '';
  isExporting = false;
  currentUser: User | null = null;

  tiposFiltro = [
    { value: '', label: 'Todos' },
    { value: TipoPQRS.PETICION, label: 'Petición' },
    { value: TipoPQRS.QUEJA, label: 'Queja' },
    { value: TipoPQRS.RECLAMO, label: 'Reclamo' },
    { value: TipoPQRS.SUGERENCIA, label: 'Sugerencia' }
  ];

  estadosFiltro = [
    { value: '', label: 'Todos' },
    { value: EstadoPQRS.NUEVO, label: 'Nuevo' },
    { value: EstadoPQRS.EN_PROCESO, label: 'En Proceso' },
    { value: EstadoPQRS.RESUELTO, label: 'Resuelto' },
    { value: EstadoPQRS.RECHAZADO, label: 'Rechazado' }
  ];

  private pqrsService = inject(PQRSService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.cargarBandeja();
  }

  cargarBandeja(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const filtros: PQRSFilter = {};
    if (this.filtroTipo) filtros.tipo = this.filtroTipo as TipoPQRS;
    if (this.filtroEstado) filtros.estado = this.filtroEstado as EstadoPQRS;

    this.pqrsService.obtenerBandeja(filtros, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success && response.data) {
            this.pqrsList = response.data.data;
            this.totalItems = response.data.total;
            this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al cargar la bandeja';
        }
      });
  }

  aplicarFiltros(): void {
    this.currentPage = 1;
    this.cargarBandeja();
  }

  limpiarFiltros(): void {
    this.filtroTipo = '';
    this.filtroEstado = '';
    this.currentPage = 1;
    this.cargarBandeja();
  }

  irAPagina(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.cargarBandeja();
  }

  getPaginas(): number[] {
    const paginas: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  tramitar(radicado: string): void {
    this.router.navigate(['/web/tramite', radicado]);
  }

  exportarPDF(): void {
    this.isExporting = true;

    const filtros: PQRSFilter = {};
    if (this.filtroTipo) filtros.tipo = this.filtroTipo as TipoPQRS;
    if (this.filtroEstado) filtros.estado = this.filtroEstado as EstadoPQRS;

    this.pqrsService.generarReporte(filtros)
      .subscribe({
        next: () => {
          this.isExporting = false;
        },
        error: () => {
          this.isExporting = false;
        }
      });
  }

  cerrarSesion(): void {
    this.authService.logout();
  }

  get rangoInicio(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangoFin(): number {
    const fin = this.currentPage * this.pageSize;
    return fin > this.totalItems ? this.totalItems : fin;
  }

  getInitials(): string {
    if (!this.currentUser?.nombre) return 'GP';
    const parts = this.currentUser.nombre.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  getNombreCliente(pqrs: PQRS): string {
    return `${pqrs.clienteNombre} (${pqrs.clienteIdentificacion})`;
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
      month: '2-digit',
      year: 'numeric'
    });
  }

}
