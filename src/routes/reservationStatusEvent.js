const express = require('express')
const router = express.Router()
const statusEventController = require("../app/controller/statusEventController")
const verify = require("../middleware/verifyToken")

const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//CREATE
router.post("/create/", statusEventController.createReservationStatusEvent)

//UPDATE
router.put("/update/:id", verifyRoles(ROLES_LIST.Admin), statusEventController.updateReservationStatusEvent)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.Admin), statusEventController.deleteReservationStatusEvent)

//GET
router.get("/get/:id", statusEventController.getReservationStatusEvent)

//GETALL
router.get("/get", statusEventController.getAllReservationStatusEvent)

//SUCESS
router.get("/getSuccess", statusEventController.updateSuccessReservation)
router.get("/getPending", statusEventController.updatePendingReservation)

router.get("/", statusEventController.index)

module.exports = router