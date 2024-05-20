const { Transaction } = require("../models/Transaction.js");
const { User } = require("../models/User.js");

const transactionsByDate = async (req, res, next) => {
  try {
    const { _id } = req.user;
    let { year, month } = req.params;
    const result = await User.findById(_id);

    if (!result) {
      return res.status(404).json({ message: "User not Found" });
    }

    const transactions = await Transaction.find({ userId: _id });

    const transactionsByMonthAndYear = transactions.filter(({ date }) => {
      return (
        date.getFullYear().toString() === year &&
        date.getMonth().toString() === `${month - 1}`
      );
    });

    const incomeTransactions = transactionsByMonthAndYear.filter(
      ({ type }) => type === "income"
    );
    const expenseTransactions = transactionsByMonthAndYear.filter(
      ({ type }) => type === "expense"
    );
    const totalExpense = expenseTransactions.reduce(
      (prevValue, { amount }) => prevValue + amount,
      0
    );
    const totalIncome = incomeTransactions.reduce(
      (prevValue, { amount }) => prevValue + amount,
      0
    );
    const transactionObj = {
      incomeTransactions,
      expenseTransactions,
      totalExpense,
      totalIncome,
    };
    res.json(transactionObj);
  } catch (error) {
    next(error);
  }
};

module.exports = { transactionsByDate };
