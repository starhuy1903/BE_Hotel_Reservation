const express = require('express')
const router = express.Router()
const roomController = require("../app/controller/roomController")
const verify = require("../middleware/verifyToken")
const {verifyRoomOwner, verifyBusiness} = require("../middleware/verifyUser")
const verifyRoles =  require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//CREATE
router.post("/create/:id", verifyRoles(ROLES_LIST.Business),verifyBusiness, roomController.createRoom)

//UPDATE
router.put("/update/:id", verifyRoles(ROLES_LIST.Business),verifyRoomOwner, roomController.updateRoom)

//FIND ROOM BY HOTEL
router.get("/hotel/:id", roomController.getRoomByHotel)

//FIND ROOM BY HOTEL
router.get("/hotel/:id", roomController.getRoomByHotel)

//FIND ROOM BY CITY
router.get("/filter", roomController.filterRoom)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.HotelOwner), verifyRoomOwner, roomController.deleteRoom)

//GET
router.get("/:id", roomController.getRoom)

//GETALL
router.get("/", roomController.getAllRoom)

module.exports = router
