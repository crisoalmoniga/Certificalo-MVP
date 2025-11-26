// public/js/api.js

async function createCertificate(data) {
  const response = await fetch("/api/certificates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al crear certificado");
  }

  return response.json();
}
