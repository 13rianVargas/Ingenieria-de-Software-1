import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full border" [ngClass]="badgeClass">
      {{ label }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() estado: string = '';

  get badgeClass(): string {
    const classes: Record<string, string> = {
      'NUEVO': 'bg-blue-100 text-blue-800 border-blue-200',
      'EN_PROCESO': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'RESUELTO': 'bg-green-100 text-green-800 border-green-200',
      'RECHAZADO': 'bg-red-100 text-red-800 border-red-200'
    };
    return classes[this.estado?.toUpperCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  get label(): string {
    const labels: Record<string, string> = {
      'NUEVO': 'Nuevo',
      'EN_PROCESO': 'En Proceso',
      'RESUELTO': 'Resuelto',
      'RECHAZADO': 'Rechazado'
    };
    return labels[this.estado?.toUpperCase()] || this.estado || 'Desconocido';
  }
}