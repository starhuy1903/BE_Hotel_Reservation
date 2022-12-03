//const { createError } = require('../../utils/error')

const RoomServed = require('../models/roomServed')
const createError = require("../../utils/error")

class RoomController{
    index (req,res){
        res.send("Hello from room")
    }
    async createRoomServed(req, res, next){
        
        const newRoomServed = new RoomServed(req.body)
        try{
            const savedRoomServed = await newRoomServed.save()
            res.status(200).json(savedRoomServed)
        }
        catch(err){
            next(err)
        }
    }
    async updateRoomServed(req, res, next){
        try{
            const updatedRoomServed = await RoomServed.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
            res.status(200).json(updatedRoomServed)
        }
        catch(err){
            next(err)
        }
    }

    async deleteRoomServed(req, res, next){
        try{
            const deletedRoomServed = await RoomServed.findByIdAndDelete(req.params.id)
            res.status(200).json("RoomServed has been deleted")
        }
        catch(err){
            next(err)
        }
    }

    async getRoomServed(req, res, next){
        try{
            const RoomServed = await RoomServed.findById(req.params.id)
            res.status(200).json(RoomServed)
        }
        catch(err){
            next(err)
        }
    }

    async getAllRoomServed(req, res, next){

        try{
            const RoomServeds = await RoomServed.find()
            res.status(200).json(RoomServeds)
        }
        catch(err){
            //res.status(500).json(err)
            next(err)
        }
    }

    
}
    


module.exports = new RoomController