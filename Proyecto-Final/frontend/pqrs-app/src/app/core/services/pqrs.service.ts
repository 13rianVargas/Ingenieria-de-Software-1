import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  PQRS, 
  PqrsDetalle,
  CrearPQRSRequest, 
  ActualizarPQRSRequest, 
  PQRSFilter 
} from '../models';
import { PaginaResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PQRSService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  crearPQRS(pqrs: CrearPQRSRequest, archivo?: File): Observable<any> {
    const formData = new FormData();
    // backend espera @RequestPart("pqrs") RadicarPqrsRequest
    formData.append('pqrs', new Blob([JSON.stringify(pqrs)], { type: 'application/json' }));

    if (archivo) {
      formData.append('anexo', archivo);
    }

    return this.http.post<any>(
      `${this.apiUrl}/pqrs`,
      formData
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  obtenerBandeja(
    filtros?: PQRSFilter,
    page: number = 1,
    pageSize: number = 10
  ): Observable<PaginaResponse<PQRS>> {
    // El backend espera page desde 0
    let params = new HttpParams()
      .set('page', (page - 1).toString())
      .set('size', pageSize.toString());

    if (filtros) {
      if (filtros.tipo) params = params.set('tipo', filtros.tipo);
      if (filtros.estado) params = params.set('estado', filtros.estado);
    }

    return this.http.get<PaginaResponse<PQRS>>(
      `${this.apiUrl}/pqrs`,
      { params }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  obtenerHistorial(
    radicado?: string
  ): Observable<PQRS[]> {
    let params = new HttpParams();
    if (radicado) {
      params = params.set('radicado', radicado);
    }

    return this.http.get<PQRS[]>(
      `${this.apiUrl}/pqrs/mis`,
      { params }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  obtenerPorId(id: number | string): Observable<PqrsDetalle> {
    return this.http.get<PqrsDetalle>(
      `${this.apiUrl}/pqrs/${id}`
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  actualizarEstado(
    id: number | string,
    actualizar: ActualizarPQRSRequest
  ): Observable<PQRS> {
    return this.http.put<PQRS>(
      `${this.apiUrl}/pqrs/${id}/estado`,
      actualizar
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  descargarAnexo(id: number | string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/pqrs/${id}/anexo`,
      { responseType: 'blob' }
    ).pipe(
      tap(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Anexo_${id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      }),
      catchError(error => this.handleError(error))
    );
  }

  generarReporte(filtros?: PQRSFilter): Observable<Blob> {
    let params = new HttpParams();

    if (filtros) {
      if (filtros.tipo) params = params.set('tipo', filtros.tipo);
      if (filtros.estado) params = params.set('estado', filtros.estado);
    }

    return this.http.get(
      `${this.apiUrl}/pqrs/reporte`,
      { params, responseType: 'blob' }
    ).pipe(
      tap(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Reporte_Bandeja_PQRS_${new Date().getTime()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      }),
      catchError(error => this.handleError(error))
    );
  }

  validarPDF(archivo: File): boolean {
    const validMimeType = archivo.type === 'application/pdf';
    const validExtension = archivo.name.toLowerCase().endsWith('.pdf');
    return validMimeType && validExtension;
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error al procesar la solicitud';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status) {
      const detalle = error.error?.detalle || error.error?.error;
      if (typeof detalle === 'string') {
        errorMessage = detalle;
      } else if (typeof detalle === 'object' && detalle !== null) {
        errorMessage = Object.values(detalle).join(', ');
      } else {
        switch (error.status) {
          case 400: errorMessage = 'Datos inválidos'; break;
          case 401: errorMessage = 'No autenticado'; break;
          case 403: errorMessage = 'Acceso denegado'; break;
          case 404: errorMessage = 'Recurso no encontrado'; break;
          case 500: errorMessage = 'Error del servidor'; break;
        }
      }
    }

    console.error('Error PQRS:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
