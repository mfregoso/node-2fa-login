require("dotenv").load();

const DbConnection = require("tedious").Connection;
const dbConfig = {
  server: "localhost",
  userName: process.env.DB_USER,
  password: process.env.DB_PW,
  options: {
    encrypt: false,
    instanceName: "SQLEXPRESS",
    database: "People"
  },
  debug: true
};

const conn = new DbConnection(dbConfig);

conn.on("connect", err => console.log(err));



exports.register = body => {
  // email, password, name, phone
  // redirect to page using SMS code to confirm registration
  let { email, name } = body;
  return `Hi ${name}, please check your email at ${email}`;
};

exports.confirmPhone = (req, resp) => {
  // BONUS: enter code from phone, match against database to confirm account
};

exports.login = (req, resp) => {
  // validate user + pw combo + confirmed account, then create code & send SMS
  // if NOT confirmed, send error
};

exports.confirmLogin = (req, resp) => {
  // user enters SMS code, checks against DB to complete signin
};

module.exports = exports;
