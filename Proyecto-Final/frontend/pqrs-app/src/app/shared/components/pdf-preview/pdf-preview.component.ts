import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="safeUrl" class="mt-4 border rounded overflow-hidden shadow-sm relative">
      <div class="bg-gray-100 p-2 flex justify-between items-center border-b">
        <span class="text-sm font-bold text-gray-700">Vista Previa Anexo</span>
        <button (click)="cerrar.emit()" class="text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <iframe [src]="safeUrl" class="w-full h-96 border-none" title="PDF Preview"></iframe>
    </div>
  `
})
export class PdfPreviewComponent implements OnChanges {
  @Input() url: string = '';
  @Output() cerrar = new EventEmitter<void>();
  
  safeUrl: SafeResourceUrl | null = null;
  private sanitizer = inject(DomSanitizer);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url'] && this.url) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    } else if (changes['url']) {
      this.safeUrl = null;
    }
  }
}