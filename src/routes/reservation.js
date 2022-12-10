const express = require('express')
const router = express.Router()
const reservationController = require("../app/controller/reservationController")
const verify = require("../middleware/verifyToken")
const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//UPDATE
router.put("/update/:id", verifyRoles(ROLES_LIST.Admin), reservationController.updateReservation)

//CREATE
router.post("/create", verifyRoles(ROLES_LIST.Admin), reservationController.createReservation)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.Admin), reservationController.deleteReservation)

//GET
router.get("/:id", reservationController.getReservation)

//GETALL
router.get("/", reservationController.getAllReservation)

//RESERVATION
router.post("/", reservationController.reservation)

module.exports = router