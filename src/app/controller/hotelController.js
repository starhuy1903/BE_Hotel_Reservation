//const { createError } = require('../../utils/error')

const Hotel = require('../models/hotel')
const createError = require("../../utils/error")

class hotelController{
    index (req,res){
        res.send("Hello from hotel")
    }
    async createHotel(req, res, next){
        const newHotel = new Hotel(req.body)
        try{
            const savedHotel = await newHotel.save()
            res.status(200).json(savedHotel)
        }
        catch(err){
            next(err)
        }
    }
    async updateHotel(req, res, next){
        try{
            const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
            res.status(200).json(updatedHotel)
        }
        catch(err){
            next(err)
        }
    }

    async deleteHotel(req, res, next){
        try{
            const deletedHotel = await Hotel.findByIdAndDelete(req.params.id)
            res.status(200).json("Hotel has been deleted")
        }
        catch(err){
            next(err)
        }
    }

    async getHotel(req, res, next){
        try{
            const hotel = await Hotel.findById(req.params.id)
            res.status(200).json(hotel)
        }
        catch(err){
            next(err)
        }
    }

    async getAllHotel(req, res, next){

        /*const failed = true
        if(failed) return next(createError(401,"You're not authentic"))*/

        try{
            const hotels = await Hotel.find()
            res.status(200).json(hotels)
        }
        catch(err){
            //res.status(500).json(err)
            next(err)
        }
    }
    async countByCity(req, res, next){
        try{
            const cities = req.query.cities.split(",")
            const list = await Promise.all(cities.map(city=>{
                return Hotel.countDocuments({city: city})
            }))
            res.status(200).json(list)
        }
        catch(err){
            //res.status(500).json(err)
            next(err)
        }
    }

    async countByType(req, res, next){
        try{
            const types = req.query.types.split(",")
            const list = await Promise.all(types.map(type=>{
                return Hotel.countDocuments({type: type})
            }))
            res.status(200).json(list)
        }
        catch(err){
            //res.status(500).json(err)
            next(err)
        }
    }

}

module.exports = new hotelController