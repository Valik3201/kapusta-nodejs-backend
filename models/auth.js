const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("./User");
const { nanoid } = require("nanoid");

const registration = async (body) => {
  try {
    const { email, password } = body;
    const user = new User({
      email,
      password: await bcrypt.hash(password, 10),
      token: nanoid(),
      balance: "0",
    });

    await user.save();

    const newUser = { email: user.email };
    return newUser;
  } catch (error) {
    console.log("error", error.message);
  }
};

const login = async (body) => {
  try {
    const { email, password } = body;
    const findUser = await User.findOne({ email });

    if (!findUser) return "Email doesn't exist";
    if (!(await bcrypt.compare(password, findUser.password)))
      return "Password is wrong";

    const token = jwt.sign(
      {
        _id: findUser._id,
      },
      process.env.JWT_SECRET
    );
    await User.updateOne({ _id: findUser.id }, { token });
    const user = {
      accessToken: findUser.token,
      refreshToken: token,
      userData: {
        email: findUser.email,
        balance: findUser.balance,
        id: findUser.id,
        transactions: "transactions list",
      },
    };
    return user;
  } catch (error) {
    console.log("error", error.message);
  }
};

const logout = async (userId) => {
  try {
    return (result = await User.updateOne({ _id: userId }, { token: null }));
  } catch (error) {
    console.log("error", error.message);
  }
};

module.exports = {
  registration,
  login,
  logout,
};
