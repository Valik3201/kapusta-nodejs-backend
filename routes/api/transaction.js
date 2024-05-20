const express = require("express");
const router = express.Router();
const { authCheck } = require("../../middleware/authenticateToken.js");
const jwt = require("jsonwebtoken");
const { Transaction } = require("../../models/Transaction.js");
const { transactionSchema } = require("../../validation/validation.js");
const {
  transactionsByDate,
} = require("../../controllers/transactionsByDate.js");
const { User } = require("../../models/User.js");

// Dodanie dochodu
router.post("/income", authCheck, async (req, res, next) => {
  try {
    const { _id, balance } = req.user;
    const { type, amount } = req.body;

    const { error } = transactionSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const result = await Transaction.create({ ...req.body, userId: _id });

    const newBalance = type === "income" ? balance + amount : balance - amount;

    await User.findByIdAndUpdate(_id, { balance: newBalance });

    res.status(200).json({
      balance: newBalance,
      transaction: result,
    });
  } catch (error) {
    next(error);
  }
});

// Dodanie wydatku
router.post("/expense", authCheck, async (req, res, next) => {
  try {
    const { _id, balance } = req.user;
    const { type, amount } = req.body;

    const { error } = transactionSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const result = await Transaction.create({ ...req.body, userId: _id });

    const newBalance = type === "expense" ? balance - amount : balance + amount;

    await User.findByIdAndUpdate(_id, { balance: newBalance });

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

    await User.findByIdAndUpdate({ _id }, { balance: newBalance });

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

    const actualYear = new Date().getYear();

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const transactions = await Transaction.find({ userId: tokenCheck._id });

    const transactionsByMonthAndYear = transactions.filter(({ date }) => {
      return date.getYear() === actualYear;
    });

    const incomeTransactions = transactionsByMonthAndYear.filter(
      ({ type }) => type === "income"
    );
    const totalIncome = incomeTransactions.reduce(
      (prevValue, { amount }) => prevValue + amount,
      0
    );
    const transactionObj = {
      incomeTransactions,
      totalIncome,
    };
    res.json(transactionObj);
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

    const actualYear = new Date().getYear();

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const transactions = await Transaction.find({ userId: tokenCheck._id });

    const transactionsByMonthAndYear = transactions.filter(({ date }) => {
      return date.getYear() === actualYear;
    });

    const expenseTransactions = transactionsByMonthAndYear.filter(
      ({ type }) => type === "expense"
    );

    const totalExpense = expenseTransactions.reduce(
      (prevValue, { amount }) => prevValue + amount,
      0
    );
    const transactionObj = {
      expenseTransactions,
      totalExpense,
    };
    res.json(transactionObj);
  } catch (error) {
    next(error);
  }
});

// Otrzymywanie szczegółowych informacji o wydatkach i przychodach za określony miesiąc i rok
router.get("/period-data/:year/:month", authCheck, transactionsByDate);

module.exports = router;
