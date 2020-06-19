const  mongoose = require('mongoose');

const  Schema = mongoose.Schema;

const accountSchema = new Schema({
    user_username:{type:String,max:255,min: 5},
    user_password:{type:String,min:5},
    user_role: {type:String},
    user_token:{type:String},
});

const Account = mongoose.model('Account',accountSchema);

module.exports = Account;