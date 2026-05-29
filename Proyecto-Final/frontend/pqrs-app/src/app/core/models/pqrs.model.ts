export enum TipoPQRS {
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

export interface ActualizarPQRSRequest {
  estado: string;
  justificacion: string;
}
