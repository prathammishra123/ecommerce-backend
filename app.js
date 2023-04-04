require("dotenv").config();
const express = require("express");
const app=express();

const port=8005;
app.listen(port,()=>{
    console.log(`server is running on port number ${port}`);
});
// node app.js to run app.js but we have to go under server folder.
// Do ctrl+C for stopping your server.