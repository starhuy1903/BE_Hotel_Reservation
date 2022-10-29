const User = require("../models/user")

class userController{
    index (req,res){
        res.send("Hello from user")
    }
    async updateUser(req, res){
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
            res.status(200).json(updatedUser)
        }
        catch(err){
            next(err)
        }
    }

    async deleteUser(req, res){
        try{
            const deletedUser = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted")
        }
        catch(err){
            next(err)
        }
    }

    async getUser(req, res){
        try{
            const User = await User.findById(req.params.id)
            res.status(200).json(User)
        }
        catch(err){
            next(err)
        }
    }

    async getAllUser(req, res, next){

        /*const failed = true
        if(failed) return next(createError(401,"You're not authentic"))*/

        try{
            const Users = await User.find()
            res.status(200).json(Users)
        }
        catch(err){
            //res.status(500).json(err)
            next(err)
        }
    }
}

module.exports = new userController