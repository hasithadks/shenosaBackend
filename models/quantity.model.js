const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Quantity = new Schema({
    item_id:{
        type:String
    },
    item_size:{
        type:String
    },
    item_colour:{
        type:String
    },
    item_quantity:{
        type: Number
    },
    // item_productImage: {
    //     type: String
    // }
});

module.exports = mongoose.model('Quantity',Quantity);
