import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PQRSService } from '../../core/services/pqrs.service';
import { PqrsDetalle } from '../../core/models';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false,
})
export class DetallePage implements OnInit {
  pqrs: PqrsDetalle | null = null;
  loading = false;
  error = false;
  isDownloading = false;
  
  private route = inject(ActivatedRoute);
  private pqrsService = inject(PQRSService);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cargarDetalle(parseInt(idParam, 10));
    } else {
      this.error = true;
    }
  }

  cargarDetalle(id: number) {
    this.loading = true;
    this.pqrsService.detalle(id).subscribe({
      next: (data) => {
        this.pqrs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando detalle:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  descargar() {
    if (!this.pqrs || this.isDownloading) return;
    
    this.isDownloading = true;
    this.pqrsService.descargarAnexo(this.pqrs.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.pqrs!.radicado + '-anexo.pdf';
        a.click();
        URL.revokeObjectURL(url);
        this.isDownloading = false;
      },
      error: (err) => {
        console.error('Error descargando anexo:', err);
        this.isDownloading = false;
      }
    });
  }
}
