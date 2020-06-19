const router = require('express').Router();
let userCart = require('../models/cart.model');


router.route('/:id').get((req,res) => {
   let id = req.params.id;
   console.log("cart userID : " + id);
   userCart.find({userID:id}, function (err, cartList) {
       res.json(cartList);
       console.log("inside the cart get method:")
       console.log(cartList);
   })//.then(cartList => res.json(cartList))
      // .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/add").post((req, res) => {

    let {productID : productID,
        userID : userID,
        item_price : item_price,
        item_discount : item_discount,
        discounted_price : discounted_price,
        item_size : item_size,
        item_color : item_color,
        requested_qty : requested_qty,
        quantities_id : quantities_id,
        selectedImage : selectedImage} = req.body;

  //  productId, userID, productPrice, discount, discountedPrice, selectedSize, selectedColor, quantity

    let all = new userCart({productID , userID , item_price, item_discount, discounted_price, item_size, item_color, requested_qty,quantities_id,selectedImage});

    all.save()
        .then(() => res.json('Add to Cart'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/delete/:id").delete((req, res) => {
    let id = req.params.id;
    //console.log("Product ID" +id);
    userCart.findByIdAndDelete({_id : id})
        .then(() => res.json('Remove form Cart'))
        .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;
