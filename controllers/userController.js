const express = require("express"),
  router = express.Router(),
  userService = require("../services/userService");

router.route("/register").post(userService.register);

module.exports = router;
