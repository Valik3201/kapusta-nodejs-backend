const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models/User");
const { Transaction } = require("../models/Transaction");
const { nanoid } = require("nanoid");

const registration = async (body) => {
  try {
    const { email, password } = body;
    const user = new User({
      email,
      password: await bcrypt.hash(password, 10),
      token: nanoid(),
      balance: 0,
    });

    await user.save();

    const newUser = { email: user.email };
    return newUser;
  } catch (error) {
    console.log("Registration error:", error);
  }
};

const login = async (body) => {
  try {
    const { email, password } = body;

    const findUser = await User.findOne({ email });

    if (!findUser) {
      console.error("Login error: Email doesn't exist");
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    if (!isPasswordValid) {
      console.error("Login error: Password is wrong");
      return null;
    }

    const accessToken = jwt.sign(
      { _id: findUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { _id: findUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    await User.updateOne({ _id: findUser.id }, { token: refreshToken });

    const transactions = await Transaction.find({ userId: findUser._id });

    const formattedTransactions = transactions.map((transaction) => ({
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date.toISOString().split("T")[0],
      category: transaction.category,
      _id: transaction._id,
    }));

    const user = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      sid: findUser._id.toString(),
      userData: {
        email: findUser.email,
        balance: findUser.balance,
        id: findUser._id.toString(),
        transactions: formattedTransactions,
      },
    };
    return user;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

module.exports = {
  registration,
  login,
};
