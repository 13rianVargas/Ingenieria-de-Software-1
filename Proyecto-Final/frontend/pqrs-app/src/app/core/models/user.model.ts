/**
 * Modelo de Usuario del Sistema
 * Representa tanto Clientes como Gestores de PQRS
 */

export interface User {
  id: string;
  identificacion: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol: UserRole;
  estado?: 'activo' | 'inactivo';
  fechaCreacion?: Date;
  ultimoAcceso?: Date;
}

export enum UserRole {
  CLIENTE = 'CLIENTE',
  GESTOR = 'GESTOR'
}

export interface LoginCredentials {
  email: string;
  clave: string;
}

export interface RegistroCliente {
  identificacion: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
}
