const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminSchema");
const keysecret = process.env.ADMIN_KEY

const admin_authenicate = async(req,res,next)=>{
    try {
        console.log("start");
        const token = req.cookies.ecommerceAdmin;
        console.log(token);
        
        const verifyToken = jwt.verify(token,keysecret);
     
        const rootUser = await Admin.findOne({_id:verifyToken._id,"tokens.token":token});
       

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

module.exports = admin_authenicate;