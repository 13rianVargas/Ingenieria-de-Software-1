/**
 * Modelo de Autenticación
 * Define las respuestas y estructuras de autenticación
 */

export interface AuthResponse {
  // Forma plana del backend (consumida por el login web).
  token?: string;
  rol?: string;
  expiraEn?: string;
  // Forma envuelta que arma auth.service.mapLoginResponse (consumida por el login mobile).
  success?: boolean;
  message?: string;
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
