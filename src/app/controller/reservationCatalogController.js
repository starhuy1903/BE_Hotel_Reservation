const ReservationCatalog = require("../models/reservationCatalog");

class ReservationCatalogController {
  index(req, res) {
    res.send("Hello from room");
  }
  async createReservationCatalog(req, res, next) {
    const newReservationCatalog = new ReservationCatalog(req.body);
    try {
      const savedReservationCatalog = await newReservationCatalog.save();
      res.status(200).json(savedReservationCatalog);
    } catch (err) {
      next(err);
    }
  }
  async updateReservationCatalog(req, res, next) {
    try {
      const updatedReservationCatalog =
        await ReservationCatalog.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
      res.status(200).json(updatedReservationCatalog);
    } catch (err) {
      next(err);
    }
  }

  async deleteReservationCatalog(req, res, next) {
    try {
      await ReservationCatalog.findByIdAndDelete(req.params.id);
      res.status(200).json("ReservationCatalog has been deleted");
    } catch (err) {
      next(err);
    }
  }

  async getReservationCatalog(req, res, next) {
    try {
      const reservationCatalog = await reservationCatalog.findById(
        req.params.id
      );
      res.status(200).json(reservationCatalog);
    } catch (err) {
      next(err);
    }
  }

  async getAllReservationCatalog(req, res, next) {
    try {
      const sort = req.query.sort || 1;
      const availableReservationCatalogs = await ReservationCatalog.find({
        ...req.query,
      }).sort({ statusName: sort });

      res.status(200).json(availableReservationCatalogs);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ReservationCatalogController();
