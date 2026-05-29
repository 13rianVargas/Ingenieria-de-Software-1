import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  CrearPQRSRequest,
  PqrsResumen,
  PqrsDetalle,
  ActualizarPQRSRequest,
  PQRSFilter,
  PQRSResponse,
  ApiResponse,
  PQRS
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class PQRSService {
  private apiUrl = environment.apiBaseUrl;
  private http = inject(HttpClient);

  // MOBILE METHODS
  crearPQRS(pqrs: CrearPQRSRequest, archivo?: File): Observable<any> {
    const formData = new FormData();
    formData.append('pqrs', new Blob([JSON.stringify(pqrs)], { type: 'application/json' }));
    
    if (archivo) {
      formData.append('anexo', archivo, archivo.name);
    }

    return this.http.post<any>(this.apiUrl + '/pqrs', formData);
  }

  misRadicados(radicado?: string): Observable<PqrsResumen[]> {
    let params = new HttpParams();
    if (radicado) {
      params = params.set('radicado', radicado);
    }
    return this.http.get<PqrsResumen[]>(this.apiUrl + '/pqrs/mis', { params });
  }

  detalle(id: number): Observable<PqrsDetalle> {
    return this.http.get<PqrsDetalle>(this.apiUrl + '/pqrs/' + id);
  }

  descargarAnexo(id: string | number): Observable<Blob> {
    return this.http.get(this.apiUrl + '/pqrs/' + id + '/anexo', { responseType: 'blob' });
  }

  tramitar(id: number, data: ActualizarPQRSRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/pqrs/' + id + '/tramitar', data);
  }

  // WEB METHODS COMPATIBILITY
  obtenerBandeja(filtros?: PQRSFilter, page: number = 1, pageSize: number = 10): Observable<ApiResponse<PQRSResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filtros) {
      if (filtros.tipo) params = params.set('tipo', filtros.tipo);
      if (filtros.estado) params = params.set('estado', filtros.estado);
      if (filtros.radicado) params = params.set('radicado', filtros.radicado);
      if (filtros.clienteIdentificacion) params = params.set('clienteIdentificacion', filtros.clienteIdentificacion);
    }

    return this.http.get<ApiResponse<PQRSResponse>>(this.apiUrl + '/pqrs/bandeja', { params });
  }

  obtenerPorRadicado(radicado: string): Observable<ApiResponse<PQRS>> {
    return this.http.get<ApiResponse<PQRS>>(this.apiUrl + '/pqrs/detalle/' + radicado);
  }

  actualizarEstado(id: string, request: ActualizarPQRSRequest): Observable<ApiResponse<PQRS>> {
    return this.http.put<ApiResponse<PQRS>>(this.apiUrl + '/pqrs/' + id + '/estado', request);
  }

  generarReporte(filtros?: PQRSFilter): Observable<Blob> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.tipo) params = params.set('tipo', filtros.tipo);
      if (filtros.estado) params = params.set('estado', filtros.estado);
      if (filtros.radicado) params = params.set('radicado', filtros.radicado);
    }

    return this.http.get(this.apiUrl + '/pqrs/reporte', {
      params,
      responseType: 'blob'
    });
  }
}
