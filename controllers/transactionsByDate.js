const { Transaction } = require("../models/Transaction.js");
const { User } = require("../models/User.js");

const transactionsByDate = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { date } = req.query;

    if (!date || !/^\d{4}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY-MM." });
    }

    const [year, month] = date.split("-").map(Number);
    const result = await User.findById(_id);

    if (!result) {
      return res.status(404).json({ message: "User not Found" });
    }

    const transactions = await Transaction.find({ userId: _id });

    const transactionsByMonthAndYear = transactions.filter(({ date }) => {
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });

    const groupTransactions = (transactions) => {
      return transactions.reduce((acc, transaction) => {
        const { category, description, amount } = transaction;
        if (!acc[category]) {
          acc[category] = { total: 0 };
        }
        acc[category].total += amount;
        if (!acc[category][description]) {
          acc[category][description] = 0;
        }
        acc[category][description] += amount;
        return acc;
      }, {});
    };

    const incomeTransactions = transactionsByMonthAndYear.filter(
      ({ type }) => type === "income"
    );
    const expenseTransactions = transactionsByMonthAndYear.filter(
      ({ type }) => type === "expense"
    );

    const totalIncome = incomeTransactions.reduce(
      (prevValue, { amount }) => prevValue + amount,
      0
    );
    const totalExpense = expenseTransactions.reduce(
      (prevValue, { amount }) => prevValue + amount,
      0
    );

    const incomesData = groupTransactions(incomeTransactions);
    const expensesData = groupTransactions(expenseTransactions);

    const transactionObj = {
      incomes: {
        total: totalIncome,
        incomesData,
      },
      expenses: {
        total: totalExpense,
        expensesData,
      },
    };

    res.json(transactionObj);
  } catch (error) {
    next(error);
  }
};

module.exports = { transactionsByDate };
