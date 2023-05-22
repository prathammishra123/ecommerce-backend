const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const keysecret = process.env.KEY

const authenicate = async(req,res,next)=>{
    res.header('Access-Control-Allow-Credentials', true)
    try {
        console.log("start");
        console.log("HERE IS THE REQ-");
        console.log(req);
        console.log("here is my token-"+req.headers.ecommerce)
        console.log("here is my tokendsf-"+req.header.ecommerce)
        

        const token = req.header.ecommerce;

        
        const verifyToken = jwt.verify(token,keysecret);
     
        const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token":token});
       

        if(!rootUser){ throw new Error("User Not Found") };

        req.token = token; 
        req.rootUser = rootUser;   
        req.userID = rootUser._id;   
        next();  
    //   console.log("executed");
    } catch (error) {
        res.status(401).send("Unauthorized:No token provided");
        console.log(error);
    }
};

module.exports = authenicate;