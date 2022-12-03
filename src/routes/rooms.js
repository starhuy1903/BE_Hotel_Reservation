const express = require('express')
const router = express.Router()
const roomController = require("../app/controller/roomController")
const verify = require("../middleware/verifyToken")

const verifyRoles =  require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//CREATE
router.post("/create/:HotelId", roomController.createRoom)

//UPDATE
router.put("/update/:id", verifyRoles(ROLES_LIST.Admin), roomController.updateRoom)

//DELETE
router.delete("/:id/:HotelId", verifyRoles(ROLES_LIST.Admin), roomController.deleteRoom)

//GET
router.get("/get/:id", roomController.getRoom)

//GETALL
router.get("/get", roomController.getAllRoom)


//FIND ROOM BY CITY
//router.get("/getRoomByCity", verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), roomController.getRoomByCity)
router.get("/filter", roomController.filterRoom)


router.get("/", roomController.index)

module.exports = router
