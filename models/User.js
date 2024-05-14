const { Schema, model } = require("mongoose");

const userSchema = new Schema(
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
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    sid: {
      type: String,
      default: null,
    },
    balance: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const User = model("user", userSchema);

module.exports = User;
