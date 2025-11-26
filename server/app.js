const express = require("express");
const path = require("path");
const cors = require("cors");
const certificatesRoutes = require("./routes/certificates");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use(express.static(path.join(__dirname, "..", "public")));

// API
app.use("/api/certificates", certificatesRoutes);

// Home -> index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
