const mongoose = require("mongoose");

//creating the database for the user

mongoose.connect("mongodb://127.0.0.1:27017/New_eccomerce_website")
.then(() => {
    console.log("database has been connected succesfull...");
}).catch((error) => {
    console.log(error + "database connection has failed...")
})