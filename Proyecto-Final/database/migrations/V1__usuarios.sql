-- V1__usuarios.sql
-- Crea la tabla usuario. Centraliza Cliente, Gestor y Admin.
-- Sin tabla rol separada: rol se valida via CHECK enum directo.

CREATE TABLE usuario (
    id              SERIAL       PRIMARY KEY,
    tipo_doc        VARCHAR(4)   NOT NULL CHECK (tipo_doc IN ('CC', 'CE', 'TI', 'PP')),
    num_doc         VARCHAR(20)  NOT NULL UNIQUE,
    nombres         VARCHAR(100) NOT NULL CHECK (LENGTH(nombres) >= 2),
    apellidos       VARCHAR(100) NOT NULL CHECK (LENGTH(apellidos) >= 2),
    email           VARCHAR(150) NOT NULL UNIQUE,
    telefono        VARCHAR(20),
    clave_hash      VARCHAR(255) NOT NULL,
    rol             VARCHAR(20)  NOT NULL CHECK (rol IN ('cliente', 'gestor', 'admin')) DEFAULT 'cliente',
    fecha_creacion  TIMESTAMP    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE usuario IS 'Centraliza Cliente, Gestor y Admin. Discriminado por columna rol.';
COMMENT ON COLUMN usuario.tipo_doc IS 'CC, CE, TI o PP. CC para nacionales, CE extranjeria, TI menores, PP pasaporte.';
COMMENT ON COLUMN usuario.num_doc IS 'Numero de documento. Unico en el sistema.';
COMMENT ON COLUMN usuario.clave_hash IS 'Hash BCrypt (cost 12). Nunca almacenar clave plana.';
COMMENT ON COLUMN usuario.rol IS 'cliente, gestor o admin. Validado por CHECK constraint.';
COMMENT ON COLUMN usuario.fecha_creacion IS 'Timestamp de alta del usuario. Inmutable.';
