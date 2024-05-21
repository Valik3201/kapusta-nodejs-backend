const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");

// Podłączenie bazy danych
const dbConnect = require("./config/db");
dbConnect();

// Inicjalizacja aplikacji Express
const app = express();

// Logger env
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));

// Konfiguracja CORS
app.use(cors());

// Parsowanie ciała żądania w formacie JSON
app.use(express.json());

// Podłączenie Routerów
const authRouter = require("./routes/api/auth");
const userRouter = require("./routes/api/user");
const transactionRouter = require("./routes/api/transaction");
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);

app.use(express.static(path.join(__dirname, "public")));

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
