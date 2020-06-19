const quantityRouter = require('express').Router();
let Quantity = require('../models/quantity.model');
const mongoose = require('mongoose');
const multer = require('multer');
var filename = '';
//////////////////////////////////////////////////////


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '../../OnlineShoppingWebSite/src/components/uploads/');
    },
    filename: function (req, file, callback) {
        filename= Date.now() + '_' + file.originalname;
        callback(null, filename);
    }
});

const fileFilter = (req, file, callback) => {
    // filter files extensions
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
        console.log('Invalid file extension');
    }

};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


//////////////////////////////////////////////////////
// quantityRouter.route('/').get(function (req, res) {
//     Quantity.find(function (err, quantity) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(quantity);
//         }
//     });
// });
//
// quantityRouter.route('/:id').get(function (req, res) {
//     let id = req.params.id;
//     Quantity.find({"item_id": id}, function (err, quantity) {
//         res.json(quantity);
//     });
// });

quantityRouter.route('/qty/:id').get(function (req, res) {
    let id = req.params.id;
    Quantity.findById(id, function (err, quantity) {
        res.json(quantity);
    });
});

quantityRouter.route('/update/itemQuantity/:id').put(function(req, res) {
    // item.item_quantity = req.body.item_quantity;
     let quantities_id = req.params.id;
     let qty = req.body.item_quantity;
     console.log(qty);
     Quantity.updateOne( {_id : quantities_id}, {item_quantity : qty}, function (err, res) {

     }).then( aaa => {
         res.json("success");
     });

});

quantityRouter.route('/delete/:id').delete((req, res) => {
    Quantity.findByIdAndDelete(req.params.id)
        .then(() => res.json('Product Deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

quantityRouter.route('/delete/qty/:id').delete((req, res) => {
    Quantity.remove({"item_id": req.params.id})
        .then(() => res.json('Product Deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

////////////////////////////////////////////////////////////////////////
quantityRouter.route('/').get(function (req, res) {
    Quantity.find(function (err, quantity) {
        if (err) {
            console.log(err);
        } else {
            res.json(quantity);
        }
    });
});



quantityRouter.route('/').get(function (req, res)  {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc.id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:5000/quantity/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


quantityRouter.route('/:id').get(function (req, res)  {
    const id = req.params.id;
    Quantity.find({"item_id": id}, function (err, quantity) {
        res.json(quantity);
    });
});



quantityRouter.post('/', upload.single('productImage'), (req, res) => {
    console.log(req.file);
    console.log('storage: ' + this.storage);
    const quantity = new Quantity({
        _id: new mongoose.Types.ObjectId(),
        item_id : req.body.item_id,
        item_size: req.body.item_size,
        item_colour: req.body.item_colour,
        item_quantity: req.body.item_quantity,
        // item_productImage: req.file.path
        item_productImage: filename
    });

    quantity.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                item_size: result.item_size,
                item_colour: result.item_colour,
                item_quantity : result.item_quantity,
                id: result.id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:5000/quantity/qty/' + result._id
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});


quantityRouter.route('/update/:id').post((req, res) => {
    Quantity.findById(req.params.id, function (err, quantity) {
        if (!quantity)
            req.status(404).send("data is not found");
        else
            quantity.item_size = req.body.item_size;
        quantity.item_colour = req.body.item_colour;
        quantity.item_quantity = req.body.item_quantity;

        quantity.save().then(quantity => {
            res.json('Item update!');
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

///////////////////////////////////////////////////////////////////////

module.exports = quantityRouter;
