const User = require("../models/user")
const bcrypt = require('bcryptjs')
const createError = require("../../utils/error")
const jwt = require("jsonwebtoken")
// const mailer = require("../../utils/mailer")

class authController{
    index(req,res){
        res.send("Hello from auth")
    }
    async register(req, res, next){
        try {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(req.body.password, salt)
            const newUser = new User({
                username: req.body.username,
                password: hash,
                email: req.body.email,
                roles: req.body.roles
            })
            // User.create(user, (err, user) => {
            //     if(!err){

            //     }

            await newUser.save()
            res.status(201).send("Create new user successfully")
        }
        catch(err){
            next(err)
        }
    }

    async login(req, res, next){
        try {
            const user = await User.findOne({username: req.body.username})
            if(!user) return next(createError(404,"Username Not Found "))

            const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
            if(!isPasswordCorrect) return next(createError(400,"Wrong password or username"))

            const token = jwt.sign({id: user._id, roles: user.roles, createdAt: Date.now()}, process.env.JWT)

            const {password,roles, ...otherDetails} = user._doc
            res.cookie("access_token", token,{
                httpOnly: true,
            }).status(200)
            .json({...otherDetails})
        }
        catch(err){
            next(err)
        }
    }
}

module.exports = new authController