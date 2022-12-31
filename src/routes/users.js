const express = require("express");
const router = express.Router();
const userController = require("../app/controller/userController");

const verifyRoles = require("../middleware/verifyRoles");
const ROLES_LIST = require("../config/allowedRoles");
const fileUploader = require("../config/cloudinary");
//RESET PASSWORD
router.post("/reset-password/:id/:key", userController.resetPassword);

//VERIFY EMAIL
router.get("/verify/:id/:key", userController.verifyEmailUser);

//UPDATE BY ADMIN
router.put(
  "/admin/:id",
  verifyRoles(ROLES_LIST.Admin),
  userController.updateUserByAdmin
);

//GET USER PROFILE
router.get("/me", userController.getUserProfile);

//GET USER HISTORY
router.get("/history", userController.getUserHistory)

//DELETE
router.delete(
  "/:id",
  verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin),
  userController.deleteUser
);

//UPDATE
router.put("/:id", verifyRoles(ROLES_LIST.User), userController.updateUser);

//GET
router.get(
  "/:id",
  verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin),
  userController.getUser
);

//GETALL
router.get("/", verifyRoles(ROLES_LIST.Admin), userController.getAllUser);

//CREATE
router.post(
  "/",
  verifyRoles(ROLES_LIST.Admin),
  fileUploader.single("file"),
  userController.createUser
);

module.exports = router;
