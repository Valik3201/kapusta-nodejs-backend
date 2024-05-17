const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { authCheck } = require("../../middleware/authenticateToken.js");
const { User } = require("../../models/User.js");
const { balanceSchema } = require("../../middleware/validation.js");

router.patch("/balance", authCheck, async (req, res, next) => {
  try {
    const { error } = balanceSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const newBalance = req.body.newBalance;
    const { authorization } = req.headers;
    const [, token] = authorization.split(" ");
    const tokenCheck = jwt.decode(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenCheck._id);

    const userBalance = user.balance;
    if (userBalance === newBalance) {
      return res.status(409).json({ message: "Balance was not changed" });
    }

    const updateBalance = await User.findOneAndUpdate(
      { _id: tokenCheck._id },
      { balance: newBalance }
    );
    const balanceChange = console.log(
      "balance:",
      userBalance,
      ">>>",
      newBalance
    );
    return res
      .status(201)
      .json({ message: "Balance was changed successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/", authCheck, async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [, token] = authorization.split(" ");
    const tokenCheck = jwt.decode(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenCheck._id);

    if (!user) {
      return res.status(409).json({ message: "Please login first" });
    }
    const userData = {
      email: user.email,
      balance: user.balance,
      transactions: user.transactions,
    };
    return res.status(201).json(userData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
