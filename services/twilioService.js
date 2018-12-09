const Client = require("authy-client").Client;
const authy = new Client({ key: process.env.TWILIO });
const enums = require("authy-client").enums;

exports.sendSmsCode = phoneNum => {
  authy.startPhoneVerification(
    {
      countryCode: "US",
      locale: "en",
      phone: phoneNum,
      via: enums.verificationVia.SMS
    },
    function(err, resp) {
      if (err) throw err;
      console.log("Phone information", resp);
    }
  );
};

exports.verifySmsCode = (phoneNum, code) => {
  authy.verifyPhone(
    { countryCode: "US", phone: phoneNum, token: code },
    function(err) {
      if (err) {
        console.log(err);
        return false;
      } else return true;
    }
  );
};

module.exports = exports;
