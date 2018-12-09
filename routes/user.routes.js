const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/register/verify", userController.verifySms); // via twilio
router.post("/register/confirm", userController.confirmPhone); // checks against sql (self-generated codes)
router.post("/login", userController.login);
router.post("/login/verify", userController.verifySms); // twilio tokens
router.post("/login/confirm", userController.loginCode); // checks against sql (self-generated codes)

module.exports = router;
