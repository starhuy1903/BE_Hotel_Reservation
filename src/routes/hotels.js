const express = require('express')
const router = express.Router()
const hotelController = require("../app/controller/hotelController")
const verify = require("../utils/verifyToken")
//CREATE
router.post("/create", hotelController.createHotel)

//UPDATE
router.put("/update/:id", verify.verifyToken, verify.verifyAdmin, hotelController.updateHotel)

//DELETE
router.delete("/:id", verify.verifyToken, verify.verifyAdmin, hotelController.deleteHotel)

//GET
router.get("/get/:id", hotelController.getHotel)

//GETALL
router.get("/get", hotelController.getAllHotel)

router.get("/countByCity", hotelController.countByCity)
router.get("/countByType", hotelController.countByType)

//Default
router.get("/", hotelController.index)

module.exports = router