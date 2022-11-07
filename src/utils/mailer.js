const nodemailer = require('nodemailer')
const createError = require("./error")
// SET UP CAU HINH DE GUI MAIL
module.exports = async (email,subject,text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: 465,
            requireTLS: false,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD
            }
        })
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        })
        console.log('Email sent successfully')
    } catch (error) {
        console.log(error, "Email cannot send")
    }
        
}

