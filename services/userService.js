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

const twilio = require("./twilioService");

const generateSmsCode = () => {
  let code = Math.floor(Math.random() * 1000000);
  if (code < 100000) code += 100000;
  return code.toString();
};

const sqlCreateAcctConfirmationCode = email => {
  const sql = new DbConn(dbConfig);
  sql.on("connect", err => {
    let code = generateSmsCode();

    const request = new Request("RegisterCode_Insert", procErr => {
      if (procErr) {
        console.log(procErr);
      } else {
        console.log("Own challenge token stored in SQL, verify: " + code);
      }
      sql.close();
    });

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
  // redirect to page using SMS code to confirm registration
  let { email, name, password, phone } = body;

  const sql = new DbConn(dbConfig);
  sql.on("connect", err => {
    const request = new Request("Account_Insert", procErr => {
      if (procErr) {
        resp.send("Registration error!");
      } else {
        sqlCreateAcctConfirmationCode(email);
        twilio.sendSmsCode(phone);
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

exports.verifyAccountTwilio = (body, resp) => {
  // enter code from phone, call twilio api to verify
  const { email, phone, code } = body;
  twilio.verifySmsCode(phone, code).then(data => {
    let confirmed = data.success || false;
    if (confirmed) {
      setAccountAsConfirmed(email);
      resp.send("Account/phone is now confirmed!");
    } else {
      resp.send("Incorrect verification code or email");
    }
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
    let phone;
    const request = new Request("Account_Login", procErr => {
      if (procErr) {
        console.log(procErr);
      } else {
        if (acctIsConfirmed) {
          createLoginCode(email);
          twilio.sendSmsCode(phone);
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
    request.addOutputParameter("Phone", TYPES.VarChar);
    request.on("returnValue", function(paramName, value) {
      phone = value;
    });

    sql.callProcedure(request);
  });
};

exports.verifyLoginTwilio = (body, resp) => {
  // enter code from phone, call twilio api to verify
  const { email, phone, code } = body;
  twilio.verifySmsCode(phone, code).then(data => {
    let confirmed = data.success | false;
    if (confirmed) {
      const jwt = require("jsonwebtoken");
      let token = jwt.sign({ data: email }, "ssssssecret", { expiresIn: "1d" });
      resp.send(token);
    } else {
      resp.send("Incorrect verification credentials");
    }
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
          const jwt = require("jsonwebtoken");
          let token = jwt.sign({ data: email }, "ssssssecret", {
            expiresIn: "1d"
          });
          resp.send("Fully logged in " + token);
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
