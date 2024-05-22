const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");

const dbConnect = require("./config/db");
dbConnect();

const app = express();

// Logger env
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));

app.use(cors());

app.use(express.json());

const authRouter = require("./routes/api/auth");
const userRouter = require("./routes/api/user");
const transactionRouter = require("./routes/api/transaction");
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
