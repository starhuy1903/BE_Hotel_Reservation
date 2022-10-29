const express = require('express')
const router = express.Router()
const userController = require("../app/controller/userController")
const verify = require("../utils/verifyToken")
router.get("/", userController.index)

/*router.get("/checkAuthentication", verify.verifyToken, (req, res, next)=>{
    res.send("Hello user, you're logged in")
})

router.get("/checkuser/:id", verify.verifyUser, (req, res, next)=>{
    res.send("Hello user, you're logged in and you can delete your account")
})*/

/*router.get("/checkAdmin/:id", verify.verifyAdmin, (req, res, next)=>{
    res.send("Hello admin, you're logged in and you can delete all accounts")
})*/

//UPDATE
router.put("/update/:id", verify.verifyToken, verify.verifyUser, userController.updateUser)

//DELETE
router.delete("/:id",verify.verifyToken,verify.verifyUser, userController.deleteUser)

//GET
router.get("/get/:id",verify.verifyToken, verify.verifyUser, userController.getUser)

//GETALL
router.get("/get",verify.verifyToken, verify.verifyAdmin, userController.getAllUser)

//Default
router.get("/", userController.index)

module.exports = router