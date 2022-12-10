//const { createError } = require('../../utils/error')

const Hotel = require('../models/hotel')
const ReservationEvent = require('../models/reservationStatusEvent')
const createError = require("../../utils/error")

class reservationController {
    index(req, res) {
        res.send("Hello from room")
    }
    async createReservationStatusEvent(req, res, next) {

        const newReservationEvent = new ReservationEvent(req.body)
        try {
            const savedReservationEvent = await new ReservationEvent.save()
            res.status(200).json(savedReservationEvent)
        } catch (err) {
            next(err)
        }
    }
    async updateReservation(req, res, next) {
        try {
            const updatedReservationEvent = await ReservationEvent.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            res.status(200).json(updatedReservationEvent)
        } catch (err) {
            next(err)
        }
    }

    async deleteReservation(req, res, next) {
        try {
            const deletedReservationEvent = await ReservationEvent.findByIdAndDelete(req.params.id)
            res.status(200).json("reservation has been deleted")
        } catch (err) {
            next(err)
        }
    }

    async getReservationStatusEvent(req, res, next) {
        try {
            const reservation = await ReservationEvent.findById(req.params.id)
            res.status(200).json(reservation)
        } catch (err) {
            next(err)
        }
    }

    async getAllReservationStatusEvent(req, res, next) {

        try {
            const reservationEvents = await ReservationEvent.find()
            res.status(200).json(reservationsEvents)
        } catch (err) {
            //res.status(500).json(err)
            next(err)
        }
    }

    // async getReservationByCity(req, res, next) {
    //     try {
    //         const hotelId = await ReservationEvent.aggregate([{
    //                     $match: {
    //                         "current_price": 120000
    //                     }
    //                 },
    //                 {
    //                     $group: {
    //                         _id: "$hotel_id"
    //                     }
    //                 }
    //             ])
    //             //console.log(hotelId)
    //             //res.status(200).json(hotelId)

    //     } catch (err) {
    //         next(err)
    //     }
    // }
}

module.exports = new ReservationEvent