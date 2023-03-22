const RoomServed = require("../models/servedRoom");

class RoomController {
  index(req, res) {
    res.send("Hello from room");
  }
  async createRoomServed(req, res, next) {
    const newRoomServed = new RoomServed(req.body);
    try {
      const savedRoomServed = await newRoomServed.save();
      res.status(200).json(savedRoomServed);
    } catch (err) {
      next(err);
    }
  }
  async updateRoomServed(req, res, next) {
    try {
      const updatedRoomServed = await RoomServed.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedRoomServed);
    } catch (err) {
      next(err);
    }
  }

  async deleteRoomServed(req, res, next) {
    try {
      const deletedRoomServed = await RoomServed.findByIdAndDelete(
        req.params.id
      );
      res.status(200).json("RoomServed has been deleted");
    } catch (err) {
      next(err);
    }
  }

  async getRoomServed(req, res, next) {
    try {
      const servedRoom = await servedRoom.findById(req.params.id);
      res.status(200).json(servedRoom);
    } catch (err) {
      next(err);
    }
  }

  async getAllRoomServed(req, res, next) {
    try {
      const servedRooms = await RoomServed.find();
      res.status(200).json(servedRooms);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RoomController();
