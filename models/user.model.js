const  mongoose = require('mongoose');

const  Schema = mongoose.Schema;

const userSchema = new Schema({
    user_email: {type:String,required:true,max:255},
    user_username:{type:String,required:true,max:500,min:5},
    user_phone:{type:Number,required:true},
    user_gender:{type:String},
    user_image:{type:String},
    user_b_year:{type:String},
    user_b_month:{type:String},
    user_b_day:{type:String}
});

const User = mongoose.model('User',userSchema);

module.exports = User;