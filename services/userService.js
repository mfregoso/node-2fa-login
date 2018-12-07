exports.register = (req, resp) => {
  let email = req.query.email;
  let password = req.query.password;
  if (email && password) {
    resp.send("got it!");
  } else {
    resp.send("error!");
  }
};

module.exports = exports;
