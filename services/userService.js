exports.register = body => {
  // email, password, name, phone
  // redirect to page using SMS code to confirm registration
  let { email, name } = body;
  return `Hi ${name}, please check your email at ${email}`;
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
