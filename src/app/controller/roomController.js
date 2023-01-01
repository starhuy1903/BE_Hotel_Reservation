const Room = require("../models/room");
const Hotel = require("../models/hotel");
const RoomType = require("../models/roomType");
const { findRoomServed } = require("../service/room");
const { pagination } = require("../service/site");
const createError = require("../../utils/error");
const mongoose = require("mongoose");

class RoomController {
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

  getRoomById = async (req, res, next) => {
    try {
      const room = await Room.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "type rooms",
            let: { typeRoom: "$room_type_id" },
            pipeline: [
              {
                $match: { $expr: { $and: [{ $eq: ["$$typeRoom", "$_id"] }] } },
              },
            ],
            as: "roomType",
          },
        },
        {
          $lookup: {
            from: "hotels",
            let: { hotelId: "$hotel_id" },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ["$$hotelId", "$_id"] }] } } },
            ],
            as: "hotel",
          },
        },
        { $unwind: "$hotel" },
      ]);
      if (room.length === 0) return next(createError(404, "Not Found"));

      res.status(200).json(room[0]);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  getRoomByHotel = async (req, res, next) => {
    try {
      const page = req.query.page || 1;
      const foundRooms = await Room.aggregate([
        { $match: { hotel_id: mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "type rooms",
            let: { typeRoom: "$room_type_id" },
            pipeline: [
              {
                $match: { $expr: { $and: [{ $eq: ["$$typeRoom", "$_id"] }] } },
              },
            ],
            as: "roomType",
          },
        },
        {
          $lookup: {
            from: "hotels",
            let: { hotelId: "$hotel_id" },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ["$$hotelId", "$_id"] }] } } },
            ],
            as: "hotel",
          },
        },
        { $unwind: "$hotel" },
      ]);
      if (foundRooms.length === 0) return next(createError(404, "Not Found"));

      //PAGINATION
      const availablePage = Math.ceil(foundRooms.length / process.env.PER_PAGE);
      if (page > availablePage && foundRooms.length !== 0) {
        return next(createError(404, "Not Found"));
      }
      const rooms = pagination(foundRooms, page);
      res.status(200).json({ rooms, availablePage });
    } catch (err) {
      next(err);
    }
  };

  getAllAvailableRoom = async (req, res, next) => {
    try {
      const { maxPrice, minPrice } = req.query;
      const column = req.query.column || "room_name";
      const sort = req.query.sort || 1;
      const page = req.query.page || 1;
      let roomType = req.query.room_type;
      if (!roomType) {
        roomType = (await RoomType.find({})).map((room_type) => {
          return room_type._id;
        });
      } else {
        roomType = (await RoomType.find({ typeName: roomType })).map(
          (room_type) => room_type._id
        );
      }
      const others = {};
      if (req.query.floor) {
        others.floor = parseInt(req.query.floor);
      }
      if (req.query.maxPeople) {
        others.maxPeople = parseInt(req.query.maxPeople);
      }
      let rooms = await Room.aggregate([
        {
          $lookup: {
            from: "hotels",
            let: { hotelId: "$hotel_id" },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ["$$hotelId", "$_id"] }] } } },
            ],
            as: "hotel",
          },
        },
        {
          $lookup: {
            from: "type rooms",
            let: { typeRoom: "$room_type_id" },
            pipeline: [
              {
                $match: { $expr: { $and: [{ $eq: ["$$typeRoom", "$_id"] }] } },
              },
            ],
            as: "roomType",
          },
        },
        { $unwind: "$hotel" },
        {
          $match: {
            $expr: {
              $and: [
                { $gt: ["$current_price", parseInt(minPrice) || 1] },
                {
                  $lt: [
                    "$current_price",
                    parseInt(maxPrice) || 9999999999999999,
                  ],
                },
                { $in: ["$room_type_id", roomType] },
              ],
            },
          },
        },
        { $match: { ...others } },
        { $sort: { [column]: parseInt(sort) } },
      ]);
      const availablePage = Math.ceil(rooms.length / process.env.PER_PAGE);
      if (page > availablePage && rooms.length !== 0) {
        return next(createError(404, "Not Found"));
      }
      rooms = rooms.map((room) => {
        const { hotel_id, ...others } = room;
        return { ...others };
      });

      const roomRes = pagination(rooms, page);

      res.status(200).json({ rooms: roomRes, availablePage });
    } catch (err) {
      next(err);
    }
  };

  filterRoom = async (req, res, next) => {
    try {
      const { minPrice, maxPrice, city, startDate, endDate } = req.query;
      const column = req.query.column || "room_name";
      const sort = req.query.sort || 1;
      const page = req.query.page || 1;

      let roomType = req.query.room_type;
      if (!roomType) {
        roomType = (await RoomType.find({})).map((room_type) => {
          return room_type._id;
        });
      } else {
        roomType = (await RoomType.find({ typeName: roomType })).map(
          (room_type) => room_type._id
        );
      }
      //FIND ROOMSERVED
      const servedRoom = await findRoomServed(startDate, endDate);
      //PARSE ROOMSERVED ID
      const servedRoomIds = servedRoom.map((roomServed) => {
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
      const others = {};
      if (req.query.floor) {
        others.floor = parseInt(req.query.floor);
      }
      if (req.query.maxPeople) {
        others.maxPeople = parseInt(req.query.maxPeople);
      }
      const availableRooms = (
        await Room.aggregate([
          {
            $lookup: {
              from: "type rooms",
              let: { typeRoom: "$room_type_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $and: [{ $eq: ["$$typeRoom", "$_id"] }] },
                  },
                },
              ],
              as: "roomType",
            },
          },
          {
            $lookup: {
              from: "hotels",
              let: { hotelId: "$hotel_id" },
              pipeline: [
                {
                  $match: { $expr: { $and: [{ $eq: ["$$hotelId", "$_id"] }] } },
                },
              ],
              as: "hotel",
            },
          },
          { $unwind: "$hotel" },
          {
            $match: {
              $expr: {
                $and: [
                  { $gt: ["$current_price", parseInt(minPrice) || 1] },
                  {
                    $lt: [
                      "$current_price",
                      parseInt(maxPrice) || 9999999999999999,
                    ],
                  },
                  { $in: ["$room_type_id", roomType] },
                ],
              },
            },
          },
          { $match: { ...others } },
          { $sort: { [column]: parseInt(sort) } },
        ])
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
  };
}

module.exports = new RoomController();
