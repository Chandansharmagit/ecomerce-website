const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

//now acquring the schema model for the products 
const simplify = mongoose.Schema({
    vendor_id: {
        type: String,
        required: true
    },
    store_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    discount: {
        type: String,
        requured: true,
    },
    category_id: {
        type: String,
        required: true,
    },
    sub_cat_id: {
        type: String,
        required: true,
    },
    images: {
        type: String,
        required: true,
    }
})

//creating the collections for the add product
const Product = new mongoose.model("Product", simplify);
//exporting the product
module.exports = Product;

