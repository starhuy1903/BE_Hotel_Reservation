const ReservationCatelog = require("../models/reservationCatelog");
class ReservationCatelogController {
  index(req, res) {
    res.send("Hello from room");
  }
  async createReservationCatelog(req, res, next) {
    const newReservationCatelog = new ReservationCatelog(req.body);
    try {
      const savedReservationCatelog = await newReservationCatelog.save();
      res.status(200).json(savedReservationCatelog);
    } catch (err) {
      next(err);
    }
  }
  async updateReservationCatelog(req, res, next) {
    try {
      const updatedReservationCatelog =
        await ReservationCatelog.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
      res.status(200).json(updatedReservationCatelog);
    } catch (err) {
      next(err);
    }
  }

  async deleteReservationCatelog(req, res, next) {
    try {
      await ReservationCatelog.findByIdAndDelete(req.params.id);
      res.status(200).json("ReservationCatelog has been deleted");
    } catch (err) {
      next(err);
    }
  }

  async getReservationCatelog(req, res, next) {
    try {
      const ReservationCatelog = await ReservationCatelog.findById(
        req.params.id
      );
      res.status(200).json(ReservationCatelog);
    } catch (err) {
      next(err);
    }
  }

  async getAllReservationCatelog(req, res, next) {
    try {
      const sort = req.query.sort || 1;
      const availableReservationCatelogs = await ReservationCatelog.find({
        ...req.query,
      }).sort({ statusName: sort });

      res.status(200).json(availableReservationCatelogs);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ReservationCatelogController();
