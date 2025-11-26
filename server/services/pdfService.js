// server/services/pdfService.js
const fs = require("fs");
const path = require("path");

const templatePath = path.join(
  __dirname,
  "..",
  "..",
  "pdfTemplates",
  "certificado.html"
);

console.log("Ruta del template de certificado:", templatePath);

function formatDate(iso) {
  if (!iso) return "";
  return iso; // por ahora lo dejamos como viene (YYYY-MM-DD)
}

function renderCertificateHtml(cert) {
  console.log("Renderizando HTML para certificado ID:", cert.id);

  let html;
  try {
    html = fs.readFileSync(templatePath, "utf8");
  } catch (e) {
    console.error("Error leyendo template HTML:", e);
    return "<h1>Error cargando template de certificado</h1>";
  }

  console.log("Longitud del template original:", html.length);

  const serviciosTexto = (cert.servicios || []).join(" – ");

  const replacements = {
    "{{NUMERO}}": cert.numero ?? "",
    "{{CLIENTE_NOMBRE}}": cert.cliente_nombre ?? "",
    "{{CLIENTE_DIRECCION}}": cert.cliente_direccion ?? "",
    "{{FECHA_TRATAMIENTO}}": formatDate(cert.fecha_tratamiento),
    "{{FECHA_VENCIMIENTO}}": formatDate(cert.fecha_vencimiento),
    "{{SERVICIOS}}": serviciosTexto,
    "{{FIRMA_NOMBRE}}": cert.firma_nombre ?? "",
    "{{FIRMA_CARGO}}": cert.firma_cargo ?? "",
    "{{FECHA_EMISION}}": cert.created_at ?? "",
  };

  for (const [token, value] of Object.entries(replacements)) {
    const safe = String(value ?? "");
    html = html.replace(new RegExp(token, "g"), safe);
  }

  console.log("Longitud del HTML final:", html.length);

  return html;
}

module.exports = {
  renderCertificateHtml,
};