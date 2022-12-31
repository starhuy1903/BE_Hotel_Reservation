const Room = require("../models/room");
const Hotel = require("../models/hotel");
const RoomType = require("../models/roomType");
const { findRoomServed } = require("../service/room");
const { pagination } = require("../service/site");
const createError = require("../../utils/error");

class RoomController {
  index(req, res) {
    res.send("Hello from room");
  }
  createRoom = async (req, res, next) => {
    const newRoom = new Room({ ...req.body, hotel_id: req.params.id });
    try {
      const savedRoom = await newRoom.save();
      res.status(200).json(savedRoom);
    } catch (err) {
      next(err);
    }
  };
  updateRoom = async (req, res, next) => {
    try {
      const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      if (!updatedRoom) return next(createError(404, "Not Found"));
      res.status(200).json(updatedRoom);
    } catch (err) {
      next(err);
    }
  };

  deleteRoom = async (req, res, next) => {
    try {
      const deletedRoom = await Room.findByIdAndDelete(req.params.id);
      if (!deletedRoom) return next(createError(404, "Not Found"));
      res.status(200).json("room has been deleted");
    } catch (err) {
      next(err);
    }
  };

  getRoom = async (req, res, next) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) return next(createError(404, "Not Found"));
      res.status(200).json(room);
    } catch (err) {
      next(err);
    }
  };
  getRoomByHotel = async (req, res, next) => {
    try {
      const room = await Room.find({ hotel_id: req.params.id });
      res.status(200).json(room);
    } catch (err) {
      next(err);
    }
  };
  getAllRoom = async (req, res, next) => {
    try {
      const { maxPrice, minPrice, ...others } = req.query;
      const column = req.query.column || "room_name";
      const sort = req.query.sort || 1;
      const page = req.query.page || 1;
      let roomType = req.query.room_type;
      // write code to join 2 table Room and Hotel

      const room = await Room.createView("room", "hotel", [
        {
          $lookup: {
            from: "room",
            localField: "hotel_id",
            foreignField: "hotel_id",
            as: "hotel_ref",
          },
        },
      ]);

      console.log(room);

      if (!roomType) {
        roomType = (await RoomType.find({})).map((room_type) => {
          return room_type._id.toString();
        });
      } else {
        roomType = (await RoomType.find({ typeName: roomType })).map(
          (room_type) => room_type._id.toString()
        );
      }
      const rooms = await Room.find({
        ...others,
        current_price: { $gt: minPrice || 1, $lt: maxPrice || 99999999999 },
        room_type_id: { $in: roomType },
      }).sort({ [column]: sort });
      const availablePage = Math.ceil(rooms.length / process.env.PER_PAGE);
      if (page > availablePage && rooms.length !== 0) {
        return next(createError(404, "Not Found"));
      }
      const Rooms = pagination(rooms, page);
      res.status(200).json({ rooms: Rooms, availablePage: availablePage });
    } catch (err) {
      next(err);
    }
  };

  getAllAvailableRoom = async (req, res, next) => {
    try {
      const column = req.query.column || "room_name";
      const sort = req.query.sort || 1;
      const page = req.query.page || 1;
      let roomType = req.query.room_type;
      if (!roomType) {
        roomType = (await RoomType.find({})).map((roomType) => {
          return roomType._id.toString();
        });
      } else {
        roomType = (await RoomType.find({ typeName: roomType })).map(
          (roomType) => roomType._id.toString()
        );
      }
      const rooms = await Room.find({
        ...others,
        current_price: { $gt: minPrice || 1, $lt: maxPrice || 99999999999 },
        room_type_id: { $in: roomType },
      }).sort({ [column]: sort });
      const availablePage = Math.ceil(rooms.length / process.env.PER_PAGE);
      if (page > availablePage && rooms.length !== 0) {
        return next(createError(404, "Not Found"));
      }
      const Rooms = pagination(rooms, page);
      res.status(200).json({ rooms: Rooms, availablePage: availablePage });
    } catch (err) {
      next(err);
    }
  };

  async filterRoom(req, res, next) {
    try {
      const { minPrice, maxPrice, city, startDate, endDate, ...others } =
        req.query;
      const column = req.query.column || "room_name";
      const sort = req.query.sort || 1;
      const page = req.query.page || 1;
      let roomType = req.query.room_type;
      if (!roomType) {
        roomType = (await RoomType.find({})).map((room_type) => {
          return room_type._id.toString();
        });
      } else {
        roomType = (await RoomType.find({ typeName: roomType })).map(
          (room_type) => room_type._id.toString()
        );
      }

      const servedRooms = await findRoomServed(startDate, endDate);

      const servedRoomIds = servedRooms.map((roomServed) => {
        return roomServed.roomId.toString();
      });
      //FIND HOTEL MATCH CITY
      const hotelsId = (
        await Hotel.find({
          city: city,
        })
      ).map((hotel) => {
        return hotel._id.toString();
      });
      //FIND AVAILABLE ROOM
      const availableRooms = (
        await Room.find({
          ...others,
          current_price: { $gt: minPrice | 1, $lt: maxPrice || 99999999999 },
          room_type_id: { $in: roomType },
        }).sort({ [column]: sort })
      ).filter((room) => {
        return (
          !servedRoomIds.includes(room._id.toString()) &&
          hotelsId.includes(room.hotel_id.toString())
        );
      });

      //PAGINATION
      const availablePage = Math.ceil(
        availableRooms.length / process.env.PER_PAGE
      );
      if (page > availablePage && availableRooms.length !== 0) {
        return next(createError(404, "Not Found"));
      }
      const rooms = pagination(availableRooms, page);
      res.status(200).json({ rooms: rooms, availablePage: availablePage });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RoomController();
