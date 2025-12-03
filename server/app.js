// server/app.js
const express = require("express");
const path = require("path");
const cors = require("cors");

const certificatesRouter = require("./routes/certificates");
const db = require("./db/db"); // Conecta SQLite

const app = express();

// =========================
// CONFIGURACIONES
// =========================
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "..", "public")));

// =========================
// RUTAS API
// =========================
app.use("/api/certificates", certificatesRouter);

// =========================
// RUTA 404 GENÉRICA (opcional)
// =========================
app.use((req, res) => {
  res.status(404).send("Recurso no encontrado");
});

// =========================
// INICIO DEL SERVIDOR
// =========================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log("SQLite conectado:", db ? "ok" : "sin conexión");
});
