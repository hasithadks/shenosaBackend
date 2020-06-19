const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

let mstaffSchema = new Schema({
    username : {type:String , required:true},
    password : {type:String , required:true},
    fname : {type:String , required:true},
    lname : {type:String , required:true},
    role : {type:String , required:true},
    email : {type: String, trim: true, lowercase: true, unique: true, required: 'Email address is required', validate: [validateEmail, 'Please fill a valid email address'], match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
    profilePic : {type:String}
} , {
    timestamps:true
});

mstaffSchema.pre('save', function (next) {
    if(!this.isModified('password'))
        return next();
    bcrypt.hash(this.password,10,(err,passwordHash)=>{
        if(err)
            return next(err);
        this.password = passwordHash;
        next();
    });
});

mstaffSchema.methods.comparePassword = function (password,cb) {
    bcrypt.compare(password,this.password,(err,isMatch)=>{
        if(err)
            return cb(err);
        else {
            if(!isMatch)
                return cb(null,isMatch);
            return cb(null,this);
        }
    });
}

const ManagementStaff = mongoose.model('ManagementStaff', mstaffSchema);

module.exports = ManagementStaff;

