const userService = require("../services/userService");
const joi = require("joi");
const validateModel = (input, schema) => joi.validate(input, schema).error;

exports.register = (req, resp) => {
  const schema = require("../models/registerUser");
  let modelError = validateModel(req.body, schema);
  // email, password, name, phone
  // redirect to page using SMS code to confirm registration
  if (!modelError) {
    //resp.send(userService.register(req.body));
    userService.register(req.body, resp);
  } else {
    resp.send(modelError);
  }
};

exports.verifySms = (req, resp) => {
  const schema = require("../models/smsCode");
  let modelError = validateModel(req.body, schema);
  // BONUS: enter code from phone, match against database to confirm account
  if (!modelError) {
    userService.verifySms(req.body, resp);
  } else {
    resp.send(modelError);
  }
};

exports.confirmPhone = (req, resp) => {
  const schema = require("../models/smsCode");
  let modelError = validateModel(req.body, schema);
  // BONUS: enter code from phone, match against database to confirm account
  if (!modelError) {
    userService.confirmPhone(req.body, resp);
  } else {
    resp.send(modelError);
  }
};

exports.login = (req, resp) => {
  const schema = require("../models/login");
  let modelError = validateModel(req.body, schema);
  // validate user + pw combo + confirmed account, then create code & send SMS
  // if NOT confirmed, send error
  if (!modelError) {
    userService.login(req.body, resp);
  } else {
    resp.send(modelError);
  }
};

exports.loginCode = (req, resp) => {
  const schema = require("../models/smsCode");
  let modelError = validateModel(req.body, schema);
  // user enters SMS code, checks against DB to complete signin
  if (!modelError) {
    userService.loginSmsChallenge(req.body, resp);
  } else {
    resp.send(modelError);
  }
};

module.exports = exports;
