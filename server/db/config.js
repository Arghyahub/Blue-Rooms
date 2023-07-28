const mongoose = require('mongoose') ;

const connectDB= (dbName) => {
    mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Unable to connect Databse\n', err));
}

module.exports = connectDB;