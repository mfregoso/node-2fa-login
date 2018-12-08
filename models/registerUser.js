const joi = require("joi");

const schema = {
  name: joi
    .string()
    .min(3)
    .required(),
  email: joi
    .string()
    .email({ minDomainAtoms: 2 })
    .required(),
  password: joi
    .string()
    .min(6)
    .required(),
  phone: [
    joi
      .string()
      .regex(/^[0-9]{10,11}$/)
      .required(),
    joi.number().required()
  ]
};

module.exports = joi.object().keys(schema);
