const joi = require("joi");

const schema = {
  email: joi
    .string()
    .email({ minDomainAtoms: 2 })
    .required(),
  password: joi
    .string()
    .min(6)
    .required()
};

module.exports = joi.object().keys(schema);
