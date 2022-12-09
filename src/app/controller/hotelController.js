//const { createError } = require('../../utils/error')

const Hotel = require('../models/hotel')
const Room = require('../models/room')
const Category = require("../models/category")
const createError = require("../../utils/error")
const {findRoomServed} = require("../service/room")
const {pagination} = require("../service/site")
class HotelController{
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
            if(updatedHotel === null) return next(createError(404, "Not Found"))
            res.status(200).json(updatedHotel)
        }
        catch(err){
            next(err)
        }
    }

    async deleteHotel(req, res, next){
        try{
            const deletedHotel = await Hotel.findByIdAndDelete(req.params.id)
            if(deletedHotel === null) return next(createError(404, "Not Found"))
            res.status(200).json("Hotel has been deleted")
        }
        catch(err){
            next(err)
        }
    }

    async getHotel(req, res, next){
        try{
            
            const hotel = await Hotel.findById(req.params.id)
            if(hotel === null) return next(createError(404, "Not Found"))
            res.status(200).json(hotel)
        }
        catch(err){
            next(err)
        }
    }

    async getAllHotel(req, res, next){

        try{
            const {maxPrice,minPrice, ...others} = req.query
            const column = req.query.column || "name"
            const sort = req.query.sort || 1
            const page = req.query.page || 1

            const availableHotels = (await Hotel.find({
                ...others,
                cheapest_price: { $gt: minPrice | 1, $lt: maxPrice || 99999999999 },
            }).sort({[column]: sort}))
            const availablePage = Math.ceil(availableHotels.length/process.env.PER_PAGE)
            if(page>availablePage && availableHotels.length!==0){
                return next(createError(404,"Not Found"))
            }
            const hotels = pagination(availableHotels, page)
            res.status(200).json({"hotels": hotels, "availablePage": availablePage})
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
            const categoryName = req.query.category.split(",")
            const categories = await Promise.all(categoryName.map(category => {
                return Category.findOne({
                    category_name: category
                })
            }))
            const list = await Promise.all(categories.map(category=>{
                if(category)
                    return Hotel.countDocuments({category_id: category._id})
                else
                    return 0
            }))
            res.status(200).json(list)
        }
        catch(err){
            //res.status(500).json(err)
            next(err)
        }
    }

    async filterHotel(req, res, next){
        try{
            const {maxPrice,minPrice,startDate,endDate, ...others} = req.query
            const numPeople = req.query.numPeople || -1
            const column = req.query.column || "name"
            const sort = req.query.sort || 1
            const page = req.query.page || 1

            //FIND ROOM SERVED
            const roomServeds = await findRoomServed(startDate, endDate)
           
            //PARSE ROOMSERVED ID
            const roomServedsId = roomServeds.map((roomServed)=>{
                return roomServed.roomId.toString()
            })

            //FIND AVAILABLE ROOM
            const availableRooms = (await Room.find({})).filter((room)=>{
                return (!roomServedsId.includes(room._id.toString()))
            })

            const groupBy = (x,f)=>x.reduce((a,b,i)=>((a[f(b,i,x)]||=[]).push(b),a),{})

            //FIND AVAILABLE HOTEL ID
            const groupByHotels = groupBy(availableRooms, (v)=> v.hotel_id)
            const availableHotelsId = []
            for(let hotel in groupByHotels){
                let maxPeople = 0
                for(let room of groupByHotels[hotel]){
                    console.log(room)
                    maxPeople+=room.maxPeople
                }
                if(maxPeople > numPeople){
                    availableHotelsId.push(hotel)
                }
            }

            
            //FIND AVAILABLE HOTEL
            const availableHotels = (await Hotel.find({
                ...others,
                cheapest_price: { $gt: minPrice | 1, $lt: maxPrice || 99999999999 },
            }).sort({[column]: sort})).filter(hotel =>{
                return availableHotelsId.includes(hotel._id.toString())
            })

            //PAGINATION
            const availablePage = Math.ceil(availableHotels.length/process.env.PER_PAGE)
            if(page>availablePage && availableHotels.length!==0){
                return next(createError(404,"Not Found"))
            }
            const hotels = pagination(availableHotels, page)
            res.status(200).json({"hotels": hotels, "availablePage": availablePage})
        }
        catch(err){
            //res.status(500).json(err)
            next(err)
        }
    }
    async getHotelByHotelOwner(req, res, next){
        try{
            const userId = req?.user?.id
            if(!userId) return next(createError(403,"You're not authorized"))
            const hotels = await Hotel.find({
                owner_id: userId
            })
            res.status(200).json(hotels)
        }
        catch(err){
            next(err)
        }
    }

}

module.exports = new HotelController