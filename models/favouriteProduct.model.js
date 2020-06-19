const  mongoose = require('mongoose');

const  Schema = mongoose.Schema;

const FavouriteSchema = new Schema({
    productID: {type: String},
    userID : {type:String},
    isLiked : {type:Boolean}
});

const FavouriteProducts = mongoose.model('FavouriteProducts', FavouriteSchema);

module.exports = FavouriteProducts;
