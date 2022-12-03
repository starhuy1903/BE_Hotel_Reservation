//const { createError } = require('../../utils/error')

const Reservation = require('../models/reservation')
const createError = require("../../utils/error")

class ReservationController {
    index(req, res) {
        res.send("Hello from reservation")
    }
    async createReservation(req, res, next) {

        const newReservation = new Reservation(req.body)
        console.log(newReservation)
        try {
            const savedReservation = await newReservation.save()
            res.status(200).json(savedReservation)
        } catch (err) {
            next(err)
        }
    }
    async updateReservation(req, res, next) {
        try {
            const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            res.status(200).json(updatedReservation)
        } catch (err) {
            next(err)
        }
    }

    async deleteReservation(req, res, next) {
        try {
            const deletedReservation = await Reservation.findByIdAndDelete(req.params.id)
            res.status(200).json("reservation has been deleted")
        } catch (err) {
            next(err)
        }
    }

    async getReservation(req, res, next) {
        try {
            const reservation = await Reservation.findById(req.params.id)
            res.status(200).json(reservation)
        } catch (err) {
            next(err)
        }
    }

    async getAllReservation(req, res, next) {

        try {
            const reservations = await Reservation.find()
            res.status(200).json(reservations)
        } catch (err) {
            //res.status(500).json(err)
            next(err)
        }
    }

}



module.exports = new ReservationController