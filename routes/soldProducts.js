

const router = require('express').Router();
let soldProduct = require('../models/soldProducts.model');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cred = require('../email-config/config');

// var transport = {
//     host : 'smtp.gmail.com',
//     auth : {
//         user : cred.USER,
//         pass : cred.PASS
//     }
// };
//
// var transporter = nodemailer.createTransport(transport);
//
// transporter.verify((error, success) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Server is ready to take messages of Order Department');
//     }
// });


router.route('/:id').get((req,res) => {
    console.log(req.params.id)
    let id = req.params.id;
    soldProduct.find({userID:id}, function (err, soldList) {
        res.json(soldList);
    })
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route("/add").post((req, res) => {

    let {productID : productID,
        userID : userID,
        item_price : item_price,
        item_discount : item_discount,
        discounted_price : discounted_price,
        item_size : item_size,
        item_color : item_color,
        requested_qty : requested_qty} = req.body;


    let all = new soldProduct({productID , userID , item_price, item_discount, discounted_price, item_size, item_color, requested_qty});
    // console.log( all._id);
    // let userEmail = localStorage.getItem('user_username');
    // console.log( userEmail);
    // console.log( userEmail);
    // let name = '';
    //
    // const content = `
    //                     Hi,\n
    //                     Your oder has been place successfully!!!. \n
    //                     order Reference : ${all._id} \n\n
    //
    //                     If there any issue with order, please contact us through : onlineshoppingwebsite18@gmail.com \n
    //                     or Call us : (+94)71 156 8055 \n\n
    //
    //                     Order Details,\n
    //                     product ID : ${productID} \n
    //                     Price : ${discounted_price} \n
    //                     Select Size : ${item_size}\n
    //                     Select Color : ${item_color}\n
    //                     qty : ${requested_qty} \n\n
    //                     Thanks, \n
    //                     Online Fashion Store Team.
    //                 `;
    //
    // var mail = {
    //     // from: fname,
    //     to: userEmail,
    //     subject: 'Order Reference Number',
    //     text: content
    // }
    //
    // transporter.sendMail(mail, (err, data) => {
    //     if (err) {
    //         res.json({
    //             msg: 'fail'
    //         })
    //     } else {
    //         res.json({
    //             msg: 'success'
    //         })
    //     }
    // })




    all.save(all._id)
        .then((data) => {
            console.log("soldproduct Add method: ")
           // console.log( all._id);
           //  let userEmail = localStorage.getItem('user_username');
           //  console.log( userEmail);
           //  console.log( userEmail);
           //  let name = '';



        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
