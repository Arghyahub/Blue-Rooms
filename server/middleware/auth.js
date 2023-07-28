require('dotenv').config() ;
const JWT_SECRET = process.env.JWT_SEC ; 

var jwt = require('jsonwebtoken');

const UserModel = require('../db/models/user.js') ;

const auth = async (req,res,next) => {
    const authHeader = req.headers['authorization'] ;
    if (!authHeader){
        return res.status(401).json({ msg: "Token Missing" , token: false , valid: false}) ;
    }
    const decoded = jwt.decode(authHeader,JWT_SECRET) ;
    
    try {
        const user = await UserModel.findById(decoded.id) ;
        if (!user) {
            return res.status(401).json({msg: "User doesn't exist", token: true, valid: false}) ;
        }

        // Attach the user to the req
        req.user = user;

        next() ;
    }
    catch(err) {
        return res.status(500).json({msg: "Some error occured", token: true, valid: true}) ;
    }
}

module.exports = auth;