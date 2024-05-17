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

module.exports = {
  authSchema,
  balanceSchema,
};
