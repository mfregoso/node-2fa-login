const joi = require("joi");

const schema = {
  email: joi
    .string()
    .email({ minDomainAtoms: 2 })
    .required(),
  code: joi
    .string()
    .regex(/^[0-9]{4,6}$/)
    .required(),
  phone: joi.string().regex(/^[0-9]{10,11}$/)
};

module.exports = joi.object().keys(schema);
