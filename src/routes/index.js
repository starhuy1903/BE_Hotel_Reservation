const authRoute = require("./auth")
const userRoute = require("./users")
const roomRoute = require("./rooms")
const hotelRoute = require("./hotels")
const categoryRoute = require("./category")
const reservationRoute = require("./reservation")
const verify = require("../middleware/verifyToken")

function route(app) {
    app.use("/auth", authRoute)
    app.use("/hotel", verify.verifyToken, hotelRoute)
    app.use("/room", verify.verifyToken, roomRoute)
    app.use("/user", verify.verifyToken, userRoute)
    app.use("/category", verify.verifyToken, categoryRoute)
    app.use("/reservation", verify.verifyToken, reservationRoute)
    app.use((err, req, res, next) => {
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