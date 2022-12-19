//const { createError } = require('../../utils/error')

const RoomType = require('../models/roomType')
const createError = require("../../utils/error")

class RoomTypeController{
    index (req,res){
        res.send("Hello from room")
    }
    async createRoomType(req, res, next){
        
        const newRoomType = new RoomType(req.body)
        try{
            const savedRoomType = await newRoomType.save()
            res.status(200).json(savedRoomType)
        }
        catch(err){
            next(err)
        }
    }
    async updateRoomType(req, res, next){
        try{
            const updatedRoomType = await RoomType.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
            if(!updatedRoomType) return next(createError(404,"Not Found"))
            res.status(200).json(updatedRoomType)
        }
        catch(err){
            next(err)
        }
    }

    async deleteRoomType(req, res, next){
        try{
            const deletedRoomType = await RoomType.findByIdAndDelete(req.params.id)
            if(!deletedRoomType) return next(createError(404,"Not Found"))
            res.status(200).json("RoomType has been deleted")
        }
        catch(err){
            next(err)
        }
    }

    async getRoomType(req, res, next){
        try{
            const roomType = await RoomType.findById(req.params.id)
            if(!roomType) return next(createError(404,"Not Found"))
            res.status(200).json(roomType)
        }
        catch(err){
            next(err)
        }
    }

    async getAllRoomType(req, res, next){

        try{
            const RoomTypes = await RoomType.find()
            res.status(200).json(RoomTypes)
        }
        catch(err){
            //res.status(500).json(err)
            next(err)
        }
    }

    
}
    


module.exports = new RoomTypeController