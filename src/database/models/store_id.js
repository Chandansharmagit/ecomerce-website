const mongoose = require('mongoose');

const store_id = new mongoose.Schema({
    vendor : {
        type: String,
        required: true,

    }
})

const Store = new mongoose.model("Store",store_id);
module.exports = Store;