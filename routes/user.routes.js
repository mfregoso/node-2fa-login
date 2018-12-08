const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/register/confirm", userController.confirmPhone)
router.post("/login", userController.login);
router.post("/login/confirm", userController.loginCode)

module.exports = router;
