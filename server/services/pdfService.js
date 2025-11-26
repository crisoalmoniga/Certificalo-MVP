// server/services/pdfService.js
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const templatePath = path.join(
  __dirname,
  "..",
  "..",
  "pdfTemplates",
  "certificado.html"
);

// Carpeta donde vamos a guardar los PDFs generados
const pdfDir = path.join(__dirname, "..", "..", "pdfs");

// Nos aseguramos de que exista la carpeta pdfs
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
  console.log("Carpeta de PDFs creada en:", pdfDir);
}

console.log("Ruta del template de certificado:", templatePath);

function formatDate(iso) {
  if (!iso) return "";
  return iso; // de momento lo dejamos YYYY-MM-DD
}

// --- Render de HTML a partir del certificado -------------------------------
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

// --- Generar PDF con Puppeteer --------------------------------------------
async function generateCertificatePdf(cert) {
  const html = renderCertificateHtml(cert);

  // nombre del archivo (usamos id si existe, si no numero)
  const baseName = cert.id ? `certificado-${cert.id}` : `certificado-num-${cert.numero}`;
  const pdfPath = path.join(pdfDir, `${baseName}.pdf`);

  console.log("Generando PDF en:", pdfPath);

  const browser = await puppeteer.launch({
    headless: "new", // para Puppeteer moderno
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
    });

    console.log("PDF generado correctamente:", pdfPath);
    return { pdfPath };
  } finally {
    await browser.close();
  }
}

module.exports = {
  renderCertificateHtml,
  generateCertificatePdf,
};
