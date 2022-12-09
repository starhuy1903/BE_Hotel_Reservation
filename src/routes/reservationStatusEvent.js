const express = require('express')
const router = express.Router()
const reservationStatusEventController = require("../app/controller/reservationStatusEventController")
const verify = require("../middleware/verifyToken")

const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//CREATE
router.post("/create/:ReservationStatusEventId", reservationStatusEventController.createReservationStatusId)

//UPDATE
router.put("/update/:ReservationStatusEventId", verifyRoles(ROLES_LIST.Admin), reservationStatusEventController.updateReservation)

//DELETE
router.delete("/:id/:ReservationStatusEventId", verifyRoles(ROLES_LIST.Admin), reservationStatusEventController.deleteReservation)

//GET
router.get("/get/:ReservationStatusEventId", reservationStatusEventController.getReservation)

//GETALL
router.get("/get", reservationStatusEventController.getAllReservationStatusEvent)


router.get("/", reservationStatusEventController.index)

module.exports = router