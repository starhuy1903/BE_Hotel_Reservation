const express = require('express')
const router = express.Router()
const reservationCatelogController = require("../app/controller/reservationCatelogController")
const verify = require("../middleware/verifyToken")

const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//CREATE
router.post("/create/", reservationCatelogController.createReservationCatelog)

//UPDATE
router.put("/update/:id", verifyRoles(ROLES_LIST.Admin), reservationCatelogController.updateReservationCatelog)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.Admin), reservationCatelogController.deleteReservationCatelog)

//GET
router.get("/get/:id", reservationCatelogController.getReservationCatelog)

//GETALL
router.get("/get", reservationCatelogController.getAllReservationCatelog)


router.get("/", reservationCatelogController.index)

module.exports = router