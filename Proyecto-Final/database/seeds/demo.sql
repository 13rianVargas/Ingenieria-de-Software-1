-- seeds/demo.sql
-- Datos demo para desarrollo. NO ejecutar en produccion.
-- Carga manual (Brian, post-migrate): psql "$DATABASE_URL_DIRECT" < seeds/demo.sql

-- Usuarios demo (clave plana de los 3: "Demo2026!" para pruebas)
-- Hash BCrypt generado con cost 12. Cambiar en cada entorno real.
INSERT INTO usuario (tipo_doc, num_doc, nombres, apellidos, email, telefono, clave_hash, rol) VALUES
    ('CC', '1020304050', 'Brian',   'Vargas',  'brian@demo.com',   '3001112233', '$2a$12$DummyHashReplaceWithRealBcryptHashForDevSeed', 'admin'),
    ('CC', '1020304051', 'Gestor',  'Demo',    'gestor@demo.com',  '3002223344', '$2a$12$DummyHashReplaceWithRealBcryptHashForDevSeed', 'gestor'),
    ('CC', '1020304052', 'Cliente', 'Demo',    'cliente@demo.com', '3003334455', '$2a$12$DummyHashReplaceWithRealBcryptHashForDevSeed', 'cliente'),
    ('CE', '9876543210', 'Maria',   'Lopez',   'maria@demo.com',   '3004445566', '$2a$12$DummyHashReplaceWithRealBcryptHashForDevSeed', 'cliente');

-- PQRS demo (cliente_id apunta a 'Cliente Demo' = id 3 y 'Maria Lopez' = id 4)
INSERT INTO pqrs (radicado, tipo, asunto, descripcion, cliente_id) VALUES
    ('PQRS-2026-000001', 'queja',      'Producto vencido en estanteria',
        'El producto X que compre el dia 12 de mayo tenia fecha de vencimiento superada y me lo vendieron igual. Adjunto factura como evidencia.',
        3),
    ('PQRS-2026-000002', 'sugerencia', 'Ampliar horario sabados',
        'Sugiero ampliar el horario de atencion los sabados hasta las 8pm en la tienda del norte. Hay mucha demanda en esa franja horaria.',
        3),
    ('PQRS-2026-000003', 'peticion',   'Cambio de producto sin factura',
        'Solicito autorizacion para cambio de producto sin presentar factura fisica, dado que solo tengo el comprobante digital del pago con tarjeta.',
        4);

-- Tramite demo (gestor_id = 2 = 'Gestor Demo')
INSERT INTO tramite (pqrs_id, gestor_id, estado_anterior, estado_nuevo, justificacion) VALUES
    (1, 2, 'nuevo', 'en_proceso',
        'Se inicia investigacion con el proveedor del producto X para identificar el lote afectado.');

-- Actualizar estado de la PQRS 1 reflejando el tramite
UPDATE pqrs SET estado = 'en_proceso', gestor_id = 2 WHERE id = 1;
