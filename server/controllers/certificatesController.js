// server/controllers/certificatesController.js
const certificateService = require("../services/certificateService");

const certificatesController = {
  create: async (req, res) => {
    try {
      const result = await certificateService.create(req.body);
      res.json(result);
    } catch (err) {
      console.error("Error en create:", err);
      res.status(500).json({ error: "Error creando certificado" });
    }
  },

  getAll: async (req, res) => {
    try {
      const list = await certificateService.getAll();
      res.json(list);
    } catch (err) {
      console.error("Error en getAll:", err);
      res.status(500).json({ error: "Error obteniendo certificados" });
    }
  },

  getOne: async (req, res) => {
    try {
      const cert = await certificateService.getOne(req.params.id);
      if (!cert) {
        return res.status(404).json({ error: "Certificado no encontrado" });
      }
      res.json(cert);
    } catch (err) {
      console.error("Error en getOne:", err);
      res.status(500).json({ error: "Error obteniendo certificado" });
    }
  },

  downloadPdf: async (req, res) => {
    try {
      // lo vamos a implementar después
      res.status(501).send("Descarga de PDF no implementada todavía.");
    } catch (err) {
      console.error("Error en downloadPdf:", err);
      res.status(500).json({ error: "Error descargando PDF" });
    }
  },
};

module.exports = certificatesController;
