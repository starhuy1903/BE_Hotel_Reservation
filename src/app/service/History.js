const Reservation = require("../models/reservation");
const mongoose = require("mongoose");
const getHistory = async (userId) => {
  return Reservation.aggregate([
    {
      $lookup: {
        from: "reservation_status_events",
        let: { reservationId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{ $eq: ["$$reservationId", "$reservationId"] }] },
            },
          },
          {
            $lookup: {
              from: "reservation_status_catalogs",
              let: { reservationCatalogId: "$reservationStatusCatalogId" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$$reservationCatalogId", "$_id"] }],
                    },
                  },
                },
              ],
              as: "reservationStatusCatalog",
            },
          },
          { $unwind: "$reservationStatusCatalog" },
        ],
        as: "reservationStatus",
      },
    },
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    //{$project: {statusName: "$reservationStatus.reservationStatusCatalog.statusName", userId: 1, startDate: 1, endDate: 1, discountPercent: 1, totalPrice: 1}}
  ]);
};

module.exports = { getHistory };
