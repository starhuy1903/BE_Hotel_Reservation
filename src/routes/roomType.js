const express = require("express");
const router = express.Router();
const roomTypeController = require("../app/controller/roomTypeController");
const verifyRoles = require("../middleware/verifyRoles");
const ROLES_LIST = require("../config/allowedRoles");

//UPDATE
router.put(
  "/:id",
  verifyRoles(ROLES_LIST.Admin),
  roomTypeController.updateRoomType
);

//DELETE
router.delete(
  "/:id",
  verifyRoles(ROLES_LIST.Admin),
  roomTypeController.deleteRoomType
);

//GET
router.get("/:id", roomTypeController.getRoomType);

//GETALL
router.get("/", roomTypeController.getAllRoomType);

//CREATE
router.post(
  "/",
  verifyRoles(ROLES_LIST.Admin),
  roomTypeController.createRoomType
);

module.exports = router;
