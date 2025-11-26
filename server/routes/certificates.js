// server/routes/certificates.js
const express = require("express");
const router = express.Router();

const certificateService = require("../services/certificateService");
const pdfService = require("../services/pdfService");

// ---------------------------------------------------------------------------
// POST /api/certificates -> crear certificado
// ---------------------------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const cert = await certificateService.create(data);

    res.json({
      ok: true,
      certificado: cert,
    });
  } catch (err) {
    console.error("Error en POST /api/certificates:", err);
    res.status(500).json({ error: "Error creando certificado" });
  }
});

// ---------------------------------------------------------------------------
// GET /api/certificates -> obtener todos
// ---------------------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const certs = await certificateService.getAll();
    res.json(certs);
  } catch (err) {
    console.error("Error en GET /api/certificates:", err);
    res.status(500).json({ error: "Error obteniendo certificados" });
  }
});

// ---------------------------------------------------------------------------
// ⚠️ IMPORTANTE: primero la ruta más específica (/html)
// GET /api/certificates/:id/html -> devolver certificado renderizado en HTML
router.get("/:id/html", async (req, res) => {
  try {
    const cert = await certificateService.getOne(req.params.id);

    if (!cert) {
      return res.status(404).send("Certificado no encontrado");
    }

    const html = pdfService.renderCertificateHtml(cert);
    console.log("Longitud HTML que se envía al navegador:", html.length);

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    console.error("Error en GET /api/certificates/:id/html:", err);
    res.status(500).send("Error generando HTML del certificado");
  }
});


// ---------------------------------------------------------------------------
// GET /api/certificates/:id -> obtener uno (JSON)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// GET /api/certificates/:id/pdf -> (placeholder hasta implementar Puppeteer)
// ---------------------------------------------------------------------------
router.get("/:id/pdf", async (req, res) => {
  res.status(501).send("PDF aún no implementado");
});

// ---------------------------------------------------------------------------
module.exports = router;
