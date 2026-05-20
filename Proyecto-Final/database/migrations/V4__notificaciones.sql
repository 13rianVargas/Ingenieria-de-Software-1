-- V4__notificaciones.sql
-- Crea la tabla notificacion. Cola de correos transaccionales con retry.

CREATE TABLE notificacion (
    id           SERIAL       PRIMARY KEY,
    usuario_id   INT          NOT NULL REFERENCES usuario(id),
    pqrs_id      INT                   REFERENCES pqrs(id),
    tipo         VARCHAR(30)  NOT NULL CHECK (tipo IN ('radicado_creado', 'cambio_estado', 'clave_autogenerada', 'recordatorio')),
    plantilla    VARCHAR(50)  NOT NULL,
    enviado_en   TIMESTAMP,
    estado       VARCHAR(20)  NOT NULL CHECK (estado IN ('pendiente', 'enviada', 'fallida')) DEFAULT 'pendiente',
    intentos     INT          NOT NULL DEFAULT 0 CHECK (intentos >= 0 AND intentos <= 5)
);

-- Indice parcial: solo filas con estado pendiente o fallida (las que requieren retry).
CREATE INDEX idx_notificacion_estado ON notificacion(estado) WHERE estado IN ('pendiente', 'fallida');

COMMENT ON TABLE notificacion IS 'Cola de correos transaccionales. Permite retry asincrono sin bloquear API.';
COMMENT ON COLUMN notificacion.tipo IS 'Categoria de notificacion. Determina plantilla y datos.';
COMMENT ON COLUMN notificacion.plantilla IS 'Identificador de plantilla en el modulo pqrs-notificaciones.';
COMMENT ON COLUMN notificacion.estado IS 'pendiente, enviada o fallida. Se actualiza por el worker SMTP.';
COMMENT ON COLUMN notificacion.intentos IS 'Numero de reintentos. Maximo 5 antes de marcar fallida.';
