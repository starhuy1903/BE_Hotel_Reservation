const {User} = require('../models/user');
// const Token = require('../models/token');
const sendMail = require('../utils/mailer');
const Joi = require('joi');
const crypto = require('cypto');
const jwt = require("jsonwebtoken")
const router = express.Router();

// CREATE TOKEN DUNG THU VIEN THAY VI TAO BANG TOKEN SET TAY
// VALIDATE CHUA HOAN THANH
const Token = jwt.createToken({id: user._id, roles: user.roles, createdAt: Date.now()}, process.env.JWT)

router.post("/", async (req, res) => {
    try {
        const schema = Joi.object({email: Joi.string().email().required()});
        const {error} = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send("User does not exsit");

        let token = await Token.findOne({userId: user._id});
        if(!token) {
            token = await Token.create({userId: user._id, token: crypto.randomBytes(32).toString('hex')});
        }
        //save token
        await token.save();
        // mapping links
        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        // send email
        await sendMail(user.email, "Password Reset", link);
        res.status(200).send("Password reset link has been sent to your email");


    } catch (error) {
        res.send(error.message);
        console.log(error);
    }
})

router.post("/:userId/:token", async (req, res) => {
    try{
        const schema = Joi.object({password: Joi.string().required()});
        const {error} = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.params.userId);
        if(!user) return res.status(400).send("User does not exsit");

        const token = await Token.findOne({userId: user._id, token: req.params.token});
        if(token) return res.status(400).send("Invalid token");

        user.password = req.body.password;
        await user.save();
        await token.delete();
        res.status(200).send("Password has been reset successfully");

    } catch (error) {
        res.send(error.message);
        console.log(error);
    }
})

module.exports = router;