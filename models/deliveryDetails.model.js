const  mongoose = require('mongoose');

const  Schema = mongoose.Schema;

const DeliverDetailsSchema = new Schema({
    userID : {type:String},
    fullName: {type:String},
    phoneNo: {type:String},
    province: {type:String},
    district: {type:String},
    city: {type:String},
    address: {type:String}
});

const DeliveryDetails = mongoose.model('DeliveryDetails', DeliverDetailsSchema);

module.exports = DeliveryDetails;
