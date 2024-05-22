const express = require("express");
const router = express.Router();
const { authCheck } = require("../../middleware/authenticateToken.js");
const { User } = require("../../models/User.js");
const { registration, login } = require("../../controllers/auth.js");
const { authSchema } = require("../../validation/validation.js");

router.post("/register", async (req, res, next) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    const existingMail = await User.findOne({ email: req.body.email });
    if (existingMail) {
      return res.status(409).json({ message: "Provided email already exists" });
    }
    const user = await registration(req.body);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const result = await login(req.body);
    if (!result)
      return res.status(401).json({ message: "Email or password is wrong" });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", authCheck, async (req, res, next) => {
  try {
    if (!req.id) return res.status(400).json({ message: "No token provided" });

    const result = await User.updateOne({ _id: req.id }, { token: null });
    if (!result)
      return res
        .status(404)
        .json({ message: "Invalid user / Invalid session" });

    res.status(204).json({ message: "Successful operation" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
