const authRoute = require("./auth")
const userRoute = require("./users")
const roomRoute = require("./rooms")
const hotelRoute = require("./hotels")

function route(app){
    app.use("/auth", authRoute)
    app.use("/hotel", hotelRoute)
    app.use("/room", roomRoute)
    app.use("/user", userRoute)
    
    app.use((err,req,res,next)=>{
        errorStatus = err.status || 500
        errMessage = err.message || ("Something went wrong")
        return res.status(errorStatus).json({
            success: false,
            status: errorStatus,
            message: errMessage,
            stack: err.stack
        })
    })
}

module.exports = route