// server/routes/certificates.js
const express = require("express");
const path = require("path");
const router = express.Router();

const certificateService = require("../services/certificateService");
const pdfService = require("../services/pdfService");

// ---------------------------------------------------------------------------
// GET /api/certificates -> listar todos
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
// GET /api/certificates/:id -> obtener uno
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
// GET /api/certificates/:id/html -> devolver certificado como HTML
// ---------------------------------------------------------------------------
router.get("/:id/html", async (req, res) => {
  try {
    const cert = await certificateService.getOne(req.params.id);

    if (!cert) {
      return res.status(404).send("Certificado no encontrado");
    }

    const html = pdfService.renderCertificateHtml(cert);

    res.set({ "Content-Type": "text/html" });
    res.send(html);
  } catch (err) {
    console.error("Error en GET /api/certificates/:id/html:", err);
    res.status(500).send("Error generando HTML del certificado");
  }
});

// ---------------------------------------------------------------------------
// GET /api/certificates/:id/pdf -> generar y devolver PDF
// ---------------------------------------------------------------------------
router.get("/:id/pdf", async (req, res) => {
  try {
    const cert = await certificateService.getOne(req.params.id);

    if (!cert) {
      return res.status(404).send("Certificado no encontrado");
    }

    const { pdfPath } = await pdfService.generateCertificatePdf(cert);

    return res.sendFile(pdfPath, (err) => {
      if (err) {
        console.error("Error enviando PDF:", err);
        if (!res.headersSent) {
          res.status(500).send("Error al enviar el PDF");
        }
      }
    });
  } catch (err) {
    console.error("Error en GET /api/certificates/:id/pdf:", err);
    res.status(500).send("Error generando PDF del certificado");
  }
});

// ---------------------------------------------------------------------------
// POST /api/certificates -> crear uno nuevo
// ---------------------------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const newCert = await certificateService.create(req.body);

    res.json({
      ok: true,
      certificado: newCert,
    });
  } catch (err) {
    console.error("Error en POST /api/certificates:", err);
    res.status(500).json({ ok: false, error: "Error creando certificado" });
  }
});

module.exports = router;
