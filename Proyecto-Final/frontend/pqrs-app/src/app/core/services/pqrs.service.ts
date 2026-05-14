import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  PQRS, 
  CrearPQRSRequest, 
  ActualizarPQRSRequest, 
  PQRSFilter, 
  PQRSResponse,
  ApiResponse 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class PQRSService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  /**
   * Crea una nueva PQRS
   * @param pqrs - Datos de la nueva PQRS
   * @param archivo - Archivo PDF opcional
   */
  crearPQRS(pqrs: CrearPQRSRequest, archivo?: File): Observable<ApiResponse<PQRS>> {
    const formData = new FormData();
    formData.append('tipo', pqrs.tipo);
    formData.append('comentarios', pqrs.comentarios);
    formData.append('clienteIdentificacion', pqrs.clienteIdentificacion);
    formData.append('clienteNombre', pqrs.clienteNombre);
    formData.append('clienteEmail', pqrs.clienteEmail);
    
    if (pqrs.clienteTelefono) {
      formData.append('clienteTelefono', pqrs.clienteTelefono);
    }

    if (archivo) {
      formData.append('anexoPdf', archivo);
    }

    return this.http.post<ApiResponse<PQRS>>(
      `${this.apiUrl}/pqrs/crear`,
      formData
    ).pipe(
      tap(response => {
        if (response.success) {
          console.log('PQRS creada exitosamente:', response.data);
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Obtiene todas las PQRS (para Gestores)
   * @param filtros - Filtros opcionales
   * @param page - Número de página
   * @param pageSize - Tamaño de página
   */
  obtenerBandeja(
    filtros?: PQRSFilter,
    page: number = 1,
    pageSize: number = 10
  ): Observable<ApiResponse<PQRSResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filtros) {
      if (filtros.tipo) params = params.set('tipo', filtros.tipo);
      if (filtros.estado) params = params.set('estado', filtros.estado);
      if (filtros.radicado) params = params.set('radicado', filtros.radicado);
    }

    return this.http.get<ApiResponse<PQRSResponse>>(
      `${this.apiUrl}/pqrs/bandeja`,
      { params }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Obtiene el historial de PQRS del cliente actual
   * @param clienteId - ID del cliente
   * @param page - Número de página
   * @param pageSize - Tamaño de página
   */
  obtenerHistorial(
    clienteId: string,
    page: number = 1,
    pageSize: number = 10
  ): Observable<ApiResponse<PQRSResponse>> {
    const params = new HttpParams()
      .set('clienteId', clienteId)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PQRSResponse>>(
      `${this.apiUrl}/pqrs/historial`,
      { params }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Busca una PQRS específica por radicado
   * @param radicado - Número de radicado
   */
  obtenerPorRadicado(radicado: string): Observable<ApiResponse<PQRS>> {
    return this.http.get<ApiResponse<PQRS>>(
      `${this.apiUrl}/pqrs/radicado/${radicado}`
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Filtra PQRS según criterios
   * @param filtros - Criterios de filtro
   * @param page - Número de página
   * @param pageSize - Tamaño de página
   */
  filtrarPQRS(
    filtros: PQRSFilter,
    page: number = 1,
    pageSize: number = 10
  ): Observable<ApiResponse<PQRSResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filtros.tipo) params = params.set('tipo', filtros.tipo);
    if (filtros.estado) params = params.set('estado', filtros.estado);
    if (filtros.radicado) params = params.set('radicado', filtros.radicado);
    if (filtros.clienteIdentificacion) 
      params = params.set('clienteIdentificacion', filtros.clienteIdentificacion);

    return this.http.get<ApiResponse<PQRSResponse>>(
      `${this.apiUrl}/pqrs/filtro`,
      { params }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Actualiza el estado de una PQRS
   * @param radicado - Número de radicado
   * @param actualizar - Nuevo estado y justificación
   */
  actualizarEstado(
    radicado: string,
    actualizar: ActualizarPQRSRequest
  ): Observable<ApiResponse<PQRS>> {
    return this.http.put<ApiResponse<PQRS>>(
      `${this.apiUrl}/pqrs/${radicado}/estado`,
      actualizar
    ).pipe(
      tap(response => {
        if (response.success) {
          console.log('Estado actualizado exitosamente');
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Descarga el anexo PDF de una PQRS
   * @param radicado - Número de radicado
   */
  descargarAnexo(radicado: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/pqrs/${radicado}/anexo`,
      { responseType: 'blob' }
    ).pipe(
      tap(blob => {
        // Generar descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `PQRS_${radicado}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Genera y descarga reporte PDF de radicados
   * @param filtros - Filtros a aplicar en el reporte
   */
  generarReporte(filtros?: PQRSFilter): Observable<Blob> {
    let params = new HttpParams();

    if (filtros) {
      if (filtros.tipo) params = params.set('tipo', filtros.tipo);
      if (filtros.estado) params = params.set('estado', filtros.estado);
      if (filtros.radicado) params = params.set('radicado', filtros.radicado);
    }

    return this.http.get(
      `${this.apiUrl}/pqrs/reportes/generar`,
      { params, responseType: 'blob' }
    ).pipe(
      tap(blob => {
        // Generar descarga
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

  /**
   * Valida que un archivo sea PDF
   * @param archivo - Archivo a validar
   */
  validarPDF(archivo: File): boolean {
    const validMimeType = archivo.type === 'application/pdf';
    const validExtension = archivo.name.toLowerCase().endsWith('.pdf');
    return validMimeType && validExtension;
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error al procesar la solicitud';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status) {
      switch (error.status) {
        case 400:
          errorMessage = 'Datos inválidos';
          break;
        case 401:
          errorMessage = 'No autenticado';
          break;
        case 403:
          errorMessage = 'Acceso denegado';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 500:
          errorMessage = 'Error del servidor';
          break;
        default:
          errorMessage = error.error?.message || errorMessage;
      }
    }

    console.error('Error PQRS:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
