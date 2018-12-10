const axios = require("axios");

exports.sendSmsCode = async phoneNum =>
  axios({
    method: "post",
    url: "https://api.authy.com/protected/json/phones/verification/start",
    data: {
      api_key: process.env.TWILIO,
      via: "sms",
      phone_number: phoneNum,
      country_code: 1,
      code_length: 5
    },
    auth: {
      username: process.env.TW_SID,
      password: process.env.TW_KEY
    }
  })
    .then(resp => {
      console.log(resp.data);
      return resp.data;
    })
    .catch(err => {
      console.log(err.response.data.errors);
      return false;
    });

exports.verifySmsCode = async (phoneNum, code) =>
  axios({
    method: "get",
    url: `https://api.authy.com/protected/json/phones/verification/check?phone_number=${phoneNum}&country_code=1&verification_code=${code}`,
    headers: {
      "x-authy-api-key": process.env.TWILIO
    }
  })
    .then(resp => {
      console.log(resp.data);
      return resp.data;
    })
    .catch(err => {
      console.log(err.response.data.errors);
      return false;
    });

module.exports = exports;
