const  mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const soldProductSchema = new Schema({
    productID: {type: String},
    userID : {type:String},
    item_price : {type: Number},
    item_discount: {type: Number},
    discounted_price: {type: Number},
    item_size: {type:String},
    item_color: {type:String},
    requested_qty: {type: Number},
},{
    timestamps:true
});

const soldProduct = mongoose.model('soldProduct', soldProductSchema);

module.exports = soldProduct;
