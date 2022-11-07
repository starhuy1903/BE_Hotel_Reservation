const User = require("../models/user")
const bcrypt = require('bcryptjs')
const createError = require("../../utils/error")
const jwt = require("jsonwebtoken")

const sendMail = require('../../utils/mailer')
const Joi = require('joi');
const crypto = require('crypto')

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

            const token = jwt.sign({id: user._id, roles: user.roles}, process.env.JWT)

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
    async sendEmail(req, res, next) {
        try {
            const schema = Joi.object({email: Joi.string().email().required()});
            const {error} = schema.validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
    
            const user = await User.findOne({email: req.body.email});
            if(!user) return next(createError(400,"User Not Found "));
    
            
            const token = jwt.sign({id: user._id, roles: user.roles, createdAt: Date.now(), token: crypto.randomBytes(32).toString('hex')}, process.env.JWT)
            
            
           
            // mapping links
            const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
            // send email
            await sendMail(user.email, "Password Reset", link);
            res.status(200).send("Password reset link has been sent to your email");
    
    
        } catch (error) {
            res.send(error.message);
            console.log(error);
        }
    }
}

module.exports = new authController