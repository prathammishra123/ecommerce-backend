const express = require("express");
const router = new express.Router();
const products = require("../models/productsSchema");
const User =require("../models/UserSchema");
// console.log(products)
// to get all products
router.get("/getproducts", async(req,res) => {
    try {
        const productsdata = await products.find();
        // console.log(productsdata);
        console.log("data mila hain");
        res.status(201).json(productsdata);
    } catch (error) {
        console.log("error" + error.message);
        console.log("data nhai mila");
    }
});
// get individual data
router.get("/getproductsone/:id",async(req,res)=> {
    try{
        const {id}=req.params;
        console.log(id);
        const individualdata= await products.findOne({id:id});
        console.log(individualdata);
        console.log("hii")
        res.status(201).json(individualdata);
    }
    catch(error)
    {
      res.status(400).json(error);
        console.log("id not found");
    }
})
//register user data
router.post("/register", async (req, res) => {
    console.log(req.body);
    const { fname, email, mobile, password, cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "Fill  all details" });
        console.log("Data not available");
    };

    try {

        const preuser = await User.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "This email is already exist" });
        } else if (password !== cpassword) {
            res.status(422).json({ error: "Password are not matching" });;
        } else {

            const finaluser = new User({
                fname, email, mobile, password, cpassword
            });

            // yaha pe hasing krengeby bcryptjs

            const storedata = await finaluser.save();
            console.log(storedata + "user successfully added");
            res.status(201).json(storedata);
        }

    } catch (error) {
        console.log("Error in catch while  registratoin time" + error.message);
        res.status(422).send(error);
    }

});


module.exports = router;