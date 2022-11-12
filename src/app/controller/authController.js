const User = require("../models/user")
const verifyToken = require("../models/token")
const bcrypt = require('bcryptjs')
const createError = require("../../utils/error")
const jwt = require("jsonwebtoken")

const sendMail = require('../../utils/mailer')
const Joi = require('joi');
const crypto = require('crypto')
const user = require("../models/user")
const redis = require('../../config/redis')


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
                roles: ["user"],
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                isActive: true,
                verified: false
            })
            await newUser.save()
            const newToken = new verifyToken({
                user_id: user._id,
                key: crypto.randomBytes(32).toString("hex")
            })
            
            await newToken.save()

            // mapping links
            const link = `${process.env.BASE_URL}user/verify/${newUser._id}/${newToken.key}`;
            // send email
            await sendMail(newUser.email, "Verify Email", link);
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

            const refresh_token = jwt.sign({id: user._id, roles: user.roles}, process.env.REFRESH_KEY, {expiresIn: process.env.REFRESH_EX + 'd'})
            redis.set(user._id.toString(), refresh_token,"EX",process.env.REFRESH_EX*24*60*60)
            res.cookie("refresh_token", refresh_token,{httpOnly: true, secure: true})
            

            const token = jwt.sign({id: user._id, roles: user.roles}, process.env.ACCESS_KEY, {expiresIn: process.env.ACCESS_EX})
            const {password,roles, ...otherDetails} = user._doc
            res.cookie("access_token", token,{httpOnly: true, secure: true}).status(200).json({...otherDetails})

            
        }
        catch(err){
            next(err)
        }
    }
    async resetPassword(req, res, next) {
        try {
            const schema = Joi.object({email: Joi.string().email().required()})
            const {error} = schema.validate(req.body)
            if (error) return next(createError(403,error.details[0].message))
    
            const user = await User.findOne({email: req.body.email});
            if(!user) return next(createError(400,"User Not Found "));
            
            const newToken = new verifyToken({
                user_id: user._id,
                key: crypto.randomBytes(32).toString("hex")
            })
            
            await newToken.save()

            // mapping links
            const link = `${process.env.BASE_URL}user/password-reset/${user._id}/${newToken.key}`;
        
            // send email
            await sendMail(user.email, "Password Reset", link);
            res.status(200).send("Password reset link has been sent to your email");
    
    
        } catch (error) {
            next(error)
        }
    }

    async refreshToken(req, res, next){
         try{
            const token = jwt.sign({id: req.user.id, roles: req.user.roles}, process.env.ACCESS_KEY, {expiresIn: ACCESS_EX})
            res.cookie("access_token", token,{httpOnly: true, secure: true})
            res.status(200).send("Generate new access token successfully")
         }
         catch(error) {
            next(error)

         }
    }

    async logout(req, res, next){
        try{
            
            res.clearCookie('access_token')
            /*const refresh_token = req.cookies.refresh_token
            if(!refresh_token) return next(createError(400, 'Bad Request'))*/
            res.clearCookie('refresh_token')
            redis.del(req.user.id.toString(), (err, reply)=>{
                    if(err) return next(createError(500,"Internal Server"))
                    res.status(200).send("Log out")
            })
        }
        catch(error) {
           next(error)

        }
   }

}

module.exports = new authController