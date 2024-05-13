const express = require("express");
const cors = require("cors");

// Podłączenie bazy danych
const dbConnect = require("./config/db");
dbConnect();

// Inicjalizacja aplikacji Express
const app = express();

// Konfiguracja CORS
app.use(cors());

// Parsowanie ciała żądania w formacie JSON
app.use(express.json());

// Obsługa nieznanych żądań
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Obsługa błędów
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
