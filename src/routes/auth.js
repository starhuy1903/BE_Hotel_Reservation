const express = require("express");
const router = express.Router();
const authController = require("../app/controller/authController");
const verify = require("../middleware/verifyToken");

//REGISTER
router.post("/register", authController.register);

//LOGIN
router.post("/login", authController.login);

//RESET PASSWORD
router.post("/email-reset-password", authController.sendEmailResetPassword);

//CREATE NEW TOKEN
router.post(
  "/refresh-token",
  verify.verifyRefreshToken,
  authController.refreshToken
);

//LOGOUT
router.get("/logout", verify.verifyRefreshToken, authController.logout);

module.exports = router;
