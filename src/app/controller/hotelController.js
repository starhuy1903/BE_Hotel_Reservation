const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Category = require("../models/category");
const createError = require("../../utils/error");
const { findRoomServed } = require("../service/room");
const { pagination } = require("../service/site");
const mongoose = require("mongoose");

class HotelController {
  index(req, res) {
    res.send("Hello from hotel");
  }
  async createHotel(req, res, next) {
    const newHotel = new Hotel({ ...req.body, owner_id: req.user.id });
    try {
      const savedHotel = await newHotel.save();
      res.status(200).json(savedHotel);
    } catch (err) {
      next(err);
    }
  }
  async updateHotel(req, res, next) {
    try {
      const updatedHotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      if (!updatedHotel) return next(createError(404, "Not Found"));
      res.status(200).json(updatedHotel);
    } catch (err) {
      next(err);
    }
  }

  async deleteHotel(req, res, next) {
    try {
      const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
      if (!deletedHotel) return next(createError(404, "Not Found"));
      res.status(200).json("Hotel has been deleted");
    } catch (err) {
      next(err);
    }
  }

  getHotel = async (req, res, next) => {
    try {
      const hotel = await Hotel.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "categories",
            let: { categoryId: "$category_id" },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ["$$categoryId", "$_id"] }] } } },
            ],
            as: "category",
          },
        },
        { $unwind: "$category" },
      ]);
      if (hotel.length === 0) return next(createError(404, "Not Found"));
      res.status(200).json(hotel);
    } catch (err) {
      next(err);
    }
  }

  async getAllHotel(req, res, next) {
    try {
      const { maxPrice, minPrice} = req.query;
      const column = req.query.column || "name";
      const sort = req.query.sort || 1;
      const page = req.query.page || 1;
      let category = req.query.category;
      if (!category) {
        category = (await Category.find({})).map((category) => {
          return category._id
        });
      } else {
        category = (await Category.find({ category_name: category })).map(
          (category) => category._id
        );
      }

      const others = {}
      if(req.query.city){
        others.city=req.query.city
      }
      const availableHotels = await Hotel.aggregate([
        {
          $lookup: {
            from: "categories",
            let: { categoryId: "$category_id" },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ["$$categoryId", "$_id"] }] } } },
            ],
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $match: {
            $expr: {
              $and: [
                { $gt: ["$cheapest_price", parseInt(minPrice) || 1] },
                {
                  $lt: [
                    "$cheapest_price",
                    parseInt(maxPrice) || 9999999999999999,
                  ],
                },
                { $in: ["$category_id", category] },
              ],
            },
          },
        },
        { $match: { ...others }},
        { $sort: {[column]: parseInt(sort) }},
      ]);

      const availablePage = Math.ceil(
        availableHotels.length / process.env.PER_PAGE
      );
      if (page > availablePage && availableHotels.length !== 0) {
        return next(createError(404, "Not Found"));
      }
      const hotels = pagination(availableHotels, page);
      res.status(200).json({ hotels: hotels, availablePage: availablePage });
    } catch (err) {
      next(err);
    }
  }
  async countByCity(req, res, next) {
    try {
      const cities = req.query.cities.split(",");
      const list = await Promise.all(
        cities.map((city) => {
          return Hotel.countDocuments({ city: city });
        })
      );
      res.status(200).json(list);
    } catch (err) {
      next(err);
    }
  }

  async countByType(req, res, next) {
    try {
      const categoryName = req.query.category.split(",");
      const categories = await Promise.all(
        categoryName.map((category) => {
          return Category.findOne({
            category_name: category,
          });
        })
      );
      const list = await Promise.all(
        categories.map((category) => {
          if (category)
            return Hotel.countDocuments({ category_id: category._id });
          else return 0;
        })
      );
      res.status(200).json(list);
    } catch (err) {
      next(err);
    }
  }

   filterHotel = async (req, res, next) => {
    try {
      const { maxPrice, minPrice, startDate, endDate } = req.query;
      const numPeople = req.query.numPeople || -1;
      const column = req.query.column || "name";
      const sort = req.query.sort || 1;
      const page = req.query.page || 1;
      const groupBy = (x, f) =>
        x.reduce((a, b, i) => ((a[f(b, i, x)] ||= []).push(b), a), {});

      let category = req.query.category;

      if (!category) {
        category = (await Category.find({})).map((category) => {
          return category._id;
        });
      } else {
        category = (await Category.find({ category_name: category })).map(
          (category) => category._id
        );
      }

      //FIND ROOM SERVED
      const servedRooms = await findRoomServed(startDate, endDate);

      //PARSE ROOMSERVED ID
      const servedRoomIds = servedRooms.map((roomServed) => {
        return roomServed.roomId.toString();
      });

      //FIND AVAILABLE ROOM
      const availableRooms = (await Room.find({})).filter((room) => {
        return !servedRoomIds.includes(room._id.toString());
      });

      //FIND AVAILABLE HOTEL ID
      const groupByHotels = groupBy(availableRooms, (v) => v.hotel_id);
      const availableHotelsId = [];
      for (let hotel in groupByHotels) {
        let maxPeople = 0;
        for (let room of groupByHotels[hotel]) {
          maxPeople += room.maxPeople;
        }
        if (maxPeople > numPeople) {
          availableHotelsId.push(hotel);
        }
      }

      //FIND AVAILABLE HOTEL
      const others = {}
      if(req.query.city){
        others.city=req.query.city
      }
      const availableHotels = (await Hotel.aggregate([
        {
          $lookup: {
            from: "categories",
            let: { categoryId: "$category_id" },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ["$$categoryId", "$_id"] }] } } },
            ],
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $match: {
            $expr: {
              $and: [
                { $gt: ["$cheapest_price", parseInt(minPrice) || 1] },
                {
                  $lt: [
                    "$cheapest_price",
                    parseInt(maxPrice) || 9999999999999999,
                  ],
                },
                { $in: ["$category_id", category] },
              ],
            },
          },
        },
        { $match: { ...others }},
        { $sort: {[column]: parseInt(sort) }},
      ])).filter((hotel) => {
        return availableHotelsId.includes(hotel._id.toString());
      })
      //PAGINATION
      const availablePage = Math.ceil(
        availableHotels.length / process.env.PER_PAGE
      );
      if (page > availablePage && availableHotels.length !== 0) {
        return next(createError(404, "Not Found"));
      }
      const hotels = pagination(availableHotels, page);
      res.status(200).json({ hotels, availablePage });
    } catch (err) {
      next(err);
    }
  }

  async getHotelByBusiness(req, res, next) {
    try {
      const userId = new mongoose.Types.ObjectId(req?.user?.id);
      if (!userId) return next(createError(403, "You're not authorized"));
      const hotels = await Hotel.find({
        owner_id: userId,
      });
      res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new HotelController();
