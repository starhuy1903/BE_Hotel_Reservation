const User = require('../models/user')
const bcrypt = require('bcryptjs')
const createError = require("../../utils/error")
const jwt = require("jsonwebtoken")

const sendMail = require('../../utils/mailer')
const Joi = require('joi');
const crypto = require('crypto')
const user = require("../models/user")
const redis = require('../../config/redis')

const ROLES_LIST = require("../../config/allowedRoles")


class AuthController{
    index(req,res){
        res.send("Hello from auth")
    }
    async register(req, res, next){
        try {
            //VALIDATE
            const schema = Joi.object({
                email: Joi.string().email().required(),
                username: Joi.string()
                    .alphanum()
                    .min(1)
                    .max(30)
                    .required(),
                password: Joi.string().required(),
                repeatPassword: Joi.ref('password'),
                phoneNumber: Joi.number().required(),
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
            })
            const {error} = schema.validate(req.body)
            if(error) return next(error)

            if(await User.findOne({username: req.body.username})){
                return next(createError(500,"Username is duplicated"))
            }
            if(await User.findOne({email: req.body.email})){
                return next(createError(500,"Email is duplicated"))
            }

            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(req.body.password, salt)
            const newUser = new User({
                username: req.body.username,
                password: hash,
                email: req.body.email,
                roles: [ROLES_LIST.User],
                first_name: req.body.firstName,
                last_name: req.body.lastName,
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
            if(!req.body.username){
                return next(createError(500,"Username is required"))
            }
            if(!req.body.password){
                return next(createError(500,"Password is required"))
            }

            const user = await User.findOne({username: req.body.username})
            if(!user) return next(createError(404,"Username Not Found "))

            const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
            if(!isPasswordCorrect) return next(createError(400,"Wrong password or username"))

            if(user.verified === false) return next(createError(400,"User is not verified"))


            //const roles = Object.values(user.roles).filter(Boolean)
            //console.log(Object.values(user.roles))

            const refreshToken = jwt.sign({id: user._id, roles: user.roles}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_EXPIRE + 'd'})
            redis.set(user._id.toString(), refreshToken,"EX",process.env.REFRESH_EXPIRE*24*60*60)
            res.cookie("refreshToken", refreshToken,{httpOnly: true, secure: true})
            

            const token = jwt.sign({id: user._id, roles: user.roles}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_EXPIRE})
            res.cookie("accessToken", token,{httpOnly: true, secure: true})

            res.status(200).json({
                'accessToken': token
            })

            
        }
        catch(err){
            next(err)
        }
    }
    async sendEmailResetPassword(req, res, next) {
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
            const token = jwt.sign({id: req.user.id, roles: req.user.roles}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_EXPIRE})
            res.cookie("accessToken", token,{httpOnly: true, secure: true})
            res.status(200).send("Generate new access token successfully")
         }
         catch(error) {
            next(error)

         }
    }

    async logout(req, res, next){
        try{
            
            res.clearCookie('accessToken')
            /*const refreshToken = req.cookies.refreshToken
            if(!refreshToken) return next(createError(400, 'Bad Request'))*/
            res.clearCookie('refreshToken')
            redis.del(req.user.id.toString(), (err, reply)=>{
                    if(err) return next(createError(500,"Internal Server"))
                    res.status(200).json({"message":"Log out"})
            })
        }
        catch(error) {
           next(error)

        }
   }

}

module.exports = new AuthController

