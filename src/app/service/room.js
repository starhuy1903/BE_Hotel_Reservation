const RoomServed = require("../models/servedRoom");

const findRoomServed = (startDate, endDate) => {
  const servedRoom = RoomServed.aggregate([
    {
      $lookup: {
        from: "reservations",
        let: { roomServed_reservationId: "$reservationId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$roomServed_reservationId", "$_id"] },
                  {
                    $and: [
                      { $lt: [new Date(startDate) || 0, "$endDate"] },
                      { $gt: [new Date(endDate) || 0, "$startDate"] },
                    ],
                  },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "reservation_status_events",
              let: { reservationId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$$reservationId", "$reservationId"] }],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "reservation_status_catalogs",
                    let: {
                      reservationCatelogId: "$reservationStatusCatalogId",
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [
                              { $eq: ["$$reservationCatelogId", "$_id"] },
                              {
                                $or: [
                                  { $eq: ["$statusName", "pending"] },
                                  { $eq: ["$statusName", "success"] },
                                ],
                              },
                            ],
                          },
                        },
                      },
                    ],
                    as: "reservation_status_catalog",
                  },
                },
                { $unwind: "$reservation_status_catalog" },
              ],
              as: "reservation_status",
            },
          },
          { $unwind: "$reservation_status" },
        ],
        as: "reservation",
      },
    },
    { $unwind: "$reservation" },
    { $project: { roomId: 1, _id: 0 } },
  ]).exec();

  return servedRoom;
};

module.exports = { findRoomServed };
