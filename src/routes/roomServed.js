const express = require('express')
const router = express.Router()
const roomServedController = require("../app/controller/roomServedController")
const verify = require("../middleware/verifyToken")

const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//UPDATE
router.put("/update/:id", verifyRoles(ROLES_LIST.Admin), roomServedController.updateRoomServed)

//CREATE
router.post("/create", roomServedController.createRoomServed)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.Admin), roomServedController.deleteRoomServed)

//GET
router.get("/:id", roomServedController.getRoomServed)

//GETALL
router.get("/", roomServedController.getAllRoomServed)


module.exports = router