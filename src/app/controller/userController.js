const User = require("../models/user")
const bcrypt = require('bcryptjs')
class userController{
    index (req,res){
        res.send("Hello from user")
    }
    async updateUser(req, res, next){
        try{
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(req.body.password, salt)
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body, password: hash}, {new: true})
            res.status(200).json(updatedUser)
        }
        catch(err){
            next(err)
        }
    }

    async deleteUser(req, res, next){
        try{
            const deletedUser = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted")
        }
        catch(err){
            next(err)
        }
    }

    async getUser(req, res, next){
        try{
            const newUser = await User.findById(req.params.id)
            res.status(200).json(newUser)
        }
        catch(err){
            next(err)
        }
    }

    async getAllUser(req, res, next){

        try{
            const Users = await User.find()
            res.status(200).json(Users)
        }
        catch(err){
            //res.status(500).json(err)
            next(err)
        }
    }

    async resetPassword(req, res, next){
        try{
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(req.body.password, salt)
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {password: hash}, {new: true})
            res.status(200).json(updatedUser)
        }
        catch(err){
            next(err)
        }
    }
}

module.exports = new userController