const express = require('express')
const router = express.Router()
const authController = require("../app/controller/authController")
const verify = require("../utils/verifyToken")
router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/reset-email", authController.resetPassword)
router.post("/refresh-token",verify.verifyRefeshToken,authController.refreshToken)
router.get("/", authController.index)

module.exports = router
