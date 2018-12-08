const joi = require("joi");

const schema = {
  email: joi
    .string()
    .email({ minDomainAtoms: 2 })
    .required(),
  code: joi
    .string()
    .regex(/^[0-9]{6,6}$/)
    .required()
};

module.exports = joi.object().keys(schema);
