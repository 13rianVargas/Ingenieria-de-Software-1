import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="mb-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
        <svg class="w-5 h-5 text-red-400 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <div class="flex-1">
          <p class="text-red-700 text-sm font-medium">{{ message }}</p>
          <button *ngIf="retry.observed" (click)="retry.emit()" class="mt-2 text-red-600 text-sm underline hover:no-underline">
            Intentar de nuevo
          </button>
        </div>
        <button *ngIf="dismissible" (click)="dismiss.emit()" class="text-red-400 hover:text-red-500 ml-4">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ErrorAlertComponent {
  @Input() message: string = '';
  @Input() dismissible: boolean = false;
  @Output() retry = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();
}