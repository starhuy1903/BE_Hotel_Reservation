const express = require('express')
const router = express.Router()
const hotelController = require("../app/controller/hotelController")
const verify = require("../middleware/verifyToken")
const {verifyBusiness} = require("../middleware/verifyUser")
const verifyRoles =  require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/allowedRoles")
const fileUploader = require('../config/cloudinary')

//COUNT HOTEL
router.get("/count/ByCity", hotelController.countByCity)
router.get("/count/ByType", hotelController.countByType)

//GET HOTEL BY OWNER
router.get("/getByOwner", verifyRoles(ROLES_LIST.Business), hotelController.getHotelByBusiness)

//CREATE
router.post("/create", verifyRoles(ROLES_LIST.Business), fileUploader.array('file'), hotelController.createHotel)

//FILTER HOTEL
router.get("/filter", hotelController.filterHotel)

//UPDATE
router.put("/:id", verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Business), verifyBusiness, hotelController.updateHotel)

//DELETE
router.delete("/:id", verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Business),verifyBusiness, hotelController.deleteHotel)

//GET
router.get("/:id", hotelController.getHotel)

//GETALL
router.get("/", hotelController.getAllHotel)



module.exports = router