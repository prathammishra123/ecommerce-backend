require("dotenv").config();
const express = require("express");
const app=express();
const cors = require("cors")
const mongoose = require("mongoose")
require("./db/conn");
const products=require("./models/productsSchema");
const DefaultData = require("./defaultdata");
const router = require("./routes/router");
const cookieParser = require("cookie-parser");


const port=8005;
app.use(express.json());
app.use(cookieParser());
// app.use(express.cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(router);
app.listen(port,()=>{
    console.log(`server is running on port number ${port}`);
});
// DefaultData();
// node app.js to run app.js but we have to go under server folder.
// Do ctrl+C for stopping your server.