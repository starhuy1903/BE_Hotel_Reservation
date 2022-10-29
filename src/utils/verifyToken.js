const jwt = require('jsonwebtoken')
const createError = require('./error')

function verifyToken(req, res, next){
    const token = req.cookies.access_token
    if(!token) return next(createError(401,"You're not authentication"))

    jwt.verify(token, process.env.JWT,(err, user)=>{
        if(err) return next(createError(403, "Token is not valid"))
        req.user = user
        next()
    })
}

function verifyUser(req, res, next){
    if(req.user.id === req.params.id || req.user.isAdmin ){
        next()
    }
    else{
        return next(createError(403,"You're not authorized"))
    }
}

function verifyAdmin(req, res, next){
    if(req.user.isAdmin){
       next()
    }
    else{
        return next(createError(403,"You're not authorized"))
    }
}

module.exports = {verifyToken, verifyUser, verifyAdmin}