const express = require("express");
const router = new express.Router();
const products = require("../models/productsSchema");
const users = require("../models/UserSchema");
const Admin=require("../models/AdminSchema");
const bcrypt = require("bcryptjs");
const authenicate=require("../middleware/admin_authenticate");
const User =require("../models/UserSchema");
 // api for login of admin
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
// console.log(req.body);
    if (!email || !password) {
        res.status(400).json({ error: "Fill the details" });
    }

    try {

        const Adminlogin = await Admin.findOne({ email: email });
        // console.log("userLogin",userlogin);
        if (Adminlogin) {
            const isMatch = await bcrypt.compare(password, Adminlogin.password);
            console.log(isMatch);

            
            
            if (!isMatch) {
                res.status(400).json({ error: "Invalid crediential pass" });
            } else {
                
                const token = await Adminlogin.generatAuthtoken();
                // console.log('cookie')
                res.cookie("ecommerceAdmin", token, {
                    expires: new Date(Date.now() + 2589000),
                    httpOnly: true
                });
                // res.cookie("Cookie name", "cookie value")
                // console.log("y1111ese");
                res.status(201).json(Adminlogin);
                // console.log("yese");  
            }

        } else {
            res.status(400).json({ error: "user not exist" });
        }

    } catch (error) {
        res.status(400).json({ error: "invalid crediential pass" });
        console.log("error the bhai catch ma for login admin   " + error.message);
    }
});
module.exports = router;

// delete user 
router.delete("/remove/:id", authenicate, async (req, res) => {
    try {
        const { id } = req.params;
       const user_del=await User.findById(id);
    //    console.log(user_del);
       if(!user_del)
       {
        res.status(400).json("This user does not exist");
       }
       else
       {
        await User.findByIdAndDelete(id)
        res.status(201).json("Item Deleted");
       }
        console.log("Item removed");

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

// update details of user
router.patch("/update/:id", authenicate, async (req, res)=> 
{
    try {
        const { id } = req.params;
       const user_upd=await User.findById(id);
       const {fname, email, mobile}=req.body;
    //    console.log(user_del);
       if(!user_upd)
       {
        res.status(400).json("This user does not exist");
       }
       else
       {
       if(fname){ user_upd.fname=fname;}
       if(email){user_upd.email=email;}
       if(mobile){ user_upd.mobile=mobile;}
       await user_upd.save();
        res.status(201).json("User Updated");
       }
       console.log("User Updated");

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

// add product 
router.post("/addproduct", authenicate, async (req, res)=> 
{    
   
    try {
       const {id, url,detailUrl,title,price,description,discount,tagline ,no_of_times}=req.body;
    console.log(id, url,detailUrl,title,price,description,discount,tagline ,no_of_times);
       if(!id || !url || !title || !detailUrl || !price || !description || !discount || !tagline || !no_of_times)
       {
        res.status(400).json("Fill the details properly");
        console.log("Details are not filled properly");
       }
       await products.create({id, url,detailUrl,title,price,description,discount,tagline,no_of_times});
        res.status(201).json("Product Added");
       console.log("Product Added");

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

// delete product
router.delete("/deleteproduct/:id", authenicate, async (req, res) => {
    try {
        const { id } = req.params;
       const pro_del=await products.findById(id);
    //    console.log(user_del);
       if(!pro_del)
       {
        res.status(400).json("This product does not exist");
       }
       else
       {
        await products.findByIdAndDelete(id)
        res.status(201).json("Product Deleted");
       }
        console.log("Product removed");

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

// update product
router.patch("/updateproduct/:id", authenicate, async (req, res)=> 
{
    // console.log("hiiii123");
    try {
        // console.log("hiiii1");
        const { id:id1 } = req.params;
       const pro_upd=await products.findById(id1);
       console.log(id1);
       const { id,url,detailUrl,title,price,description,discount,tagline,no_of_times}=req.body;
       console.log(id,url,detailUrl,title,price,description,discount,tagline,no_of_times);
       if(!pro_upd)
       {
        res.status(400).json("This product does not exist");
       }
       else
       {
       if(id){pro_upd.id=id;}
       if(url){pro_upd.url=url;}
       if(detailUrl){pro_upd.detailUrl= detailUrl;}
    //    if(title){pro_upd.title=title;}
    //    if(price){pro_upd.price=price;}
       if(description){pro_upd.description=description;}
       if(discount){pro_upd.discount=discount;}
       if(tagline){pro_upd.tagline=tagline;}
       pro_upd.no_of_times=no_of_times;
       await pro_upd.save();
       console.log("Product Updated");
        res.status(201).json("Product Updated");
       }
     

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

// get analysis
router.get("/analysis", authenicate, async (req, res)=> 
{
    try 
    {
    const pro= await products.find({});
    console.log(pro);
    let proarr=[];
    for( let it of pro)
    { 
        
        proarr.push( it);
    }   
    res.status(200).json(proarr);
    console.log("data senttt");
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});
// to get all users
router.get("/getusers",authenicate, async(req,res) => {
    try {
        const usersdata = await users.find();
       
        console.log("data mila hain");
        res.status(201).json(usersdata);
    } catch (error) {
        console.log("error" + error.message);
        console.log("data nhai mila");
    }
});

// get individual data of product through mongodbid
router.get("/getproductsone_mongo/:id",async(req,res)=> {
    console.log("yes i am there");
    try{
        const {id}=req.params;
        console.log("hiii"+id);
        const individualdata= await products.findById(id);
        console.log(individualdata);
        console.log("hii");
        res.status(200).json(individualdata);
    }
    catch(error)
    {
      res.status(400).json(error);
        console.log("id not found");
    }
})
// get individual data of user through mongodbid
router.get("/getusersone_mongo/:id",async(req,res)=> {
    // console.log("yes i am there");
    try{
        const {id}=req.params;
        // console.log("hiii"+id);
        const individualdata= await users.findById(id);
        // console.log(individualdata);
        // console.log("hii");
        res.status(200).json(individualdata);
    }
    catch(error)
    {
      res.status(400).json(error);
        console.log("Id not found");
    }
})




