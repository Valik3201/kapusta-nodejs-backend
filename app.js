const express = require("express");
const cors = require("cors");
const logger = require("morgan");

// Podłączenie bazy danych
const dbConnect = require("./config/db");
dbConnect();

// Inicjalizacja aplikacji Express
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
// Konfiguracja CORS
app.use(cors());

// Parsowanie ciała żądania w formacie JSON
app.use(express.json());

// Podłączenie Routerów
const authRouter = require("./routes/api/auth");
app.use("/api/auth", authRouter);

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
