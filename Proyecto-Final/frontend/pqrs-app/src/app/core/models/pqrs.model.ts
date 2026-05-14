/**
 * Modelo de PQRS (Peticiones, Quejas, Reclamos, Sugerencias)
 * Define la estructura de datos para las solicitudes del cliente
 */

export interface PQRS {
  id?: string;
  radicado: string; // Número único generado por el sistema
  clienteId: string;
  clienteIdentificacion: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  tipo: TipoPQRS;
  comentarios: string;
  estado: EstadoPQRS;
  justificacion?: string;
  anexoPdf?: string; // Ruta/nombre del archivo PDF
  fechaCreacion: Date;
  fechaUltimaModificacion?: Date;
  gestorAsignado?: string;
}

export enum TipoPQRS {
  PETICION = 'PETICION',
  QUEJA = 'QUEJA',
  RECLAMO = 'RECLAMO',
  SUGERENCIA = 'SUGERENCIA'
}

export enum EstadoPQRS {
  NUEVO = 'NUEVO',
  EN_PROCESO = 'EN_PROCESO',
  RESUELTO = 'RESUELTO',
  RECHAZADO = 'RECHAZADO'
}

export interface CrearPQRSRequest {
  tipo: TipoPQRS;
  comentarios: string;
  clienteIdentificacion: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  anexoPdfBase64?: string; // Base64 del archivo PDF
}

export interface ActualizarPQRSRequest {
  estado: EstadoPQRS;
  justificacion: string;
}

export interface PQRSFilter {
  tipo?: TipoPQRS;
  estado?: EstadoPQRS;
  radicado?: string;
  clienteIdentificacion?: string;
}

export interface PQRSResponse {
  data: PQRS[];
  total: number;
  page?: number;
  pageSize?: number;
}

export interface ReportePQRS {
  radicados: PQRS[];
  generadoEn: Date;
  generadoPor: string;
  filtrosAplicados?: PQRSFilter;
}
