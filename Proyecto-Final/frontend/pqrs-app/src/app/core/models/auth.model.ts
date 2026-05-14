/**
 * Modelo de Autenticación
 * Define las respuestas y estructuras de autenticación
 */

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      identificacion: string;
      nombre: string;
      rol: string;
    };
    token: string;
    expiresIn: number;
  };
  error?: string;
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
