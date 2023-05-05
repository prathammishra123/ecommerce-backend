const express = require("express");
const router = new express.Router();
const products = require("../models/productsSchema");
const User =require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const authenicate=require("../middleware/authenticate");
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
   if(fname===""){return}
   if(email===""){return}
   else if(mobile===""){return}
   else if(password===""){return}
   else if(cpassword===""){return}
   else
   {
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
   } 
// if (!fname || !email || !mobile || !password || !cpassword) {
//         res.status(422).json({ error: "Fill  all details" });
//         console.log("Data not available");
//     };

   

});
// login user api
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
console.log(req.body);
    if (!email || !password) {
        res.status(400).json({ error: "fill the details" });
    }

    try {

        const userlogin = await User.findOne({ email: email });
        // console.log("userLogin",userlogin);
        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            // console.log(isMatch);

            
            
            if (!isMatch) {
                res.status(400).json({ error: "invalid crediential pass" });
            } else {
                
                const token = await userlogin.generatAuthtoken();
                // console.log('cookie')
                res.cookie("ecommerce", token, {
                    expires: new Date(Date.now() + 2589000),
                    httpOnly: true
                });
                // res.cookie("Cookie name", "cookie value")
                // console.log("y1111ese");
                res.status(201).json(userlogin);
                // console.log("yese");  
            }

        } else {
            res.status(400).json({ error: "user not exist" });
        }

    } catch (error) {
        res.status(400).json({ error: "invalid crediential pass" });
        console.log("error the bhai catch ma for login timeyftryyyrr" + error.message);
    }
});
// adding the data into cart
router.post("/addcart/:id", authenicate, async (req, res) => {

    try {
        // console.log("perfect 6");
        const { id } = req.params;
        const cart = await products.findOne({ id: id });                                         
        console.log(cart + "cart milta hain");
        
        const Usercontact = await User.findOne({ _id: req.userID });
        console.log(Usercontact + "user milta hain");


        if (Usercontact) {
            const cartData = await Usercontact.addcartdata(cart);

            await Usercontact.save();
            // console.log(cart.no_of_times);
             cart.no_of_times=cart.no_of_times+1;
             await cart.save();
            // console.log(cartData + " thse save wait kr");
            // console.log(Usercontact + "userjode save");
            res.status(201).json(Usercontact);
        }
        else
        {
            res.status(401).json({error:"invalid user"}); 
            console.log("user not verifired1");
        }
    } catch (error) {
        res.status(401).json({error:"invalid user"});
        console.log("user not verifired2");
    }
});
// get data into the cart basically getting the cart details
router.get("/cartdetails", authenicate, async (req, res) => {
    try {
        const buyuser = await User.findOne({ _id: req.userID });
        // console.log(buyuser + "user hain buy pr");
        res.status(201).json(buyuser);
    } catch (error) {
        // console.log(error + "error for buy now");
    }
});
// get user is login or not
router.get("/validuser", authenicate, async (req, res) => {
    try {
        const validuserone = await User.findOne({ _id: req.userID });
        res.status(201).json(validuserone);
    } catch (error) {
        console.log(error + "error for valid user");
    }
});
// remove item from the cart

router.delete("/remove/:id", authenicate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((curel) => {
            return curel.id != id
        });

        req.rootUser.save();
        cart.no_of_times=cart.no_of_times-1;
        if(cart.no_of_times<0){cart.no_of_times=0;}
             await cart.save();
        res.status(201).json(req.rootUser);
        console.log("Item removed");

    } catch (error) {
        // console.log(error + "jwt provide then remove");
        res.status(400).json(error);
    }
});
// for userlogout

router.get("/logout", authenicate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("ecommerce", { path: "/" });
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        // console.log("user logout");

    } catch (error) {
        // console.log(error + "jwt provide then logout");
    }
});

module.exports = router;