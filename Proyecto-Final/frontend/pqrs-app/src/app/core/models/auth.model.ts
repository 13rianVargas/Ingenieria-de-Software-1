/**
 * Modelo de Autenticación
 * Define las respuestas y estructuras de autenticación
 */

export interface AuthResponse {
  token: string;
  rol: string;
  expiraEn?: string;
}

export interface TokenPayload {
  userId: string;
  identificacion: string;
  rol: string;
  iat: number;
  exp: number;
}

export interface SessionData {
  user: {
    id: string;
    identificacion: string;
    nombre: string;
    email: string;
    rol: string;
  };
  token: string;
  expiresAt: number;
}
