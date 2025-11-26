// server/db/db.js
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "certificalo.db");
const schemaPath = path.join(__dirname, "schema.sql");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error al conectar SQLite:", err);
  } else {
    console.log("SQLite conectado:", dbPath);

    try {
      const schema = fs.readFileSync(schemaPath, "utf8");
      console.log("Leyendo schema.sql (longitud:", schema.length, ")");

      db.exec(schema, (err2) => {
        if (err2) {
          console.error("Error creando tablas:", err2);
        } else {
          console.log("✅ Tablas creadas/verificadas correctamente.");
        }
      });
    } catch (e) {
      console.error("Error leyendo schema.sql:", e);
    }
  }
});

module.exports = db;
