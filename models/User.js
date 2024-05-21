const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      minlength: 3,
      maxlenght: 254,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      minlength: 8,
      maxlenght: 100,
      required: [true, "Password is required"],
    },
    token: {
      type: String,
      default: null,
    },
    balance: {
      type: Number,
    },
    transactions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "transaction",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const User = mongoose.model("Users", userSchema);

module.exports = {
  User,
};
