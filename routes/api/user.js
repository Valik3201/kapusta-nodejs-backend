const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { authCheck } = require("../../middleware/authenticateToken.js");
const { User } = require("../../models/User.js");
const { balanceSchema } = require("../../validation/validation.js");

router.patch("/balance", authCheck, async (req, res, next) => {
  try {
    const { error } = balanceSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const newBalance = req.body.newBalance;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.balance === newBalance) {
      return res.status(200).json({ message: "Balance remains unchanged" });
    }

    await User.findByIdAndUpdate(userId, { balance: newBalance });

    return res.status(200).json({ newBalance });
  } catch (error) {
    next(error);
  }
});

router.get("/", authCheck, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("transactions");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      email: user.email,
      balance: user.balance,
      transactions: user.transactions.map((transaction) => ({
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        date: transaction.date.toISOString().split("T")[0],
        _id: transaction._id,
      })),
    };

    return res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
