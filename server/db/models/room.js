const mongoose = require('mongoose') ;

const roomSchema = mongoose.Schema({
    group: Boolean,
    user_msg: [{ user: String, msg: String }],
    latest_msg: Number
}) ;

const RoomModel = mongoose.model('Room',roomSchema) ;

module.exports = RoomModel ;