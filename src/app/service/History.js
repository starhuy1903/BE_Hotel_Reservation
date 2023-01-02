const Reservation = require("../models/reservation");
const mongoose = require("mongoose");
const getHistory = async (userId) => {
  return Reservation.aggregate([
    {
      $lookup: {
        from: "reservationstatusevents",
        let: { reservationId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{ $eq: ["$$reservationId", "$reservationId"] }] },
            },
          },
          {
            $lookup: {
              from: "reservation status catelogs",
              let: { reservationCatelogId: "$reservationStatusCatalogId" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$$reservationCatelogId", "$_id"] }],
                    },
                  },
                },
              ],
              as: "reservationStatusCatelog",
            },
          },
          { $unwind: "$reservationStatusCatelog" },
        ],
        as: "reservationStatus",
      },
    },
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    //{$project: {statusName: "$reservationStatus.reservationStatusCatelog.statusName", userId: 1, startDate: 1, endDate: 1, discountPercent: 1, totalPrice: 1}}
  ]);
};

module.exports = { getHistory };
