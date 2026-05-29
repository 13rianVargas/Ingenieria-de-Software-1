import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <div *ngIf="show" class="flex items-center justify-center py-20">
      <div class="text-center">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <p class="text-gray-500 mt-3 text-sm">{{ message }}</p>
      </div>
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() show: boolean = false;
  @Input() message: string = 'Cargando...';
}