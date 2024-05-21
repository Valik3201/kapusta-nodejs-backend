const mongoose = require("mongoose");

const incomeCategories = ["Salary", "Additional Income"];

const expenseCategories = [
  "Products",
  "Alcohol",
  "Entertainment",
  "Health",
  "Transport",
  "Housing",
  "Technology",
  "Utilities and Communication",
  "Sports and Hobbies",
  "Education",
  "Other",
];

const transactionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      enum: [...incomeCategories, ...expenseCategories],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = { Transaction, incomeCategories, expenseCategories };
