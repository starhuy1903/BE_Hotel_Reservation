//const { createError } = require('../../utils/error')

const Reservation = require('../models/reservation')
const createError = require("../../utils/error")
const RoomServed = require('../models/roomServed')
const ReservationEvent = require('../models/reservationStatusEvent')
const ReservationCatelog = require('../models/reservationCatelog')
const {findRoomServed} = require("../service/room")

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
            if(updatedReservation === null) return next(createError(404, "Not Found"))
            res.status(200).json(updatedReservation)
        } catch (err) {
            next(err)
        }
    }

    async deleteReservation(req, res, next) {
        try {
            const deletedReservation = await Reservation.findByIdAndDelete(req.params.id)
            if(deletedReservation === null) return next(createError(404, "Not Found"))
            res.status(200).json("reservation has been deleted")
        } catch (err) {
            next(err)
        }
    }

    async getReservation(req, res, next) {
        try {
            const reservation = await Reservation.findById(req.params.id)
            if(reservation === null) return next(createError(404, "Not Found"))
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
            next(err)
        }
    }

    async reservation(req, res, next){
        try {
            const {startDate, endDate, roomId} = req.body
            if(!startDate || !endDate || !roomId) return next(createError(400, "Bad request"))
            const userId = req.user.id
            const discountPercent = req.body.discountPercent || 0
            
            const roomServeds = await findRoomServed(startDate, endDate)
            if (roomServeds.map((roomServed)=>{return roomServed.roomId.toString()}).includes(roomId)){
                return next(createError(400, "Room has been served"))
            }

            const room = Room.findById(roomId)
            if(room === null) return next(createError(404, "Room does not exist"))

            const totalPrice = (endDate - startDate)*room.current_price

            //CREATE NEW RESERVATION
            const reservation = new Reservation({
                startDate: startDate,
                endDate: endDate,
                userId: userId,
                discountPercent: discountPercent,
                totalPrice: totalPrice
            })
            await reservation.save()

            //CREATE NEW ROOMSERVED
            const roomServed = new RoomServed({
                roomId: roomId,
                reservationId: reservation._id,
                price: totalPrice
            })
            await roomServed.save()

            const reservationCatelog = ReservationCatelog.find({
                statusName: 'pending'
            })

             //CREATE NEW RESERVATION EVENT
            const reservationEvent = new ReservationEvent({
                reservationId: reservation._id,
                reservationStatusCatalogId: reservationCatelog._id,
                details: ""
            })
            await reservationEvent.save()
            res.status(200).json(reservations)
        } catch (err) {
            next(err)
        }
    }

}



module.exports = new ReservationController