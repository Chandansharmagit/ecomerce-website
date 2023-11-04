const mongoose = require("mongoose");
const validator = require("validator");


//creating schema for the database

const New_user = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },


    email: {
        type: String,
        unique: true,
        validate(value) {
            if (!validator.isEmail) {
                throw new error("the email you entered is already exists please another email");
            }

        }
    },
    contact: {
        type: String,
        minlength: 10,
        unique: true,
        required: true
    },

    location: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
})

//creating the database name and validation fot the validation

const New_eccomerce_website = new mongoose.model("New_eccomerce_website", New_user);
module.exports = New_eccomerce_website;