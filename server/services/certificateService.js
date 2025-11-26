// server/services/certificateService.js
const db = require("../db/db");

module.exports = {
  // Crear certificado
  create: (data) => {
    return new Promise((resolve, reject) => {
      // 1) buscar el número máximo que ya existe
      db.get("SELECT MAX(numero) AS maxNum FROM certificates", (err, row) => {
        if (err) return reject(err);

        const nextNumber = (row?.maxNum || 0) + 1;
        const serviciosTexto = JSON.stringify(data.servicios || []);

        const stmt = `
          INSERT INTO certificates
          (numero, cliente_nombre, cliente_direccion, fecha_tratamiento, fecha_vencimiento, servicios, firma_nombre, firma_cargo, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `;

        db.run(
          stmt,
          [
            nextNumber,
            data.cliente_nombre,
            data.cliente_direccion,
            data.fecha_tratamiento,
            data.fecha_vencimiento,
            serviciosTexto,
            data.firma_nombre,
            data.firma_cargo,
          ],
          function (err) {
            if (err) return reject(err);

            const insertedId = this.lastID;

            // devolvemos el certificado creado
            resolve({
              id: insertedId,
              numero: nextNumber,
              ...data,
            });
          }
        );
      });
    });
  },

  // Listar todos
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM certificates ORDER BY id DESC", (err, rows) => {
        if (err) return reject(err);

        const parsed = rows.map((row) => ({
          ...row,
          servicios: row.servicios ? JSON.parse(row.servicios) : [],
        }));

        resolve(parsed);
      });
    });
  },

  // Obtener uno por ID
  getOne: (id) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM certificates WHERE id = ?", [id], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);

        const parsed = {
          ...row,
          servicios: row.servicios ? JSON.parse(row.servicios) : [],
        };

        resolve(parsed);
      });
    });
  },
};
