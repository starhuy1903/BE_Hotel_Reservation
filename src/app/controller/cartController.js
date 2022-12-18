const User = require('../models/user')
const Reservation = require('../models/reservation')
const createError = require("../../utils/error")
const Cart = require('../models/cart')
class CartController {
    index(req, res) {
        res.send("Hello from cart")
    }
    async createCart(req, res, next) {
        const newCart = new Cart(req.body)
        try {

            const savedCart = await newCart.save()
            res.status(200).json(savedCart)
        } catch (error) {
            next(error)
        }
    }
    async getCart(req, res, next) {
        try {
            const cart = await Cart.findById(req.params.id)
            res.status(200).json(cart)
        } catch (error) {
            next(error)
        }
    }
    async deleteCart(req, res, next) { // huy
        try {
            const cart = await Cart.findByIdAndDelete(req.params.id)
            res.status(200).json(cart)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CartController