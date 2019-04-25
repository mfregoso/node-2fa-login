const joi = require("joi");

module.exports = (req, resp) => {
  const schema = require("../models/test.js");
  const modelError = joi.validate(req.body, schema).error;
  const response = {return_string: ""};
  
  if (!modelError) {
    const {string_to_cut} = req.body;
    const cutStringArr = string_to_cut.split("").filter((st, i) => (i + 1) % 3 === 0);
    response.return_string = cutStringArr.join("");
  }

  resp.send(response);
};