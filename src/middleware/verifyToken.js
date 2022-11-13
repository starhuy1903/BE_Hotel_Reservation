const jwt = require('jsonwebtoken')
const createError = require('../utils/error')
const redis = require('../config/redis')


function verifyToken(req, res, next){
    /*
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];*/

    const token = req.cookies.accessToken
    if(!token) return next(createError(401,"You're not authentication"))

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, user)=>{
        if(err) {
            if(err.name === "JsonWebTokenError") return next(createError(401, "Token is not valid"))
            return next(createError(401, err.message))
        }
        req.user = user
        next()
    })
}

function verifyRefeshToken(req, res, next){
    const refreshToken = req.cookies.refreshToken
    
    if(!refreshToken) return next(createError(401,"You're not authentication"))

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(err, user)=>{
        if(err) {
            if(err.name === "JsonWebTokenError") return next(createError(401,err.message ))
            return next(createError(401, err.message))
        }
        redis.get(user.id, (err,reply)=>{
            if(err) return next(createError(500, "Internal Sever Error"))
            if(reply === refreshToken){
                req.user = user
                next()
            }
            else return next(createError(403,"You're not authorized")) 
        })
        
    })
}



module.exports = {verifyToken, verifyRefeshToken}
