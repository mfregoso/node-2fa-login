require("dotenv").load();

const DbConn = require("tedious").Connection,
  Request = require("tedious").Request,
  TYPES = require("tedious").TYPES;
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

// const sql = new DbConn(dbConfig);
// sql.on("connect", err =>
//   err ? console.log(err) : console.log("sql connected!")
// );

const generateSmsCode = () => {
  let code = Math.floor(Math.random() * 1000000);
  if (code < 100000) code += 100000;
  return code.toString();
};

const createAcctConfirmationCode = email => {
  const sql = new DbConn(dbConfig);
  sql.on("connect", err => {
    const request = new Request("RegisterCode_Insert", procErr => {
      if (procErr) {
        console.log(procErr);
      } else {
        console.log("create acct/phone code success... call twilio!");
      }
      sql.close();
    });

    let code = generateSmsCode();
    request.addParameter("Email", TYPES.VarChar, email);
    request.addParameter("Code", TYPES.VarChar, code);

    sql.callProcedure(request);
  });
};

const createLoginCode = email => {
  const sql = new DbConn(dbConfig);
  sql.on("connect", err => {
    const request = new Request("LoginCode_Insert", procErr => {
      if (procErr) {
        console.log(procErr);
      } else {
        console.log("Proceed to Login Second Factor");
      }
      sql.close();
    });

    let code = generateSmsCode();
    request.addParameter("Email", TYPES.VarChar, email);
    request.addParameter("Code", TYPES.VarChar, code);

    sql.callProcedure(request);
  });
};

const setAccountAsConfirmed = email => {
  const sql = new DbConn(dbConfig);
  sql.on("connect", err => {
    const request = new Request("Account_SetConfirmed", procErr => {
      if (procErr) {
        console.log(procErr);
      } else {
        console.log(email + " is now confirmed!");
      }
      sql.close();
    });

    request.addParameter("Email", TYPES.VarChar, email);

    sql.callProcedure(request);
  });
};

exports.register = (body, resp) => {
  // email, password, name, phone
  // redirect to page using SMS code to confirm registration
  let { email, name, password, phone } = body;

  const sql = new DbConn(dbConfig);
  sql.on("connect", err => {
    const request = new Request("Account_Insert", procErr => {
      if (procErr) {
        resp.send("Registration error!");
      } else {
        createAcctConfirmationCode(email);
        resp.send("Confirm your account!");
      }
      sql.close();
    });

    request.addParameter("Email", TYPES.VarChar, email);
    request.addParameter("Name", TYPES.VarChar, name);
    request.addParameter("Password", TYPES.VarChar, password);
    request.addParameter("Phone", TYPES.VarChar, phone);

    sql.callProcedure(request);
  });
};

exports.confirmPhone = (body, resp) => {
  // BONUS: enter code from phone, match against database to confirm account
  const { email, code } = body;
  const sql = new DbConn(dbConfig);
  sql.on("connect", err => {
    let codeMatchesDatabase = false;
    const request = new Request("RegisterCode_Verify", procErr => {
      if (procErr) {
        console.log(procErr);
      } else {
        if (codeMatchesDatabase) {
          setAccountAsConfirmed(email);
          resp.send("Account/phone is now confirmed!");
        } else {
          resp.send("Incorrect verification code or email");
        }
      }

      sql.close();
    });

    request.addParameter("Email", TYPES.VarChar, email);
    request.addParameter("Code", TYPES.VarChar, code);
    request.addOutputParameter("Verified", TYPES.Bit);
    request.on("returnValue", function(paramName, value) {
      codeMatchesDatabase = value;
    });

    sql.callProcedure(request);
  });
};

exports.login = (body, resp) => {
  // validate user + pw combo + confirmed account, then create code & send SMS
  // if NOT confirmed, send error
  const { email, password } = body;
  const sql = new DbConn(dbConfig);
  sql.on("connect", err => {
    let acctIsConfirmed = false;
    const request = new Request("Account_Login", procErr => {
      if (procErr) {
        console.log(procErr);
      } else {
        if (acctIsConfirmed) {
          createLoginCode(email);
          console.log("send login SMS with Twilio");
          resp.send("Proceed to login SMS challenge");
        } else if (acctIsConfirmed === null) {
          resp.send("Incorrect login information");
        } else {
          // maybe generate a new sms code?
          resp.send("Must verify phone/account before logging in");
        }
      }

      sql.close();
    });

    request.addParameter("Email", TYPES.VarChar, email);
    request.addParameter("Password", TYPES.VarChar, password);
    request.addOutputParameter("IsConfirmed", TYPES.Bit);
    request.on("returnValue", function(paramName, value) {
      acctIsConfirmed = value;
    });

    sql.callProcedure(request);
  });
};

exports.loginSmsChallenge = (body, resp) => {
  // user enters SMS code, checks against DB to complete signin
  const { email, code } = body;
  const sql = new DbConn(dbConfig);
  sql.on("connect", err => {
    let codeMatchesDatabase = false;
    const request = new Request("LoginCode_Verify", procErr => {
      if (procErr) {
        console.log(procErr);
      } else {
        if (codeMatchesDatabase) {
          resp.send("Fully logged in!");
        } else {
          resp.send("Incorrect verification code or email");
        }
      }

      sql.close();
    });

    request.addParameter("Email", TYPES.VarChar, email);
    request.addParameter("Code", TYPES.VarChar, code);
    request.addOutputParameter("Verified", TYPES.Bit);
    request.on("returnValue", function(paramName, value) {
      codeMatchesDatabase = value;
    });

    sql.callProcedure(request);
  });
};

module.exports = exports;
