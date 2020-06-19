const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productCategorySchema = new Schema({
    categoryname : {type:String , required:true},
} , {
    timestamps:true
});

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);

module.exports = ProductCategory;
