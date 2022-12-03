const express = require('express')
const router = express.Router()
const reservationController = require("../app/controller/reservationController")
const verify = require("../middleware/verifyToken")

const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//CREATE
router.post("/create/", reservationController.createReservation)

//UPDATE
router.put("/update/:id", verifyRoles(ROLES_LIST.Admin), reservationController.updateReservation)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.Admin), reservationController.deleteReservation)

//GET
router.get("/get/:id", reservationController.getReservation)

//GETALL
router.get("/get", reservationController.getAllReservation)


router.get("/", reservationController.index)

module.exports = router