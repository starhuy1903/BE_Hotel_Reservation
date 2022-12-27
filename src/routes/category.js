const express = require('express')
const router = express.Router()
const categoryController = require("../app/controller/categoryCotroller")
const verify = require("../middleware/verifyToken")

const verifyRoles =  require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")


//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.Admin), categoryController.deleteCategory)

//UPDATE
router.put("/:id",  verifyRoles(ROLES_LIST.Admin), categoryController.updateCategory)

//GET
router.get("/:id", verifyRoles(ROLES_LIST.Admin), categoryController.getCategory)

//GETALL
router.get("/", verifyRoles(ROLES_LIST.Admin), categoryController.getAllCategory)

//CREATE
router.post("/", verifyRoles(ROLES_LIST.Admin), categoryController.createCategory)

module.exports = router