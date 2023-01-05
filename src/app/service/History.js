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
    { $unwind: "$reservationStatus" },
    {
      $lookup: {
        from: "served_rooms",
        let: { reservationId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{ $eq: ["$$reservationId", "$reservationId"] }] },
            },
          },
          {
            $lookup: {
              from: "rooms",
              let: { roomId: "$roomId" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$$roomId", "$_id"] }],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "hotels",
                    let: { hotelId: "$hotel_id" },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [{ $eq: ["$$hotelId", "$_id"] }],
                          },
                        },
                      },
                    ],
                    as: "hotel",
                  },
                },
                { $unwind: "$hotel" },
              ],
              as: "room",
            },
          },
          { $unwind: "$room" },
        ],
        as: "servedRoom",
      },
    },
    { $unwind: "$servedRoom" },
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {$project: {statusName: "$reservationStatus.reservationStatusCatalog.statusName", startDate: 1, endDate: 1, discountPercent: 1, totalPrice: 1, roomName: "$servedRoom.room.room_name", hotelName: "$servedRoom.room.hotel.name"}}
  ]);
};

module.exports = { getHistory };
