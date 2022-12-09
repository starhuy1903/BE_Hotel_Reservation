const express = require('express')
const router = express.Router()
const roomTypeController = require("../app/controller/roomTypeController")
const verify = require("../middleware/verifyToken")

const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//CREATE
router.post("/create/", roomTypeController.createRoomType)

//UPDATE
router.put("/update/:id", verifyRoles(ROLES_LIST.Admin), roomTypeController.updateRoomType)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.Admin), roomTypeController.deleteRoomType)

//GET
router.get("/get/:id", roomTypeController.getRoomType)

//GETALL
router.get("/get", roomTypeController.getAllRoomType)


router.get("/", roomTypeController.index)

module.exports = router