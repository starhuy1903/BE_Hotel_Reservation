const express = require('express')
const router = express.Router()
const categoryController = require("../app/controller/categoryCotroller")
const verify = require("../middleware/verifyToken")

const verifyRoles =  require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//CREATE
router.post("/create/", categoryController.createCategory)

//UPDATE
router.put("/update/:id",  verifyRoles(ROLES_LIST.Admin), categoryController.updateCategory)

//DELETE
router.delete("/:id/:HotelId", verifyRoles(ROLES_LIST.Admin), categoryController.deleteCategory)

//GET
router.get("/get/:id", categoryController.getCategory)

//GETALL
router.get("/get", categoryController.getAllCategory)

module.exports = router