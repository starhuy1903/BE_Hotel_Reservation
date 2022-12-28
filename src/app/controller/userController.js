const User = require("../models/user")
const verifyToken = require("../models/token")
const bcrypt = require('bcryptjs')
const createError = require("../../utils/error")
const ROLES_LIST = require("../../config/allowedRoles")

class UserController{
    index (req,res){
        res.send("Hello from user")
    }

    async createUser(req, res, next){
        try{
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(req.body.password, salt)
            let roles = []
            for(let role of req.body.roles){
                for(let key in ROLES_LIST){
                    if(role === key) roles.push(ROLES_LIST[key])
                }
            }

            const newUser = new User({
                username: req.body.username,
                password: hash,
                email: req.body.email,
                roles: roles,
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                isActive: true,
                verified: true
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
        catch(err){
            next(err)
        }
    }
    async updateUser(req, res, next){
        try{
            if(req.user.id !== req.params.id) return next(createError(403,"You're not authorized")) 
            const {username, email, roles, verified} = req.body
            if(username || email || roles || verified) return next(createError(400,"Bad Request"))
            if(!req.body.password) {
                const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
                res.status(200).json(updatedUser)
            }
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(req.body.password, salt)
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body, password: hash}, {new: true})
            res.status(200).json({"message": "User has been updated"})
        }
        catch(err){
            next(err)
        }
    }

    async updateUserbyAdmin(req, res, next){
        try{
            const user = await User.findOne({_id: req.params.id})
            if(!user) return next(createError(404,"Not Found")) 
            if(!req.body.password) {
                const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
                res.status(200).json(updatedUser)
            }
            let roles = []
            for(let role of req.body.roles){
                for(let key in ROLES_LIST){
                    if(role === key) roles.push(ROLES_LIST[key])
                }
            }
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(req.body.password, salt)
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body, password: hash, roles: roles}, {new: true})
            res.status(200).json(updatedUser)
        }
        catch(err){
            next(err)
        }
    }

    async deleteUser(req, res, next){
        try{
            const deletedUser = await User.findByIdAndDelete(req.params.id)
            if(!deletedUser) return next(createError(404,"Not Found"))
            res.status(200).json({"message": "User has been deleted"})
        }
        catch(err){
            next(err)
        }
    }

    async getUser(req, res, next){
        try{
            const newUser = await User.findById(req.params.id)
            if(!newUser) return next(createError(404,"Not Found"))
            res.status(200).json(newUser)
            
        }
        catch(err){
            next(err)
        }
    }

    async getAllUser(req, res, next){

        try{
            const column = req.query.column || "roles"
            const sort = req.query.sort || 1
            const page = req.query.page || 1
            const Users = await User.find({...req.query}).sort({[column]: sort})
            const availablePage = Math.ceil(Users.length / process.env.PER_PAGE)
            if(page > availablePage && Users.length!==0) return next(createError(400,"Page not found"))
            res.status(200).json(Users)
        }
        catch(err){
            //res.status(500).json(err)
            next(err)
        }
    }

    async resetPassword(req, res, next){
        try{
            const user = await User.findOne({_id: req.params.id})
            if(!user) return next(createError(400,"Invalid link"))
            
            const token = await verifyToken.findOne({
                user_id: user._id,
                key: req.params.key
            })
           
            if(!token) return next(createError(400,"Invalid link"))


            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(req.body.password, salt)
            const updatedUser = await User.findByIdAndUpdate(user._id, {password: hash}, {new: true})
            await token.remove()
            
            res.status(200).json({"message":"Reset Password Succesfully"})
        }
        catch(err){
            next(err)
        }
    }
    async verifyEmailUser(req, res, next){
        try{
            const user = await User.findOne({_id: req.params.id})
            if(!user) return next(createError(400,"Invalid link"))
            
            const token = await verifyToken.findOne({
                user_id: user._id,
                key: req.params.key
            })
            
            if(!token) return next(createError(400,"Invalid link"))

            await User.findByIdAndUpdate(req.params.id, {verified: true}, {new: true})
            await token.remove()

            res.status(200).json({"message":"Verify User Email Succesfully"})
        }
        catch(err){
            next(err)
        }
    }
    async getUserProfile(req, res, next){
        try{
            const user = await User.findOne({_id: req.user.id})
            if(!user) return next(createError(400,"Not Found"))
            res.status(200).json(user)
            
        }
        catch(err){
            next(err)
        }
    }
}

module.exports = new UserController