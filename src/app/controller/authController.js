const User = require('../models/user')
const bcrypt = require('bcryptjs')
const createError = require("../../utils/error")
const jwt = require("jsonwebtoken")
<<<<<<< HEAD

const sendMail = require('../../utils/mailer')
const Joi = require('joi');
const crypto = require('crypto')
=======
const passwordReset = require("../routes/passwordReset");
const connection = require("../config/db");

app.use(express.json());
//  Can phai chinh qua BODY -> raw -> text chuyen thanh JSON
// SET UP MAIL MAC DINH TRONG FILE .ENV 
app.use("/api/password-reset", passwordReset);
>>>>>>> 2a38c61 (Add API)

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
                //roles: req.body.roles,
                //first_name: req.body.first_name,
                //last_name: req.body.last_name,
                //address: req.body.address,
                //phoneNumber: req.body.phoneNumber,
                //isActive: req.body.isActive
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

            const token = jwt.sign({id: user._id, roles: user.roles}, process.env.JWT, {expiresIn: '1d'})

            const {password,roles, ...otherDetails} = user._doc
            res.cookie("access_token", token,{httpOnly: true}).status(200).json({...otherDetails})
        }
        catch(err){
            next(err)
        }
    }
    async sendEmail(req, res, next) {
        try {
            const schema = Joi.object({email: Joi.string().email().required()})
            const {error} = schema.validate(req.body)
            if (error) return next(createError(403,error.details[0].message))
    
            const user = await User.findOne({email: req.body.email});
            if(!user) return next(createError(400,"User Not Found "));
    
            
            const token = jwt.sign({id: user._id}, process.env.JWT, {expiresIn: '1200s'})
            res.cookie("reset_password_token", token,{httpOnly: true}).status(200)
            
           
            // mapping links
            const link = `${process.env.BASE_URL}user/password-reset/${user._id}`;
            //console.log(link)
            // send email
            await sendMail(user.email, "Password Reset", link);
            res.status(200).send("Password reset link has been sent to your email");
    
    
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new authController