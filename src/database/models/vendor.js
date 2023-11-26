const mongoose = require('mongoose');

//making the schema for vendor id

const newman = new mongoose.Schema({
    vendor_id : {
        type: String,
        required: true,
    }
})

//making the collections for the vendor

const Vendor = new mongoose.model("Vendor",newman);
//exporting the data
module.exports = Vendor;