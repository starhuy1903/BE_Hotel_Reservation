const Hotel = require("../app/models/hotel");
const Room = require("../app/models/room");
const createError = require("../utils/error");
const ROLES_LIST = require("../config/allowedRoles");

const verifyBusiness = async (req, res, next) => {
  try {
    const userRoles = req.user.roles;
    if (userRoles.includes(ROLES_LIST.Admin)) {
      next();
    } else if (userRoles.includes(ROLES_LIST.Business)) {
      const hotel = await Hotel.findOne({ _id: req.params.id });
      if (!hotel) return next(createError(404, "Not Found"));
      if (hotel.owner_id.toString() !== req.user.id)
        next(createError(403, "You're not authorized"));
      next();
    }
  } catch (err) {
    next(err);
  }
};

const verifyRoomOwner = async (req, res, next) => {
  try {
    const userRoles = req.user.roles;
    if (userRoles.includes(ROLES_LIST.Admin)) {
      next();
    } else if (userRoles.includes(ROLES_LIST.Business)) {
      const room = await Room.findOne({ _id: req.params.id });
      if (!room) return next(createError(404, "Not Found"));
      const hotel = await Hotel.findOne({ _id: room.hotel_id });
      if (hotel.owner_id.toString() !== req.user.id)
        next(createError(403, "You're not authorized"));
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { verifyBusiness, verifyRoomOwner };
