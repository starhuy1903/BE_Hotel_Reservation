//const { createError } = require('../../utils/error')

const Room = require('../models/room')
const Hotel = require('../models/hotel')
const reservation = require("../models/reservation")
const RoomType = require('../models/roomType')
const RoomServed = require('../models/roomServed')
const ReservationEvent = require('../models/reservationStatusEvent')
const ReservationCatelog = require('../models/reservationCatelog')
const {findRoomServed} = require("../service/room")
const {pagination} = require("../service/site")
const createError = require("../../utils/error")
const { array } = require('joi')

class RoomController{
    index (req,res){
        res.send("Hello from room")
    }
    async createRoom(req, res, next){
        
        const newroom = new Room({...req.body, hotel_id: req.params.id})
        try{
            const savedroom = await newroom.save()
            res.status(200).json(savedroom)
        }
        catch(err){
            next(err)
        }
    }
    async updateRoom(req, res, next){
        try{
            const updatedRoom = await Room.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
            if(!updatedRoom) return next(createError(404, "Not Found"))
            res.status(200).json(updatedRoom)
        }
        catch(err){
            next(err)
        }
    }

    async deleteRoom(req, res, next){
        try{
            const deletedRoom = await Room.findByIdAndDelete(req.params.id)
            if(!deletedRoom) return next(createError(404, "Not Found"))
            res.status(200).json("room has been deleted")
        }
        catch(err){
            next(err)
        }
    }

    async getRoom(req, res, next){
        try{
            const room = await Room.findById(req.params.id)
            if(!room) return next(createError(404, "Not Found"))
            res.status(200).json(room)
        }
        catch(err){
            next(err)
        }
    }
    async getRoomByHotel(req, res, next){
        try{
            const room = await Room.find({hotel_id: req.params.id})
            res.status(200).json(room)
        }
        catch(err){
            next(err)
        }
    }
    async getAllRoom(req, res, next){

        try{
            const {maxPrice,minPrice, ...others} = req.query
            const column = req.query.column || "room_name"
            const sort = req.query.sort || 1
            const page = req.query.page || 1
            let roomType = req.query.room_type
            if(!roomType){
                roomType = (await RoomType.find({})).map(room_type => {return room_type._id.toString()})
            }
            else{
                roomType = (await RoomType.find({typeName: roomType})).map(room_type => room_type._id.toString())
            }
            const rooms = (await Room.find({
                ...others,
                current_price: { $gt: minPrice || 1, $lt: maxPrice || 99999999999 },
                room_type_id: {$in: roomType}
            }).sort({[column]: sort}))
            const availablePage = Math.ceil(rooms.length/process.env.PER_PAGE)
            if(page>availablePage && rooms.length!==0){
                return next(createError(404,"Not Found"))
            }
            const Rooms = pagination(rooms, page)
            res.status(200).json({"rooms": Rooms, "availablePage": availablePage})
            
        }
        catch(err){
            //res.status(500).json(err)
            next(err)
        }
    }

    async filterRoom(req, res, next){
        try{
            const {minPrice, maxPrice, city, startDate, endDate,...others} = req.query
            const column = req.query.column || "room_name"
            const sort = req.query.sort || 1
            const page = req.query.page || 1
            let roomType = req.query.room_type
            if(!roomType){
                roomType = (await RoomType.find({})).map(room_type => {return room_type._id.toString()})
            }
            else{
                roomType = (await RoomType.find({typeName: roomType})).map(room_type => room_type._id.toString())
            }
            //FIND ROOMSERVED
            const roomServeds = await findRoomServed(startDate, endDate)
            //PARSE ROOMSERVED ID
            const roomServedsId = roomServeds.map((roomServed)=>{
                return roomServed.roomId.toString()
            })
            //FIND HOTEL MATCH CITY
            const hotelsId = (await Hotel.find({
                city: city
            })).map(hotel => {
                return hotel._id.toString()
            })
            //FIND AVAILABLE ROOM
            const availableRooms = (await Room.find({
                ...others,
                current_price: { $gt: minPrice | 1, $lt: maxPrice || 99999999999 },
                room_type_id: {$in: roomType}
            }).sort({[column]: sort})).filter((room)=>{
                return (!roomServedsId.includes(room._id.toString())) && (hotelsId.includes(room.hotel_id.toString()))
            })
            
            //PAGINATION
            const availablePage = Math.ceil(availableRooms.length/process.env.PER_PAGE)
            if(page>availablePage && availableRooms.length!==0){
                return next(createError(404,"Not Found"))
            }
            const rooms = pagination(availableRooms, page)
            res.status(200).json({"rooms": rooms, "availablePage": availablePage})
        }
        catch(err){
            next(err)
        }
    }
}
    


module.exports = new RoomController