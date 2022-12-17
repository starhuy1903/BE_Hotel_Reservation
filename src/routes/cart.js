const express = require('express')
const router = express.Router()
const cartController = require("../app/controller/cartController")
const verify = require("../middleware/verifyToken")


//CREATE
router.post("/create", cartController.createCart)
module.exports = router