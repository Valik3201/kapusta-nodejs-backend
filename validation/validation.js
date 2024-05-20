const Joi = require("joi");

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
  newBalance: Joi.string().required(),
});

const transactionSchema = Joi.object({
  date: Joi.date().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  category: Joi.string(),
  amount: Joi.number().required(),
});

module.exports = {
  authSchema,
  balanceSchema,
  transactionSchema,
};
