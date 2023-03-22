const ReservationCatelog = require("../models/reservationCatalog");
const ReservationEvent = require("../models/reservationStatusEvent");

const updateSuccessReservation = async () => {
  const successReservationEvent = await ReservationCatelog.findOne({
    statusName: "success",
  });
  const endReservationEvent = await ReservationCatelog.findOne({
    statusName: "end",
  });
  const reservationEvent = await ReservationEvent.aggregate([
    {
      $lookup: {
        from: "reservations",
        let: {
          reservationId: "$reservationId",
          reservationStatusCatalogId: "$reservationStatusCatalogId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$reservationId", "$_id"] },
                  { $gte: [new Date(), "$endDate"] },
                  {
                    $eq: [
                      successReservationEvent._id,
                      "$$reservationStatusCatalogId",
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: "reservation",
      },
    },
    { $unwind: "$reservation" },
  ]);
  const updateReservationEvent = await Promise.all(
    reservationEvent.map((reservation) => {
      return ReservationEvent.findOneAndUpdate(
        { _id: reservation._id },
        { $set: { reservationStatusCatalogId: endReservationEvent._id } },
        { new: true }
      );
    })
  );
  return updateReservationEvent;
};

async function updatePendingReservation() {
  const pendingReservationEvent = await ReservationCatelog.findOne({
    statusName: "pending",
  });
  const cancelReservationEvent = await ReservationCatelog.findOne({
    statusName: "cancel",
  });
  const reservationEvent = await ReservationEvent.aggregate([
    {
      $lookup: {
        from: "reservations",
        let: {
          reservationId: "$reservationId",
          reservationStatusCatalogId: "$reservationStatusCatalogId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$reservationId", "$_id"] },
                  {
                    $gte: [
                      { $subtract: [new Date(), "$createdAt"] },
                      30 * 60 * 10 ** 3,
                    ],
                  },
                  {
                    $eq: [
                      pendingReservationEvent._id,
                      "$$reservationStatusCatalogId",
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: "reservation",
      },
    },
    { $unwind: "$reservation" },
    //{$set: {reservationStatusCatalogId: endReservationEvent._id}}
  ]);
  const updateReservationEvent = await Promise.all(
    reservationEvent.map((reservation) => {
      return ReservationEvent.findOneAndUpdate(
        { _id: reservation._id },
        { $set: { reservationStatusCatalogId: cancelReservationEvent._id } },
        { new: true }
      );
    })
  );
  return updateReservationEvent;
}

module.exports = { updateSuccessReservation, updatePendingReservation };
