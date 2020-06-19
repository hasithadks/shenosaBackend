const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Product = new Schema({
    item_id: mongoose.Schema.Types.ObjectId,

    item_name:{
        type:String
    },
    item_description:{
        type:String
    },
    item_category:{
        type:String
    },
    item_from:{
        type: String
    },
    item_brand:{
        type: String
    },
    item_price:{
        type: Number
    },
    item_discount:{
        type: Number
    }
});

module.exports = mongoose.model('Product',Product);
