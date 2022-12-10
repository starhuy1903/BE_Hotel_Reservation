const express = require('express')
const router = express.Router()
const roomTypeController = require("../app/controller/roomTypeController")
const verify = require("../middleware/verifyToken")

const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//UPDATE
router.put("/update/:id", verifyRoles(ROLES_LIST.Admin), roomTypeController.updateRoomType)

//CREATE
router.post("/create", verifyRoles(ROLES_LIST.Admin), roomTypeController.createRoomType)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.Admin), roomTypeController.deleteRoomType)

//GET
router.get("/:id", roomTypeController.getRoomType)

//GETALL
router.get("/", roomTypeController.getAllRoomType)

module.exports = router