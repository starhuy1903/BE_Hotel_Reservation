const Reservation = require('../models/reservation')

const getHistory = async (userId)=>{
    return Reservation.find({userId: userId})
}

module.exports = {getHistory}