const express = require('express')
const router = express.Router()
const roomServedController = require("../app/controller/roomServedController")

const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//UPDATE
router.put("/:id", verifyRoles(ROLES_LIST.Admin), roomServedController.updateRoomServed)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.Admin), roomServedController.deleteRoomServed)

//GET
router.get("/:id", roomServedController.getRoomServed)

//GETALL
router.get("/", roomServedController.getAllRoomServed)

//CREATE
router.post("/", roomServedController.createRoomServed)


module.exports = router