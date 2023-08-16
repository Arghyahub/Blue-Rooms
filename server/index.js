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
const UpdateTimeModel = require('./db/models/updateTime.js') ;

const auth = require('./middleware/auth.js') ;
const e = require('express');

// Connect DB
connectDB('testDB')

app.get("/",(req,res)=> {
    res.send("Running fine") ;
})

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
        console.log("Idk error : ") ;
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


app.get("/userData",auth, async (req,res)=> {
    try {
        const roomData = [] ;

        await Promise.all(
            (req.user.rooms).map(async (roomElem) => {
                const updated = await UpdateTimeModel.findOne({ roomId : roomElem.roomid}) ;
                roomData.push({ roomid: roomElem.roomid , roomName: roomElem.roomName , last_vis: roomElem.last_vis , _id: roomElem._id , roomUpdated: (updated.update? updated.update:undefined)  }) ;
            })
        )
        res.status(200).json({name: req.user.name, rooms: roomData}) ;
    }
    catch(err) {
        console.log(err) ;
        res.status(405).json({err: "Internal server error"}) ;
    }
})

app.post("/getChatData",auth, async (req,res) => {
    const { roomid } = req.body ;
    if (!roomid){
        return res.status(404).json({err: "roomId not found"}) ;
    }
    // Use try catch and find the problem
    try {
        const chatData = await RoomModel.findById(roomid) ;
        if (!chatData){
            return res.status(404).json({msg: "Room not found"}) ;
        }
    
        res.status(200).json(chatData) ;
    }
    catch(err) {
        console.log(err) ;
        res.status(405).json({err: "Data not found"}) ;
    }
});

app.post("/searchUser", async (req,res)=> {
    const { userName } = req.body ;
    if (!userName){
        return res.status(404).json({err: "Insert a username"}) ;
    }
    try {
        const friend = await UserModel.findOne({name: userName}) ;
        if (!friend){
            return res.status(404).json({err: "User not found"}) ;
        }
        res.status(200).json({name: userName, id: friend._id}) ;
    }
    catch(err){
        console.log(err) ;
    }
})

app.post('/addFriend',auth, async (req,res)=> {
    const { friendName } = req.body ;
    if (!friendName || friendName==='') return res.status(404).json({ success: false  ,err: "No such user" }) ;

    try {
        // 1. Check if a room already exists
        const roomExist = await RoomModel.findOne({ name: { $all: [req.user.name, friendName] , $size: 2 } }) ;
        if (roomExist) {
            return res.status(200).json({success: false, err: "You are already connected"}) ;
        }
        // 2. If not add a room to both users id
        const currTime = new Date().getTime() ;
        const newRoom = new RoomModel({ group: false, user_msg: [],members: [req.user.name, friendName] ,latest_msg: currTime }) ;
        await newRoom.save() ;
        const updateRoomTime = new UpdateTimeModel({ roomId: newRoom._id ,update: currTime }) ;
        await updateRoomTime.save() ;

        // 2.1 Add group Id to both contact's room list
        const user1 = await UserModel.findOne({name: req.user.name}) ;
        const user2 = await UserModel.findOne({name: friendName}) ;
        user1.rooms.unshift({roomid: newRoom._id, roomName: friendName, last_vis: currTime}) ;
        await user1.save() ;
        user2.rooms.unshift({roomid: newRoom._id, roomName: req.user.name, last_vis: currTime}) ;
        await user2.save() ;
        
        // 3. Return room added, with roomId to add to ui
        res.status(200).json({success: true, roomId: newRoom._id, allUsers: [req.user.name, friendName]}) ;
    }
    catch(err) {
        console.log(err) ;
        res.status(405).json({success: false, err: "Some error occurred"}) ;
    }
})

app.post('/appendChat',auth, async (req,res) => {
    const {groupId , chatMsg } = req.body ;
    if (!groupId || !chatMsg) return res.status(500).json({err: "Some error occured"}) ;

    try {
        const currTime = new Date().getTime() ;
        await RoomModel.updateOne({_id: groupId}, { $push : { user_msg: {user: req.user.name , msg: chatMsg} } , $set: {latest_msg: currTime} }) ;
        await UpdateTimeModel.updateOne({roomId: groupId} , { $set : {update: currTime}  } )
        return res.status(200).json({success: true}) ;
    }
    catch(err) {
        console.log(err) ;
        return res.status(405).json({err: "Some error occurred"}) ;
    }
})

app.post('/updateLastVis',auth,async (req,res)=> {
    const { roomId , name } = req.body ;
    if (!roomId || !name ) return res.status(405).json({msg: "Some error occurred"}) ;
    try {
        const currTime = new Date().getTime() ;
        await UserModel.updateOne({ name: name , 'rooms.roomid': roomId }, { $set: {'rooms.$.last_vis': currTime} }) ;
        return res.status(200).json({success:true});
    }
    catch(err) {
        console.log(err);
        return res.status(405).json({msg: "Some error occurred"}) ;
    }
})



const server = app.listen(port,()=> {
    console.log(`Server running on http://localhost:${port}`) ;
})

const io = require('socket.io')(server, {
    pingTimeout: 120000,
    cors: {
        origin: "https://blue-rooms.vercel.app"
    }
})

io.on('connection', (socket)=> {
    socket.join('RootRoom') ;
    // console.log("User connected" + socket.id) ;
    socket.on('join',(roomid)=> {
        socket.join(roomid) ;
    })

    socket.on('new-chat',({chatId, sender, msg}) => {
        socket.to(chatId).emit('recieved-msg',chatId,sender,msg) ;
    })

    socket.on('addFriends',(allUsers,roomId) => {
        console.log(allUsers) ;
        console.log(roomId) ;
        socket.to('RootRoom').emit('joinRoom',allUsers,roomId) ;
    })
})