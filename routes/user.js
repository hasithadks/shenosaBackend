const  router = require('express').Router();
let User = require('../models/user.model');
const nodemailer = require('nodemailer');
const cred = require('../email-config/config');

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
        console.log('Server is ready to take messages of User');
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////


router.route('/').get((req,res) =>{
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: '+ err));
});

//User register function
router.route('/add').post(async (req,res) =>{

    //checking if the user is already exist in the database
    const user = await User.findOne({
        user_email:req.body.user_email
    });

    if (!user){
        const user_email = req.body.user_email;
        const user_username = req.body.user_username;
        const user_phone = req.body.user_phone;
        const user_gender = req.body.user_gender;
        const user_image = req.body.user_image;
        const user_b_year = req.body.user_b_year;
        const user_b_month = req.body.user_b_month;
        const user_b_day = req.body.user_b_day;

        const newUser = new User({
            user_email,
            user_username,
            user_phone,
            user_gender,
            user_image,
            user_b_year,
            user_b_month,
            user_b_day,
        });


/////////////////////////////////////////////////////////////////////////////////////
        const content = `
                        Hey ${user_username},\n
                        You are successfully registered to Online Fashion Store.\n\n
                        Please use your credentials to Login from here- http://localhost:3000/login \n
                        To Visit Online Shopping store- http://localhost:3000/home \n
                        Thanks,
                        Online Fashion Store Team.    
                    `;

        var mail = {
            from: user_username,
            to: user_email,
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
        })
        ;
/////////////////////////////////////////////////////////////////////////////////////

        newUser.save()
            .then(() =>res.json('User Successfully Added....'))
            .catch(err =>res.status(400).json('Error: '+ err));

    }else{
        return res.status(400).json('Email already exit');
    }

});

//Get users using email
router.route('/username/:email').get((req, res) => {
    User.find({"user_email" : req.params.email})
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Eroor: '+ err));
});

router.route('/:id').get((req,res)=>{
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err=>res.status(400).json('Error: '+ err));
});

//Edit and save User profile
router.route('/update/:id').post((req,res) => {
    User.findById(req.params.id)
        .then(user => {
            user.user_email = req.body.user_email;
            user.user_username = req.body.user_username;
            user.user_phone = req.body.user_phone;
            user.user_gender = req.body.user_gender;
            user.user_image = req.body.user_image;
            user.user_b_year = req.body.user_b_year;
            user.user_b_month = req.body.user_b_month;
            user.user_b_day = req.body.user_b_day;

            user.save()
                .then(() => res.json('User Updated....'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//Delete function using email
router.route('/delete/:email').delete((req,res)=> {
    let userEmail = req.params.email;

    User.deleteOne({user_email : userEmail}, function (err, res) {
    }).then(console.log("successfully delete from user"));
});


module.exports = router;
