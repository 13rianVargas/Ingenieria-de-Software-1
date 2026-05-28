-- V6__pqrs_radicado_sequence.sql
-- Secuencia para generar el consecutivo del radicado publico (formato PQRS-YYYY-NNNNNN).
-- El backend (GeneradorRadicado) hace SELECT nextval('pqrs_radicado_seq') al radicar.
-- IF NOT EXISTS para tolerar aplicacion manual previa en dev sin romper Flyway.

CREATE SEQUENCE IF NOT EXISTS pqrs_radicado_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE;

COMMENT ON SEQUENCE pqrs_radicado_seq IS 'Consecutivo global del radicado PQRS. Lo consume el backend al radicar.';
