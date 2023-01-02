const Reservation = require("../models/reservation");
const createError = require("../../utils/error");
const RoomServed = require("../models/servedRoom");
const ReservationEvent = require("../models/reservationStatusEvent");
const ReservationCatalog = require("../models/reservationCatalog");
const { findRoomServed } = require("../service/room");
const Room = require("../models/room");
class ReservationController {
  index(req, res) {
    res.send("Hello from reservation");
  }
  async createReservation(req, res, next) {
    const newReservation = new Reservation(req.body);
    try {
      const savedReservation = await newReservation.save();
      res.status(200).json(savedReservation);
    } catch (err) {
      next(err);
    }
  }
  async updateReservation(req, res, next) {
    try {
      const updatedReservation = await Reservation.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      if (!updatedReservation) return next(createError(404, "Not Found"));
      res.status(200).json(updatedReservation);
    } catch (err) {
      next(err);
    }
  }

  async deleteReservation(req, res, next) {
    try {
      const deletedReservation = await Reservation.findByIdAndDelete(
        req.params.id
      );
      if (!deletedReservation) return next(createError(404, "Not Found"));
      res.status(200).json("reservation has been deleted");
    } catch (err) {
      next(err);
    }
  }

  async getReservation(req, res, next) {
    try {
      const reservation = await Reservation.findById(req.params.id);
      if (!reservation) return next(createError(404, "Not Found"));
      res.status(200).json(reservation);
    } catch (err) {
      next(err);
    }
  }

  async getAllReservation(req, res, next) {
    try {
      const { maxPrice, minPrice, ...others } = req.query;
      const column = req.query.column || "_id";
      const sort = req.query.sort || 1;
      const page = req.query.page || 1;
      const reservations = await Reservation.find({
        ...others,
        totalPrice: { $gt: minPrice | 1, $lt: maxPrice || 99999999999 },
      }).sort({ [column]: sort });
      const availablePage = Math.ceil(
        reservations.length / process.env.PER_PAGE
      );
      if (page > availablePage && reservations.length !== 0) {
        return next(createError(404, "Not Found"));
      }
      res.status(200).json(reservations);
    } catch (err) {
      next(err);
    }
  }

  reservation = async (req, res, next) => {
    try {
      const { startDate, endDate, roomId } = req.body;
      if (!startDate || !endDate || !roomId)
        return next(createError(400, "Bad request"));
      const userId = req.user.id;
      const discountPercent = req.body.discountPercent || 0;

      const servedRooms = (await findRoomServed(startDate, endDate)).map(
        (roomServed) => roomServed.roomId.toString()
      );

      if (servedRooms.includes(roomId)) {
        return next(createError(400, "Room has been served"));
      }

      const room = await Room.findById(roomId);
      if (!room) return next(createError(404, "Room does not exist"));

      const totalPrice =
        ((new Date(endDate) - new Date(startDate)) / (10 ** 3 * 60 * 60 * 24)) *
        room.current_price;

      //CREATE NEW RESERVATION
      const reservation = new Reservation({
        startDate,
        endDate,
        userId,
        discountPercent,
        totalPrice,
      });
      await reservation.save();

      //create new served room
      const roomServed = new RoomServed({
        roomId,
        reservationId: reservation._id,
        price: totalPrice,
      });
      await roomServed.save();

      const reservationCatalog = await ReservationCatalog.findOne({
        statusName: "pending"
      });

      console.log()

      //CREATE NEW RESERVATION EVENT
      const reservationEvent = new ReservationEvent({
        reservationId: reservation._id,
        reservationStatusCatalogId: reservationCatalog._id,
        details: "pending",
      });
      await reservationEvent.save();
      res.status(200).json(reservation);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
}

module.exports = new ReservationController();
