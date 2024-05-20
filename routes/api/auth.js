const express = require("express");
const router = express.Router();
const { authCheck } = require("../../middleware/authenticateToken.js");
const { User } = require("../../models/User.js");
const { registration, login, logout } = require("../../models/auth.js");
const { authSchema } = require("../../validation/validation.js");

// Rejestracja użytkownika
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

// Autoryzacja logowanie
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

// Wylogowanie
router.post("/logout", authCheck, async (req, res, next) => {
  try {
    const result = await logout(req.id);
    if (!result) return res.status(401).json({ message: "Not authorized" });

    res.status(204).json({ message: "No Content" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
