const mongoose = require('mongoose');

const subcat = new mongoose.Schema({
    subcat : {
        type: String,
        required: true,
    }
})

const Subcat_id = new mongoose.model("Subcat_cat",subcat);
module.exports = Subcat_id;