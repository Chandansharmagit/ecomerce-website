const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');


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
    phone: {
        type: String,
        minlength: 10,
        unique: true,
        required: true
    },

    address: {
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
    token: {
        type: String,
        default: '',
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
})

//generatinh the token for the authentication

New_user.methods.generateAuthToken = async function () {
    try {
        console.log(this._id)
        const token = jwt.sign({ _id: this._id.toString() }, "mynameischandansharmaclassnepalsecondaryschool");
        this.tokens = this.tokens.concat({ token })

        await this.save();

        return token;

    } catch (error) {

        res.send("the error part " + error);
        console.log("the error part " + error);
    }
}

//creating the database name and validation fot the validation

const Ecommerce = new mongoose.model(" Ecommerce", New_user);
module.exports = Ecommerce;