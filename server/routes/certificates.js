// server/routes/certificates.js
const express = require("express");
const router = express.Router();
const certificateService = require("../services/certificateService");

// POST /api/certificates -> crear y guardar en DB
router.post("/", async (req, res) => {
  try {
    const cert = await certificateService.create(req.body);

    res.json({
      ok: true,
      certificado: cert,
    });
  } catch (err) {
    console.error("Error en POST /api/certificates:", err);
    res.status(500).json({ error: "Error creando certificado" });
  }
});

// GET /api/certificates -> listar todos
router.get("/", async (req, res) => {
  try {
    const list = await certificateService.getAll();
    res.json(list);
  } catch (err) {
    console.error("Error en GET /api/certificates:", err);
    res.status(500).json({ error: "Error obteniendo certificados" });
  }
});

// GET /api/certificates/:id -> obtener uno
router.get("/:id", async (req, res) => {
  try {
    const cert = await certificateService.getOne(req.params.id);
    if (!cert) {
      return res.status(404).json({ error: "Certificado no encontrado" });
    }
    res.json(cert);
  } catch (err) {
    console.error("Error en GET /api/certificates/:id:", err);
    res.status(500).json({ error: "Error obteniendo certificado" });
  }
});

// PDF lo dejamos para después
router.get("/:id/pdf", (req, res) => {
  res.status(501).send("PDF no implementado todavía.");
});

module.exports = router;
