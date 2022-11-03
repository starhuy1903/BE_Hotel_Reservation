const express = require('express')
const router = express.Router()
const categoryController = require("../app/controller/categoryCotroller")
const verify = require("../utils/verifyToken")
//CREATE
router.post("/create/", categoryController.createCategory)

//UPDATE
router.put("/update/:id", verify.verifyToken, verify.verifyAdmin, categoryController.updateCategory)

//DELETE
router.delete("/:id/:HotelId", verify.verifyToken, verify.verifyAdmin, categoryController.deleteCategory)

//GET
router.get("/get/:id", categoryController.getCategory)

//GETALL
router.get("/get", categoryController.getAllCategory)

module.exports = router