const express = require("express");
const router = express.Router();
const roomController = require("../app/controller/roomController");
const verify = require("../middleware/verifyToken");
const { verifyRoomOwner, verifyBusiness } = require("../middleware/verifyUser");
const verifyRoles = require("../middleware/verifyRoles");
const ROLES_LIST = require("../config/allowedRoles");
const fileUploader = require("../config/cloudinary");

//FIND ROOM BY HOTEL
router.get("/hotel/:id", roomController.getRoomByHotel);

//FIND ROOM BY CITY
router.get("/filter", roomController.filterRoom);

//GET
router.get("/:id", roomController.getRoomById);

//UPDATE
router.put(
  "/:id",
  verify.verifyToken,
  verifyRoles(ROLES_LIST.Business),
  verifyRoomOwner,
  roomController.updateRoom
);

//DELETE
router.delete(
  "/:id",
  verify.verifyToken,
  verifyRoles(ROLES_LIST.Business),
  verifyRoomOwner,
  roomController.deleteRoom
);

//CREATE
router.post(
  "/:id",
  verify.verifyToken,
  verifyRoles(ROLES_LIST.Business),
  verifyBusiness,
  fileUploader.array("file"),
  roomController.createRoom
);

//GETALL
router.get("/", roomController.getAllAvailableRoom);

module.exports = router;
