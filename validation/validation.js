const Joi = require("joi");
const {
  incomeCategories,
  expenseCategories,
} = require("../models/Transaction.js");

const authSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  password: Joi.string().required(),
  token: Joi.string(),
});

const balanceSchema = Joi.object({
  newBalance: Joi.number().required(),
});

const transactionSchema = Joi.object({
  date: Joi.date().required(),
  description: Joi.string().required(),
  category: Joi.string()
    .valid(...incomeCategories, ...expenseCategories)
    .required(),
  amount: Joi.number().required(),
});

module.exports = {
  authSchema,
  balanceSchema,
  transactionSchema,
};
