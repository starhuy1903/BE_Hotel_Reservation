const express = require('express')
const router = express.Router()
const reservationController = require("../app/controller/reservationController")
const verify = require("../middleware/verifyToken")
const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//CREATE
router.post("/create", verifyRoles(ROLES_LIST.Admin), reservationController.createReservation)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.Admin), reservationController.deleteReservation)

//UPDATE
router.put("/:id", verifyRoles(ROLES_LIST.Admin), reservationController.updateReservation)

//GET
router.get("/:id", reservationController.getReservation)

//GETALL
router.get("/", reservationController.getAllReservation)

//RESERVATION
router.post("/", reservationController.reservation)

module.exports = router