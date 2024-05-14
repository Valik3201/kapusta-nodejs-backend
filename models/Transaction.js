const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    transactionType: {
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
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TransactionModel = model("transaction", transactionSchema);

module.exports = TransactionModel;
