-- V2__pqrs.sql
-- Crea la tabla pqrs. Cabecera de cada radicado.
-- Estado actual + metadata. El historial de cambios vive en tramite (V3).

CREATE TABLE pqrs (
    id              SERIAL       PRIMARY KEY,
    radicado        VARCHAR(20)  NOT NULL UNIQUE,
    tipo            VARCHAR(20)  NOT NULL CHECK (tipo IN ('peticion', 'queja', 'reclamo', 'sugerencia')),
    asunto          VARCHAR(200) NOT NULL CHECK (LENGTH(asunto) BETWEEN 5 AND 200),
    descripcion     TEXT         NOT NULL CHECK (LENGTH(descripcion) >= 20),
    estado          VARCHAR(20)  NOT NULL CHECK (estado IN ('nuevo', 'en_proceso', 'resuelto', 'rechazado')) DEFAULT 'nuevo',
    cliente_id      INT          NOT NULL REFERENCES usuario(id),
    gestor_id       INT                   REFERENCES usuario(id),
    fecha_radicado  TIMESTAMP    NOT NULL DEFAULT NOW(),
    fecha_cierre    TIMESTAMP
);

CREATE INDEX idx_pqrs_estado  ON pqrs(estado);
CREATE INDEX idx_pqrs_cliente ON pqrs(cliente_id, fecha_radicado DESC);
CREATE INDEX idx_pqrs_gestor  ON pqrs(gestor_id);

COMMENT ON TABLE pqrs IS 'Cabecera del radicado. Una fila por PQRS. El historial de cambios vive en tramite.';
COMMENT ON COLUMN pqrs.radicado IS 'Numero publico al cliente. Formato PQRS-YYYY-NNNNNN. Generado por el backend.';
COMMENT ON COLUMN pqrs.tipo IS 'Categoria de la PQRS segun el cliente.';
COMMENT ON COLUMN pqrs.estado IS 'Estado actual. Cambia con cada tramite.';
COMMENT ON COLUMN pqrs.cliente_id IS 'FK al usuario con rol cliente que radico.';
COMMENT ON COLUMN pqrs.gestor_id IS 'FK al usuario con rol gestor. NULL hasta asignacion.';
COMMENT ON COLUMN pqrs.fecha_cierre IS 'Solo se llena cuando estado IN (resuelto, rechazado).';
