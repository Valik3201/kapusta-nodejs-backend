const express = require("express");
const router = express.Router();
const { authCheck } = require("../../middleware/authenticateToken.js");
const jwt = require("jsonwebtoken");
const {
  Transaction,
  incomeCategories,
  expenseCategories,
} = require("../../models/Transaction.js");
const { transactionSchema } = require("../../validation/validation.js");
const {
  transactionsByDate,
} = require("../../controllers/transactionsByDate.js");
const { User } = require("../../models/User.js");

router.post("/income", authCheck, async (req, res, next) => {
  try {
    const { _id, balance } = req.user;
    const { amount } = req.body;

    const { error } = transactionSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const type = "income";
    const newTransaction = { ...req.body, userId: _id, type };

    const result = await Transaction.create(newTransaction);

    const newBalance = balance + amount;

    await User.findByIdAndUpdate(_id, {
      $push: { transactions: result._id },
      balance: newBalance,
    });

    res.status(200).json({
      balance: newBalance,
      transaction: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/expense", authCheck, async (req, res, next) => {
  try {
    const { _id, balance } = req.user;
    const { amount } = req.body;

    const { error } = transactionSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const type = "expense";
    const newTransaction = { ...req.body, userId: _id, type };

    const result = await Transaction.create(newTransaction);

    const newBalance = balance - amount;

    await User.findByIdAndUpdate(_id, {
      $push: { transactions: result._id },
      balance: newBalance,
    });

    res.status(200).json({
      balance: newBalance,
      transaction: result,
    });
  } catch (error) {
    next(error);
  }
});

// Usunięcie transakcji
router.delete("/:transactionId", authCheck, async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { _id, balance } = req.user;

    const { type, amount } = await Transaction.findByIdAndDelete(transactionId);

    if (!amount) return res.status(404).json({ message: "Not Found" });

    const newBalance = type === "income" ? balance - amount : balance + amount;

    await User.findByIdAndUpdate(_id, {
      $pull: { transactions: transactionId },
      balance: newBalance,
    });

    res.json({
      message: "Transaction Deleted",
      newBalance: newBalance,
    });
  } catch (error) {
    next(error);
  }
});

// Otrzymanie zestawienia o miesiącach bieżącego roku w odniesieniu do dochodów
router.get("/income", authCheck, async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [, token] = authorization.split(" ");
    const tokenCheck = jwt.decode(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenCheck._id);

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const actualYear = new Date().getFullYear();
    const transactions = await Transaction.find({ userId: tokenCheck._id });

    const incomeTransactions = transactions.filter(({ date, type }) => {
      return date.getFullYear() === actualYear && type === "income";
    });

    const monthStats = {
      January: "N/A",
      February: "N/A",
      March: "N/A",
      April: "N/A",
      May: "N/A",
      June: "N/A",
      July: "N/A",
      August: "N/A",
      September: "N/A",
      October: "N/A",
      November: "N/A",
      December: "N/A",
    };

    const incomes = incomeTransactions.map(
      ({ description, amount, date, category, _id }) => {
        const month = date.toLocaleString("default", { month: "long" });
        if (monthStats[month] === "N/A") {
          monthStats[month] = amount;
        } else {
          monthStats[month] += amount;
        }
        return {
          description,
          amount,
          date: date.toISOString().split("T")[0],
          category,
          _id,
        };
      }
    );

    res.json({
      incomes,
      monthStats,
    });
  } catch (error) {
    next(error);
  }
});

// Otrzymanie zestawienia o miesiącach bieżącego roku w odniesieniu do wydatków
router.get("/expense", authCheck, async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [, token] = authorization.split(" ");
    const tokenCheck = jwt.decode(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenCheck._id);

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const actualYear = new Date().getFullYear();
    const transactions = await Transaction.find({ userId: tokenCheck._id });

    const expenseTransactions = transactions.filter(({ date, type }) => {
      return date.getFullYear() === actualYear && type === "expense";
    });

    const monthStats = {
      January: "N/A",
      February: "N/A",
      March: "N/A",
      April: "N/A",
      May: "N/A",
      June: "N/A",
      July: "N/A",
      August: "N/A",
      September: "N/A",
      October: "N/A",
      November: "N/A",
      December: "N/A",
    };

    const expenses = expenseTransactions.map(
      ({ description, amount, date, category, _id }) => {
        const month = date.toLocaleString("default", { month: "long" });
        if (monthStats[month] === "N/A") {
          monthStats[month] = amount;
        } else {
          monthStats[month] += amount;
        }
        return {
          description,
          amount,
          date: date.toISOString().split("T")[0],
          category,
          _id,
        };
      }
    );

    res.json({
      expenses,
      monthStats,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/income-categories", authCheck, async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization)
      return res.status(400).json({ message: "No token provided" });

    const [, token] = authorization.split(" ");
    const tokenCheck = jwt.decode(token, process.env.JWT_SECRET);
    if (!tokenCheck) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(tokenCheck._id);
    if (!user)
      return res
        .status(404)
        .json({ message: "Invalid user / Invalid session" });

    res.status(200).json(incomeCategories);
  } catch (error) {
    next(error);
  }
});

router.get("/expense-categories", authCheck, async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization)
      return res.status(400).json({ message: "No token provided" });

    const [, token] = authorization.split(" ");
    const tokenCheck = jwt.decode(token, process.env.JWT_SECRET);
    if (!tokenCheck) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(tokenCheck._id);
    if (!user)
      return res
        .status(404)
        .json({ message: "Invalid user / Invalid session" });

    res.status(200).json(expenseCategories);
  } catch (error) {
    next(error);
  }
});

// Otrzymywanie szczegółowych informacji o wydatkach i przychodach za określony miesiąc i rok
router.get("/period-data", authCheck, transactionsByDate);

module.exports = router;
