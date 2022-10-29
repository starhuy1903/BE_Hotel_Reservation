const express = require('express')
const router = express.Router()
const roomController = require("../app/controller/roomController")
const verify = require("../utils/verifyToken")

//CREATE
router.post("/create/:HotelId", roomController.createRoom)

//UPDATE
router.put("/update/:id", verify.verifyToken, verify.verifyAdmin, roomController.updateRoom)

//DELETE
router.delete("/:id/:HotelId", verify.verifyToken, verify.verifyAdmin, roomController.deleteRoom)

//GET
router.get("/get/:id", roomController.getRoom)

//GETALL
router.get("/get", roomController.getAllRoom)

router.get("/", roomController.index)

module.exports = router
