/**
 * Modelo de PQRS (Peticiones, Quejas, Reclamos, Sugerencias)
 * Define la estructura de datos para las solicitudes del cliente
 */

export enum TipoPQRS {
  PETICION = 'peticion',
  QUEJA = 'queja',
  RECLAMO = 'reclamo',
  SUGERENCIA = 'sugerencia'
}

export enum EstadoPQRS {
  NUEVO = 'nuevo',
  EN_PROCESO = 'en_proceso',
  RESUELTO = 'resuelto',
  RECHAZADO = 'rechazado'
}

export interface PQRS {
  id: number;
  radicado: string;
  tipo: TipoPQRS;
  asunto: string;
  estado: EstadoPQRS;
  fechaRadicado: string | Date;
  fechaCierre?: string | Date;
  
  // Mobile app back-compat fields
  comentarios?: string;
  fechaCreacion?: string | Date;
  anexoPdf?: string;
  clienteId?: string | number;
  clienteNombre?: string;
  clienteIdentificacion?: string;
  clienteEmail?: string;
  justificacion?: string;
}

export interface PqrsDetalle {
  id: number;
  radicado: string;
  tipo: TipoPQRS;
  asunto: string;
  descripcion: string;
  estado: EstadoPQRS;
  clienteId: number;
  gestorId?: number;
  fechaRadicado: string | Date;
  fechaCierre?: string | Date;
  tramites: TramiteItem[];
  adjuntos: AdjuntoItem[];
}

export interface TramiteItem {
  estadoAnterior: EstadoPQRS;
  estadoNuevo: EstadoPQRS;
  justificacion: string;
  gestorId: number;
  timestamp: string | Date;
}

export interface AdjuntoItem {
  id: number;
  nombreArchivo: string;
  tipoMime: string;
  tamanoBytes: number;
  fechaSubida: string | Date;
}

export interface CrearPQRSRequest {
  tipo: TipoPQRS;
  asunto: string;
  descripcion: string;

  // Mobile app back-compat fields
  comentarios?: string;
  clienteIdentificacion?: string;
  clienteNombre?: string;
  clienteEmail?: string;
  clienteTelefono?: string;
}

/** Resumen de PQRS para listados (lo que devuelve GET /pqrs/mis). */
export interface PqrsResumen {
  id: number;
  radicado: string;
  tipo: TipoPQRS;
  asunto: string;
  estado: EstadoPQRS;
  fechaRadicado: string | Date;
  fechaCierre?: string | Date;
}

/** Radicacion anonima (mobile): incluye datos del cliente para el registro automatico. */
export interface CrearPQRSAnonimoRequest {
  tipoDoc: string;   // CC | CE | TI | PP
  numDoc: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  tipo: string;      // peticion | queja | reclamo | sugerencia
  asunto: string;
  descripcion: string;
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
