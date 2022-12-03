//const { createError } = require('../../utils/error')

const ReservationCatelog = require('../models/reservationCatelog')
const createError = require("../../utils/error")

class ReservationCatelogController{
    index (req,res){
        res.send("Hello from room")
    }
    async createReservationCatelog(req, res, next){
        
        const newReservationCatelog = new ReservationCatelog(req.body)
        try{
            const savedReservationCatelog = await newReservationCatelog.save()
            res.status(200).json(savedReservationCatelog)
        }
        catch(err){
            next(err)
        }
    }
    async updateReservationCatelog(req, res, next){
        try{
            const updatedReservationCatelog = await ReservationCatelog.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
            res.status(200).json(updatedReservationCatelog)
        }
        catch(err){
            next(err)
        }
    }

    async deleteReservationCatelog(req, res, next){
        try{
            const deletedReservationCatelog = await ReservationCatelog.findByIdAndDelete(req.params.id)
            res.status(200).json("ReservationCatelog has been deleted")
        }
        catch(err){
            next(err)
        }
    }

    async getReservationCatelog(req, res, next){
        try{
            const ReservationCatelog = await ReservationCatelog.findById(req.params.id)
            res.status(200).json(ReservationCatelog)
        }
        catch(err){
            next(err)
        }
    }

    async getAllReservationCatelog(req, res, next){

        try{
            const ReservationCatelogs = await ReservationCatelog.find()
            res.status(200).json(ReservationCatelogs)
        }
        catch(err){
            //res.status(500).json(err)
            next(err)
        }
    }

    
}
    


module.exports = new ReservationCatelogController