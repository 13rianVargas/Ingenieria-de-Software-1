-- V3__tramites_adjuntos.sql
-- Crea tramite (log de negocio de cambios de estado) y adjunto (metadata de PDFs en NAS).

CREATE TABLE tramite (
    id               SERIAL       PRIMARY KEY,
    pqrs_id          INT          NOT NULL REFERENCES pqrs(id),
    gestor_id        INT          NOT NULL REFERENCES usuario(id),
    estado_anterior  VARCHAR(20)  NOT NULL CHECK (estado_anterior IN ('nuevo', 'en_proceso', 'resuelto', 'rechazado')),
    estado_nuevo     VARCHAR(20)  NOT NULL CHECK (estado_nuevo IN ('nuevo', 'en_proceso', 'resuelto', 'rechazado')),
    justificacion    TEXT         NOT NULL CHECK (LENGTH(TRIM(justificacion)) >= 10),
    timestamp        TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tramite_pqrs ON tramite(pqrs_id, timestamp DESC);

COMMENT ON TABLE tramite IS 'Log de negocio: cada cambio de estado de una PQRS. Visible al cliente.';
COMMENT ON COLUMN tramite.justificacion IS 'Razon obligatoria del cambio. Minimo 10 caracteres no blancos.';
COMMENT ON COLUMN tramite.timestamp IS 'Fecha y hora del cambio de estado.';

CREATE TABLE adjunto (
    id              SERIAL       PRIMARY KEY,
    pqrs_id         INT          NOT NULL REFERENCES pqrs(id) ON DELETE CASCADE,
    nombre_archivo  VARCHAR(255) NOT NULL,
    url_nas         VARCHAR(500) NOT NULL,
    tipo_mime       VARCHAR(50)  NOT NULL CHECK (tipo_mime = 'application/pdf'),
    tamano_bytes    BIGINT       NOT NULL CHECK (tamano_bytes > 0 AND tamano_bytes <= 5242880),
    fecha_subida    TIMESTAMP    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE adjunto IS 'Metadata del PDF adjunto. El binario vive en NAS, no en BD.';
COMMENT ON COLUMN adjunto.url_nas IS 'Ruta absoluta o URI del archivo en el NAS.';
COMMENT ON COLUMN adjunto.tipo_mime IS 'Solo application/pdf permitido.';
COMMENT ON COLUMN adjunto.tamano_bytes IS 'Maximo 5 MB (5242880 bytes).';
