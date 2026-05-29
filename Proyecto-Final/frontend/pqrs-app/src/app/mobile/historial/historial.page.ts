import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PQRSService } from '../../core/services/pqrs.service';
import { AuthService } from '../../core/services/auth.service';
import { PqrsResumen } from '../../core/models';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: false,
})
export class HistorialPage implements OnInit {
  radicados: PqrsResumen[] = [];
  filtroRadicado: string = '';
  loading = false;
  private searchTimeout: any;

  private pqrsService = inject(PQRSService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading = true;
    this.pqrsService.misRadicados(this.filtroRadicado || undefined).subscribe({
      next: (data) => {
        this.radicados = data;
        this.loading = false;
      },
      error: async (err) => {
        this.loading = false;
        const t = await this.toastController.create({
          message: 'Error cargando radicados',
          duration: 3000,
          color: 'danger',
          position: 'top'
        });
        await t.present();
      }
    });
  }

  recargar(ev: any) {
    this.loading = true;
    this.pqrsService.misRadicados(this.filtroRadicado || undefined).subscribe({
      next: (data) => {
        this.radicados = data;
        this.loading = false;
        ev.target.complete();
      },
      error: async (err) => {
        this.loading = false;
        ev.target.complete();
        const t = await this.toastController.create({
          message: 'Error cargando radicados',
          duration: 3000,
          color: 'danger',
          position: 'top'
        });
        await t.present();
      }
    });
  }

  buscar() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.cargar();
    }, 300);
  }

  cerrarSesion() {
    this.authService.logout();
  }
}
