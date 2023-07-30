require('dotenv').config() ;
const Express = require('express') ;
const cors = require('cors') ;
const mongoose = require('mongoose') ;
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken') ;

const app = Express() ;
app.use(cors()) ;
app.use(Express.json({limit: '50mb'})) ;



const port = 8000 ;
const jwt_secret = process.env.JWT_SEC ; // --------------- Important
const connectDB = require('./db/config.js') ;
const UserModel = require('./db/models/user.js') ;
const RoomModel = require('./db/models/room.js') ;

const auth = require('./middleware/auth.js') ;

// Connect DB
connectDB('testDB')

app.post('/signup',async (req,res) => {
    const { name, email, passwd } = req.body;
    if(!name || !email || !passwd) {
        return res.status(401).json({msg: "Missing Data"}) ;
    }

    try{
        const user = await UserModel.findOne({ email: email }) ;
        if (user) {
            return res.status(406).json({msg: "User already exist, logIn"}) ;
        }
        const nameCheck = await UserModel.findOne({ name: name }) ;
        if (nameCheck) {
            return res.status(406).json({msg: "Username already taken"}) ;
        }

        const hashedPassswd = await bcrypt.hash(passwd,10) ;
        const data = {name: name, email: email, passwd: hashedPassswd} ;

        const newUser = new UserModel(data);
        await newUser.save() ;
        const id = String(newUser._id) ;

        const token = jwt.sign({id: id}, jwt_secret) ;

        res.status(200).json({msg: "Signup successfull" , token: token}) ;
    }
    catch(err) {
        console.log(err) ;
        return res.status(500).json({msg : "Internal Error"}) ;
    }
}) ;

app.post('/login',async (req,res) => {
    const { email, passwd } = req.body;
    if(!email || !passwd) {
        return res.status(401).json({msg: "Missing Data", token: null}) ;
    }

    try{
        const user = await UserModel.findOne({ email: email }) ;
        if (!user) {
            return res.status(404).json({msg: "User not found, Signup" , token: null}) ;
        }

        const passValid = await bcrypt.compare(passwd,user.passwd) ;
        if (!passValid) {
            return res.status(401).json({msg: "Incorrect password" , token: null}) ;
        }
        const id = String(user._id) ;

        const token = jwt.sign({id: id}, jwt_secret) ;

        return res.status(200).json({msg: "Login successfull" , token: token}) ;
    }
    catch(err) {
        console.log(err) ;
        return res.status(500).json({msg : "Internal Error" , token: null}) ;
    }
})


app.get("/userData",auth,(req,res)=> {
    res.status(200).json({name: req.user.name, rooms: req.user.rooms}) ;
})

app.post("/getChatData",auth, async (req,res) => {
    const { roomid } = req.body ;
    if (!roomid)
        return res.status(404).json({msg: "roomId not found"}) ;
    console.log(roomid) ;
    // Use try catch and find the problem
    const chatData = await RoomModel.findById(roomid) ;
    if (!chatData){
        return res.status(404).json({msg: "Room not found"}) ;
    }
    console.log('exists',chatData,'\n\n') ;

    res.status(200).json(chatData) ;
})


app.listen(port,()=> {
    console.log(`Server running on http://localhost:${port}`) ;
})