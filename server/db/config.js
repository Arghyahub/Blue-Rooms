require('dotenv').config() ;
const MONGOURI = process.env.MONGO_SEC ;
const mongoose = require('mongoose') ;

const connectDB= (dbName) => {
    mongoose.connect(`${MONGOURI}${dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Unable to connect Databse\n', err));
}

module.exports = connectDB;