const express = require('express')
const router = express.Router()
const authController = require("../app/controller/authController")
const verify = require("../middleware/verifyToken")

//REGISTER
router.post("/register", authController.register)

//LOGIN
router.post("/login", authController.login)

//RESET PASSWORD
router.post("/email-reset-password", authController.sendEmailResetPassword)

//CREATE NEW TOKEN
router.post("/refresh-token",verify.verifyRefeshToken, authController.refreshToken)

//LOGOUT
router.delete("/logout",verify.verifyRefeshToken, authController.logout)


router.get("/", authController.index)

module.exports = router
