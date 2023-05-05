const mongoose = require("mongoose")
require("dotenv").config();
require("./db/conn");
const Admin=require("./models/AdminSchema");
const bcrypt = require("bcryptjs");
const add_admin=async()=>
{
  const admin= await Admin.create({
    email:'prathammishra9869@gmail.com',
    password:bcrypt.hashSync('ramaniya@9867',10),
  })
}

add_admin();