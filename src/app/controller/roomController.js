//const { createError } = require('../../utils/error')

const Hotel = require('../models/hotel')
const Room = require('../models/room')
const createError = require("../../utils/error")

class roomController{
    index (req,res){
        res.send("Hello from room")
    }
    async createRoom(req, res){
        
        const newroom = new Room(req.body)
        try{
            const savedroom = await newroom.save()
            res.status(200).json(savedroom)
        }
        catch(err){
            next(err)
        }
    }
    async updateRoom(req, res){
        try{
            const updatedRoom = await Room.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
            res.status(200).json(updatedRoom)
        }
        catch(err){
            next(err)
        }
    }

    async deleteRoom(req, res){
        try{
            const deletedRoom = await Room.findByIdAndDelete(req.params.id)
            res.status(200).json("room has been deleted")
        }
        catch(err){
            next(err)
        }
    }

    async getRoom(req, res){
        try{
            const room = await Room.findById(req.params.id)
            res.status(200).json(room)
        }
        catch(err){
            next(err)
        }
    }

    async getAllRoom(req, res, next){

        try{
            const rooms = await Room.find()
            res.status(200).json(rooms)
        }
        catch(err){
            //res.status(500).json(err)
            next(err)
        }
    }
}


module.exports = new roomController