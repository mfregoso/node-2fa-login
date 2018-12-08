const userService = require("../services/userService");
const joi = require("joi");
const validateModel = (input, schema) => !joi.validate(input, schema).error;

exports.register = (req, resp) => {
  const schema = require("../models/registerUser");
  let validModel = validateModel(req.body, schema);
  // email, password, name, phone
  // redirect to page using SMS code to confirm registration
  if (validModel) {
    resp.send(userService.register(req.body));
  } else {
    resp.send("error!");
  }
};

exports.confirmRegistration = (req, resp) => {
  // BONUS: enter code from phone, match against database to confirm account
};

exports.loginOne = (req, resp) => {
  // validate user + pw combo + confirmed account, then create code & send SMS
  // if NOT confirmed, send error
};

exports.loginTwo = (req, resp) => {
  // user enters SMS code, checks against DB to complete signin
};

module.exports = exports;
