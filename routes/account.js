const  router = require('express').Router();
let Account = require('../models/account.model');
const nodemailer = require('nodemailer');
const cred = require('../email-config/config');
const jwt = require('jsonwebtoken');
const bcrypt =require('bcrypt');

////////////////////////////////////////////////////////////////////////////////////////
var transport = {
    host : 'smtp.gmail.com',
    auth : {
        user : cred.USER,
        pass : cred.PASS
    }
}

var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages of Forgot');
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////

router.route('/').get((req,res) =>{
    Account.find()
        .then(accounts => res.json(accounts))
        .catch(err => res.status(400).json('Error: '+ err));
});

//In registration add function to to Account details
//password bcrypted
router.route('/add').post(async (req,res) =>{

    //checking if the user is already exist in the database
    const user = await Account.findOne({
        user_username:req.body.user_username
    });

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.user_password,salt);

    if (!user){
        const user_username = req.body.user_username;
        const user_password = hashPassword;
        const user_role = req.body.user_role;

        const newAccount = new Account({
            user_username,
            user_password,
            user_role
        });
        newAccount.save()
            .then(account => res.json(account))
            .catch(err =>res.status(400).json('Error: '+ err));
    }else{
        return res.status(400).json('Email already exit');
    }
});

//login function
//validate password, email
//generate Token and assign to Account table
router.route('/username/:email').post(async (req, res) => {

    let password = req.body.user_password;

    //check email is exist
    const user = Account.findOne({
        user_username: req.params.email
    },async function(err,obj) {
        let dbps = (obj.user_password);

        //validate bcrypt password
        const validPass = await bcrypt.compare(password, dbps);

        if (!user){
            return res.status(400).json('Email is not found');
        }
        else {
            if (!validPass){
                return  res.status(400).json('Invalid password');
            }else{
                //create  token
                const token = jwt.sign({user_username : user.user_email},process.env.TOKEN_SECRET);
                res.header('auth_token',token);

                if (token){
                    Account.find({"user_username": req.params.email})
                        .then(accounts => res.json(accounts))
                        .catch(err => res.status(400).json('Error: ' + err));

                    const user_token = token;

                    //Update Token field in account table according to login email for identify user is logged in
                    Account.updateOne({"user_username": req.params.email},{user_token : user_token}, function (err, res) {
                    }).then();

                }
                else{
                    return res.status(400).json('no token');
                }
            }
        }
    });

});

//logout function
//Assign token to null
router.route('/logout/:email').post(async (req, res) => {

    //check email is exist
    const user = Account.findOne({
        user_username: req.params.email
    },async function(err,obj) {

        if (!user){
            return res.status(400).json('Email is not found');
        }
        else {
            const user_token = null;

            //Update Token field to null, according to login user email for identify user logged out
            Account.updateOne({"user_username": req.params.email},{user_token : user_token}, function (err, res) {
            }).then(accounts => res.json(0));

        }
    });

});

//password changing function
router.route('/update/account/:email').put(async function(req, res) {

    let userEmail = req.params.email;
    let userPassword = req.body.user_password;
    let userNewPassword = req.body.user_Newpassword;

    //new password convert to hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(userNewPassword,salt);

    //check email is exist
    const user = Account.findOne({
        user_username: req.params.email
    },async function(err,obj) {
        let dbps = (obj.user_password);

        //compare and validate password
        const validPass = await bcrypt.compare(userPassword, dbps);

        if (!user){
            return res.status(400).json('Email is not found');
        }
        else {
            if (!validPass){
                return  res.status(400).json('Invalid password');
            }else{
                Account.updateOne({user_username : userEmail}, {user_password : hashPassword}, function (err, res) {
                }).then(accounts => res.json(accounts));
                }
            }
    });
});

router.route('/forgot/:email').get(async (req, res) => {

    //check email is exist
    const user = Account.findOne({
        user_username: req.params.email
    },async function(err,obj) {

        if (!user){
            return res.status(400).json('Email is not found');
        }
        else {
            let userEmail = req.params.email;

    /////////////////////////////////////////////////////////////////////////////////////////////////////
            const content = `
                        Hey ${userEmail},\n
                        You forgot your password.\n\n
                        username : ${userEmail} \n 
                        Please use this link to reset the password\n
                        Here is your reset link: https://senosafrontend.herokuapp.com/ResetPassword \n
                        
                        Please use your credentials to Login from here- https://senosafrontend.herokuapp.com/login \n
                        To Visit Online Shopping store- https://senosafrontend.herokuapp.com/home \n
                        Thanks,
                        Online Fashion Store Team.    
                    `;

                    var mail = {
                        from: userEmail,
                        to: userEmail,
                        subject: 'Admin User Credentials',
                        text: content
                    }

                    transporter.sendMail(mail, (err, data) => {
                        if (err) {
                            res.json({
                                msg: 'fail'
                            })
                        } else {
                            res.json({
                                msg: 'success'
                            })
                        }
                    });
     ///////////////////////////////////////////////////////////////////////////////////////////////////////
            }
    });
});

router.route('/reset/:email').put(async function(req, res)  {

    //check email is exist
    const user = Account.findOne({
        user_username: req.params.email
    },async function(err,obj) {
        let dbps = (obj.user_password);

        if (!user){
            return res.status(400).json('Email is not found');
        }
        else {
            let userEmail = req.params.email;
            let userOldPassword = dbps;
            let userNewPassword = req.body.user_Newpassword;

            //hash password
            const salt = await bcrypt.genSalt(10);
            const newHashPassword = await bcrypt.hash(userNewPassword,salt);


            Account.updateOne({user_username : userEmail}, {user_password : newHashPassword}, function (err, res) {
            }).then(console.log("successfully Reset Password"));

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            const content = `
                        Hey ${userEmail},\n
                        You Successfully Reset your password.\n\n
                        username : ${userEmail} \n 
                        password: ${userNewPassword}
                        Please use your credentials to Login from here- https://senosafrontend.herokuapp.com/login \n
                        To Visit Online Shopping store- https://senosafrontend.herokuapp.com/home \n
                        Thanks,
                        Online Fashion Store Team.    
                    `;

            var mail = {
                from: userEmail,
                to: userEmail,
                subject: 'Admin User Credentials',
                text: content
            }

            transporter.sendMail(mail, (err, data) => {
                if (err) {
                    res.json({
                        msg: 'fail'
                    })
                } else {
                    res.json({
                        msg: 'success'
                    })
                }
            });
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    });
});

router.route('/delete/:email').delete((req,res)=> {

    let userEmail = req.params.email;

    Account.deleteOne({user_username : userEmail}, function (err, res) {
    }).then(accounts => res.json(accounts));

});

module.exports = router;
