const userService = require("../services/userService");

exports.register = (req, resp) => {
  // email, password, name, phone
  // redirect to page using SMS code to confirm registration
  let email = req.query.email;
  let password = req.query.password;
  if (email && password) {
    resp.send("got it!");
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
