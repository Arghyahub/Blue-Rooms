const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwd: String,
    rooms: [ {roomid: String, roomName: String, last_vis: Number} ]
});

const UserModel = mongoose.model('User',userSchema) ;

module.exports = UserModel;