const router = require('express').Router();
let rateProduct = require('../models/rating.model');



router.route('/:id').get((req,res) => {
    console.log(req.params.id);
    let id = req.params.id;
    rateProduct.find({productID:id}, function (err, List) {
        res.json(List);
    })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/uid/:uId/pid/:pId').get((req, res) => {
    // /pid/:pId/uid/:uId
    let productID = req.params.pId;
    let UserID = req.params.uId;
    console.log("Product ID :" +productID);
    console.log("User ID :" +UserID);
    rateProduct.find({productID: productID, userID: UserID}, function (err, products) {
        if(!products)
            req.status(404).send("data is not found");
    })
        .then(products => res.json(products))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/add").post((req, res) => {

    let {productID : productID,
        userID : userID,
        rating : rating,
        comments : comments,
        userName : userName,
        item_size : item_size,
        item_color : item_color} = req.body;

console.log(req.body);
    let all = new rateProduct({productID , userID , rating, comments, userName, item_size, item_color});

    all.save()
        .then(() => res.json('Rating success!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    rateProduct.findById(req.params.id,function(err, details){
        if(!details)
            req.status(404).send("data is not found");
        else {
            details.productID = req.body.productID;
            details.userID = req.body.userID;
            details.rating = req.body.rating;
            details.comments = req.body.comments;
            details.userName = req.body.userName;
            details.ciitem_sizety = req.body.ciitem_sizety;
            details.item_color = req.body.item_color;

            details.save().then(product => {
                res.json('Item update!');
            })
                .catch(err => {
                    res.status(400).send("Update not possible");
                });
        }
    });
});

module.exports = router;
