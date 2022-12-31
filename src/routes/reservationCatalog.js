const express = require("express");
const router = express.Router();
const reservationCatalogController = require("../app/controller/reservationCatalogController");

const verifyRoles = require("../middleware/verifyRoles");
const ROLES_LIST = require("../config/allowedRoles");

//DELETE
router.delete(
  "/:id",
  verifyRoles(ROLES_LIST.Admin),
  reservationCatalogController.deleteReservationCatalog
);

//UPDATE
router.put(
  "/:id",
  verifyRoles(ROLES_LIST.Admin),
  reservationCatalogController.updateReservationCatalog
);

//GET
router.get(
  "/:id",
  verifyRoles(ROLES_LIST.Admin),
  reservationCatalogController.getReservationCatalog
);

//GETALL
router.get(
  "/",
  verifyRoles(ROLES_LIST.Admin),
  reservationCatalogController.getAllReservationCatalog
);

//CREATE
router.post(
  "/",
  verifyRoles(ROLES_LIST.Admin),
  reservationCatalogController.createReservationCatalog
);

module.exports = router;
