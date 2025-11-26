CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero INTEGER,
    cliente_nombre TEXT,
    cliente_direccion TEXT,
    fecha_tratamiento TEXT,
    fecha_vencimiento TEXT,
    servicios TEXT,
    firma_nombre TEXT,
    firma_cargo TEXT,
    pdf_path TEXT,
    created_at TEXT
);

CREATE TABLE IF NOT EXISTS certificate_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    certificate_id INTEGER,
    producto_nombre TEXT,
    producto_formula TEXT,
    producto_forma_aplicacion TEXT,
    FOREIGN KEY (certificate_id) REFERENCES certificates (id)
);
