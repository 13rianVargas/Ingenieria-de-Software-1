-- V5__auditoria.sql
-- Crea la tabla auditoria. Log tecnico generado por AOP en el backend.
-- Toda operacion CRUD del dominio queda registrada aqui.

CREATE TABLE auditoria (
    id            SERIAL       PRIMARY KEY,
    usuario_id    INT                   REFERENCES usuario(id),
    accion        VARCHAR(50)  NOT NULL,
    entidad       VARCHAR(50)  NOT NULL,
    entidad_id    INT          NOT NULL,
    ip            VARCHAR(45),
    timestamp     TIMESTAMP    NOT NULL DEFAULT NOW(),
    payload_json  JSONB
);

CREATE INDEX idx_auditoria_usuario  ON auditoria(usuario_id, timestamp DESC);
CREATE INDEX idx_auditoria_entidad  ON auditoria(entidad, entidad_id);
CREATE INDEX idx_auditoria_payload  ON auditoria USING GIN (payload_json);

COMMENT ON TABLE auditoria IS 'Log tecnico generado por AOP. Toda operacion CRUD del dominio.';
COMMENT ON COLUMN auditoria.usuario_id IS 'Usuario que ejecuto. NULL si fue el sistema (jobs, retries).';
COMMENT ON COLUMN auditoria.accion IS 'Vocabulario controlado por el AOP aspect del backend.';
COMMENT ON COLUMN auditoria.entidad IS 'Nombre de la tabla afectada.';
COMMENT ON COLUMN auditoria.entidad_id IS 'PK de la fila afectada. FK soft (no enforced).';
COMMENT ON COLUMN auditoria.ip IS 'IP del cliente. Soporta IPv4 e IPv6.';
COMMENT ON COLUMN auditoria.payload_json IS 'Snapshot del cambio (before/after o data relevante).';
