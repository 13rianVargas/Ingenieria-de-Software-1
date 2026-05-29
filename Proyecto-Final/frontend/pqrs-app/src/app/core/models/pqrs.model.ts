export enum TipoPQRS {
  PETICION = 'PETICION',
  QUEJA = 'QUEJA',
  RECLAMO = 'RECLAMO',
  SUGERENCIA = 'SUGERENCIA',
  peticion = 'peticion',
  queja = 'queja',
  reclamo = 'reclamo',
  sugerencia = 'sugerencia'
}

export enum EstadoPQRS {
  NUEVO = 'NUEVO',
  EN_PROCESO = 'EN_PROCESO',
  RESUELTO = 'RESUELTO',
  RECHAZADO = 'RECHAZADO'
}

export interface PQRS {
  id?: string;
  radicado: string;
  clienteId: string;
  clienteIdentificacion: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  tipo: TipoPQRS;
  comentarios: string;
  estado: EstadoPQRS;
  justificacion?: string;
  anexoPdf?: string;
  fechaCreacion: Date;
  fechaUltimaModificacion?: Date;
  gestorAsignado?: string;
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

export interface PqrsResumen {
  id: number;
  radicado: string;
  tipo: string;
  asunto: string;
  estado: string;
  fechaRadicado: Date;
  fechaCierre?: Date;
}

export interface PqrsDetalle extends PqrsResumen {
  descripcion: string;
  clienteId: number;
  gestorId?: number;
  tramites: Tramite[];
  adjuntos: Adjunto[];
}

export interface Tramite {
  estadoAnterior: string;
  estadoNuevo: string;
  justificacion: string;
  gestorId: number;
  timestamp: Date;
}

export interface Adjunto {
  id: number;
  nombreArchivo: string;
  tipoMime: string;
  tamanoBytes: number;
  fechaSubida: Date;
}

export interface CrearPQRSRequest {
  tipo: string;
  asunto: string;
  descripcion: string;
}

/** Radicacion anonima: incluye datos del cliente para el registro automatico. */
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
  estado: string;
  justificacion: string;
}
