// public/js/form.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("certificate-form");
  const resultBox = document.getElementById("result");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Armamos el objeto con los datos del form
    const formData = new FormData(form);

    const serviciosSeleccionados = formData.getAll("servicios"); // checkboxes

    const data = {
      cliente_nombre: formData.get("cliente_nombre"),
      cliente_direccion: formData.get("cliente_direccion"),
      fecha_tratamiento: formData.get("fecha_tratamiento"),
      fecha_vencimiento: formData.get("fecha_vencimiento"),
      servicios: serviciosSeleccionados,
      firma_nombre: formData.get("firma_nombre"),
      firma_cargo: formData.get("firma_cargo"),
    };

    try {
      const respuesta = await createCertificate(data);
      console.log("Respuesta API:", respuesta);
      resultBox.textContent = JSON.stringify(respuesta, null, 2);
      alert("Certificado enviado al servidor (todavía sin guardar en DB).");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Hubo un error al enviar el certificado.");
    }
  });
});
