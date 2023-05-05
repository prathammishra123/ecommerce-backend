const mongoose = require("mongoose");
const validator = require("validator");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keysecret = process.env.ADMIN_KEY

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valid email address");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
});

// generting token using instance method
AdminSchema.methods.generatAuthtoken = async function(){
    try {
        let token = jwt.sign({ _id:this._id},keysecret,{
            // expiresIn:"1d"
        });
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;

    } catch (error) {
        console.log(error);
    }
}
const Admin = new mongoose.model("Admin", AdminSchema);

module.exports = Admin;