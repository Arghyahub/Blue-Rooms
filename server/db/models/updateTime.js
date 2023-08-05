const mongoose = require('mongoose') ;

const UpdateTime = mongoose.Schema({
    roomId : String,
    update : Number
})

const UpdateTimeModel = mongoose.model('Notification',UpdateTime) ;

module.exports = UpdateTimeModel ;