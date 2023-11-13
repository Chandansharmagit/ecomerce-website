const mongoose = require("mongoose");

//creating the database for the user

 mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce")
// mongoose.connect( 'mongodb+srv://chandansharma575757:HYt3VxJHB8jsPf51@cluster0.hied47d.mongodb.net/Ecommerce?retryWrites=true&w=majority')
.then(() => {
    console.log("database has been connected succesfull...");
}).catch((error) => {
    console.log(error + "database connection has failed...")
})