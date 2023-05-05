const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id:String,
    url:String,
    detailUrl:String,
    title:Object,
    price:Object,
    description:String,
    discount:String,
    tagline:String,
    no_of_times:Number,
});

const Products = new mongoose.model("products",productSchema);

module.exports = Products;