import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  CrearPQRSRequest,
  PqrsResumen,
  PqrsDetalle,
  ActualizarPQRSRequest
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class PQRSService {
  private apiUrl = environment.apiBaseUrl;
  private http = inject(HttpClient);

  crearPQRS(pqrs: CrearPQRSRequest, archivo?: File): Observable<any> {
    const formData = new FormData();
    formData.append('pqrs', new Blob([JSON.stringify(pqrs)], { type: 'application/json' }));
    
    if (archivo) {
      formData.append('anexo', archivo, archivo.name);
    }

    return this.http.post<any>(\/pqrs, formData);
  }

  misRadicados(radicado?: string): Observable<PqrsResumen[]> {
    let params = new HttpParams();
    if (radicado) {
      params = params.set('radicado', radicado);
    }
    return this.http.get<PqrsResumen[]>(\/pqrs/mis, { params });
  }

  detalle(id: number): Observable<PqrsDetalle> {
    return this.http.get<PqrsDetalle>(\/pqrs/\);
  }

  descargarAnexo(id: number): Observable<Blob> {
    return this.http.get(\/pqrs/\/anexo, { responseType: 'blob' });
  }

  tramitar(id: number, data: ActualizarPQRSRequest): Observable<any> {
    return this.http.post<any>(\/pqrs/\/tramitar, data);
  }
}
