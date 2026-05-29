/**
 * Modelo de Respuesta API
 * Estructura estándar para todas las respuestas del backend
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  error?: ApiError;
  timestamp?: Date;
}

export interface ApiError {
  code: string;
  description: string;
  details?: any;
}

export interface PaginaResponse<T> {
  contenido: T[];
  total: number;
  page: number;
  size: number;
}
