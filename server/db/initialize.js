// server/db/initialize.js
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "certificalo.db");
const schemaPath = path.join(__dirname, "schema.sql");

console.log("DB path:", dbPath);
console.log("Schema path:", schemaPath);

const schema = fs.readFileSync(schemaPath, "utf8");
console.log("Schema length:", schema.length);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error conectando a SQLite:", err);
    process.exit(1);
  } else {
    console.log("SQLite conectado para inicialización.");
    db.exec(schema, (err) => {
      if (err) {
        console.error("Error creando tablas:", err);
      } else {
        console.log("✅ Tablas creadas correctamente.");
      }
      db.close(() => {
        console.log("DB cerrada. Fin de initialize.js");
      });
    });
  }
});
