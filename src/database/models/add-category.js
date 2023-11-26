const mongoose = require("mongoose");

//making the validation for the scema

const newuser = new mongoose.Schema({
    addcategory : {
        type: String,
        required: true,

    }
})

//making the collection for the add to category

const Addtoproduct = new mongoose.model("Addtoproduct",newuser);
module.exports = Addtoproduct; 