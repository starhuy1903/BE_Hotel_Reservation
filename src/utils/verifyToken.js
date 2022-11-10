const jwt = require('jsonwebtoken')
const createError = require('./error')
const redis = require('../config/redis')


function verifyToken(req, res, next){
    const token = req.cookies.access_token
    if(!token) return next(createError(401,"You're not authentication"))

    jwt.verify(token, process.env.ACCESS_KEY,(err, user)=>{
        if(err) {
            if(err.name === "JsonWebTokenError") return next(createError(403, "Token is not valid"))
            return next(createError(403, err.message))
        }
        req.user = user
        next()
    })
}

function verifyRefeshToken(req, res, next){
    const refresh_token = req.cookies.refresh_token
    
    if(!refresh_token) return next(createError(401,"You're not authentication"))

    jwt.verify(refresh_token, process.env.REFRESH_KEY,(err, user)=>{
        if(err) {
            if(err.name === "JsonWebTokenError") return next(createError(403,err.message ))
            return next(createError(403, err.message))
        }
        redis.get(user.id, (err,reply)=>{
            if(err) return next(createError(500, "Internal Sever Error"))
            if(reply === refresh_token){
                req.user = user
                next()
            }
            else return next(createError(403,"You're not authorized")) 
        })
        
    })
}

function verifyUser(req, res, next){
    if(req.user.id === req.params.id){
        next()
    }
    else{
        return next(createError(403,"You're not authorized"))
    }
}

function verifyAdmin(req, res, next){
   
    if(req.user.roles.some((e)=>e==="admin")){
       next()
    }
    else{
        return next(createError(403,"You're not authorized"))
    }
}

module.exports = {verifyToken, verifyUser, verifyAdmin, verifyRefeshToken}
