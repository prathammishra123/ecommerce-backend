require("dotenv").config();
const express = require("express");
const app=express();
const cors = require("cors")
const mongoose = require("mongoose")
require("./db/conn");
const products=require("./models/productsSchema");
const DefaultData = require("./defaultdata");
const router = require("./routes/router");
const adminRouter=require("./admin-routes/admin-router")
const cookieParser = require("cookie-parser");


const port=8005;
// app.set("trust proxy", 1)
app.use(express.json());
app.use(cookieParser());
app.use(express.cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ["set-cookie"] 
}));
app.use(function(req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )})
app.use(router);
app.use('/admin',adminRouter)
app.listen(port,()=>{
    console.log(`server is running on port number ${port}`);
});
// DefaultData();
// node app.js to run app.js but we have to go under server folder.
// Do ctrl+C for stopping your server.