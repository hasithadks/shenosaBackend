const  mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const CartSchema = new Schema({
    productID: {type: String},
    userID : {type:String},
    item_price : {type: Number},
    item_discount: {type: Number},
    discounted_price: {type: Number},
    item_size: {type:String},
    item_color: {type:String},
    requested_qty: {type: Number},
    quantities_id : {type:String},
    selectedImage : {type:String}
});

const userCart = mongoose.model('userCart', CartSchema);

module.exports = userCart;
