const productRouter = require('express').Router();
let Product = require('../models/product.model');
const mongoose = require('mongoose');

productRouter.route('/').get(function(req, res) {
    Product.find(function(err, products) {
        if (err) {
            console.log(err);
            res.render('index');
        } else {
            res.json(products);
        }
    });
});

productRouter.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Product.findById(id, function (err, product) {
        res.json(product);
    });
});

productRouter.route('/itemId/:id').get(function (req, res) {
    console.log("Product Item ID");
    console.log(req.params.id);
    let id = req.params.id;
    Product.find({"item_id" : id}, function (err, product) {
        res.json(product);
    });
});


// productRouter.route('/add').post(function(req, res) {
//     let product = new Product(req.body);
//     product.save()
//         .then(product => {
//             res.status(200).json({'item': 'item added successfully'});
//         })
//         .catch(err => {
//             res.status(400).send('adding new item failed');
//         });
// });

productRouter.route('/add').post(function(req, res) {
    const product = new Product({
        item_id: new mongoose.Types.ObjectId(),
        item_name : req.body.item_name,
        item_description :req.body.item_description,
        item_category : req.body.item_category,
        item_from : req.body.item_from,
        item_brand : req.body.item_brand,
        item_price : req.body.item_price,
        item_discount : req.body.item_discount,
    });
    product
        .save()
        .then(result => {
            res.json(result);
            console.log(result);
            res.status(201).json({
                message: "Created product successfully",
                createdProduct: {
                    item_name : result.item_name,
                    item_description :result.item_description,
                    item_category : result.item_category,
                    item_from : result.item_from,
                    item_brand : result.item_brand,
                    item_price : req.body.item_price,
                    item_discount : req.body.item_discount,
                    item_id: result.item_id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:5000/products/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

productRouter.route('/update/:id').post((req, res) => {
    Product.findById(req.params.id,function(err, product){
        if(!product)
            req.status(404).send("data is not found");
        else
            product.item_name = req.body.item_name;
        product.item_description =req.body.item_description;
        product.item_category = req.body.item_category;
        product.item_from = req.body.item_from;
        product.item_brand = req.body.item_brand;
        product.item_price = req.body.item_price;
        product.item_discount = req.body.item_discount;


            product.save().then(product =>{
                res.json('Item update!');
            })
            .catch(err =>{
                res.status(400).send("Update not possible");
            });
    });
});

productRouter.route('/delete/:id').delete((req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(() => res.json('Product Deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = productRouter;
