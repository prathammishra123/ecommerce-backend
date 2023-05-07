const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminSchema");
const keysecret = process.env.ADMIN_KEY

const admin_authenicate = async(req,res,next)=>{
    try {
        console.log("start");
        const token = req.cookies.ecommerceAdmin;
        console.log( "ADDM PRODUCVGJJGJGGGJGJGJGJGGJGT"+token);
        
        const verifyToken = jwt.verify(token,keysecret);
     
        const rootUser = await Admin.findOne({_id:verifyToken._id,"tokens.token":token});
       

        if(!rootUser){ throw new Error("User Not Found") };

        req.token = token; 
        req.rootUser = rootUser;   
        req.userID = rootUser._id;   
        next();  
    } catch (error) {
        console.log("Token is not there");
        res.status(401).send("Unauthorized:No token provided");
        console.log(error);
    }
};

module.exports = admin_authenicate;