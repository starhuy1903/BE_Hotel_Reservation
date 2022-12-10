const express = require('express')
const router = express.Router()
const statusEventController = require("../app/controller/statusEventController")
const verify = require("../middleware/verifyToken")

const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//UPDATE
router.put("/update/:id", verifyRoles(ROLES_LIST.Admin), statusEventController.updateReservationStatusEvent)

//CREATE
router.post("/create", verifyRoles(ROLES_LIST.Admin), statusEventController.createReservationStatusEvent)

//GET
router.get("/:id", verifyRoles(ROLES_LIST.Admin), statusEventController.getReservationStatusEvent)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.Admin), statusEventController.deleteReservationStatusEvent)

//GETALL
router.get("/", verifyRoles(ROLES_LIST.Admin), statusEventController.getAllReservationStatusEvent)


module.exports = router