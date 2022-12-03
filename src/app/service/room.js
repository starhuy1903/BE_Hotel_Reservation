const RoomServed = require("../models/roomServed")

const findRoomServed = (startDate, endDate) =>{
    const roomServeds = RoomServed.aggregate([
        {   
            $lookup: {
                from: "reservations",
                let: { roomServed_reservationId: "$reservationId"},
                pipeline: [
                    {$match: {$expr: {$and: [{ $eq: [ "$$roomServed_reservationId", "$_id" ]},{$and: [{ $lt: [ new Date(startDate) || 0, "$endDate" ]},{ $gt: [ new Date(endDate) || 0, "$startDate"]}]}]}},},
                    {   $lookup: {
                            from: "reservationstatusevents",
                            let: { reservationId: "$_id"},
                            pipeline: [
                                {$match: {$expr: {$and: [{ $eq: [ "$$reservationId", "$reservationId" ]},]}}},
                                { $lookup: {
                                    from: "reservation status catelogs",
                                    let: { reservationCatelogId: "$reservationStatusCatalogId"},
                                    pipeline: [
                                        {$match: {$expr: {$and: [{ $eq: [ "$$reservationCatelogId", "$_id" ]},{$or: [{ $eq: [ "$statusName", "pending" ]},{ $eq: [ "$statusName", "success"]}]}]}}},
                                    ],
                                    as: "reservation status catelog"   
                                }},
                                {$unwind: "$reservation status catelog"}
                            ],
                            as: "reservation status" 
                        }
                    },
                    {$unwind: "$reservation status"}
                ],
                as: "reservation"
             }
        },
        {$unwind: "$reservation"},
        {$project: {roomId: 1, _id: 0}}
    ]).exec()

    return roomServeds
}

module.exports = {findRoomServed}
