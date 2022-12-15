const express = require('express')
const router = express.Router()
const userController = require("../app/controller/userController")
const verify = require("../middleware/verifyToken")

const verifyRoles =  require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")
const fileUploader = require('../config/cloudinary')
//RESET PASSWORD
router.get("/reset-password/:id/:key", userController.resetPassword)

//VERIFY EMAIL
router.get("/verify/:id/:key", userController.verifyEmailUser)


//CREATE
router.post("/create", verifyRoles(ROLES_LIST.Admin), fileUploader.single('file'), userController.createUser)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin), userController.deleteUser)

//UPDATE
router.put("/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin), userController.updateUser)

//GET
router.get("/:id", verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin), userController.getUser)

//GETALL
router.get("/", verifyRoles(ROLES_LIST.Admin), userController.getAllUser)



module.exports = router