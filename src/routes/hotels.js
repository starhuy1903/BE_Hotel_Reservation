const express = require('express')
const router = express.Router()
const hotelController = require("../app/controller/hotelController")
const verify = require("../middleware/verifyToken")
const {verifyBusiness} = require("../middleware/verifyUser")
const verifyRoles =  require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")

//COUNT HOTEL
router.get("/count/ByCity", hotelController.countByCity)
router.get("/count/ByType", hotelController.countByType)

//UPDATE
router.put("/update/:id", verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Business), verifyBusiness, hotelController.updateHotel)

//GET HOTEL BY OWNER
router.get("/getByOwner", verifyRoles(ROLES_LIST.Business), hotelController.getHotelB.Business)

//CREATE
router.post("/create", verifyRoles(ROLES_LIST.Business), hotelController.createHotel)

//FILTER HOTEL
router.get("/filter", hotelController.filterHotel)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Business),verifyBusiness, hotelController.deleteHotel)

//GET
router.get("/:id", hotelController.getHotel)

//GETALL
router.get("/", hotelController.getAllHotel)



module.exports = router