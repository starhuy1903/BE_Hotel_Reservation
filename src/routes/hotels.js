const express = require("express");
const router = express.Router();
const hotelController = require("../app/controller/hotelController");
const roomController = require("../app/controller/roomController");
const verify = require("../middleware/verifyToken");
const { verifyBusiness } = require("../middleware/verifyUser");
const verifyRoles = require("../middleware/verifyRoles");
const ROLES_LIST = require("../config/allowedRoles");
const fileUploader = require("../config/cloudinary");


//GET
router.get("/:hotelId/:id", roomController.getRoomById);


//COUNT HOTEL
router.get("/count/ByCity", hotelController.countByCity);
router.get("/count/ByType", hotelController.countByType);

//GET HOTEL BY OWNER
router.get(
  "/getByOwner",
  verify.verifyToken,
  verifyRoles(ROLES_LIST.Business),
  hotelController.getHotelByBusiness
);


//FILTER HOTEL
router.get("/filter", hotelController.filterHotel);

//UPDATE
router.put(
  "/:id",
  verify.verifyToken,
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Business),
  verifyBusiness,
  hotelController.updateHotel
);

//DELETE
router.delete(
  "/:id",
  verify.verifyToken,
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Business),
  verifyBusiness,
  hotelController.deleteHotel
);

//GET
router.get("/:id", hotelController.getHotel);

//GETALL
router.get("/", hotelController.getAllHotel);

//CREATE
router.post(
  "/",
  verify.verifyToken,
  verifyRoles(ROLES_LIST.Business),
  fileUploader.array("file"),
  hotelController.createHotel
);

//FIND ALL ROOM BY HOTEL
router.get("/:id/room", roomController.getRoomByHotel);

module.exports = router;
