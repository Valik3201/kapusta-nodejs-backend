const mongoose = require("mongoose");

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
      enum: [
        "transport",
        "products",
        "health",
        "alcohol",
        "entertainment",
        "housing",
        "technique",
        "communal, communications",
        "sports, hobbies",
        "education",
        "other",
        "wages",
        "income",
      ],
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

module.exports = { Transaction };
