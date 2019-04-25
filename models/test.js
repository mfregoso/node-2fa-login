const joi = require("joi");

const schema = {
  string_to_cut: joi
    .string()
    .required()
};

module.exports = joi.object().keys(schema).unknown(true);
