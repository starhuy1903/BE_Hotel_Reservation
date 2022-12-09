const express = require('express')
const router = express.Router()
const roomServedController = require("../app/controller/roomServedController")
const verify = require("../middleware/verifyToken")

const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//CREATE
router.post("/create/", roomServedController.createRoomServed)

//UPDATE
router.put("/update/:id", verifyRoles(ROLES_LIST.Admin), roomServedController.updateRoomServed)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.Admin), roomServedController.deleteRoomServed)

//GET
router.get("/get/:id", roomServedController.getRoomServed)

//GETALL
router.get("/get", roomServedController.getAllRoomServed)


router.get("/", roomServedController.index)

module.exports = router