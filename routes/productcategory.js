const router = require('express').Router();
const ProductCategory = require('../models/productcategory.model');

router.route('/').get((req ,res) => {
    ProductCategory.find()
        .then( productcategory => res.json(productcategory))
        .catch(err => res.status(400).json('Error :'+err));
});

router.route('/add').post((req ,res) =>{
    const categoryname = req.body.categoryname;

    const newProductCategory = new ProductCategory({
        categoryname
    });

    newProductCategory.save()
        .then(()=> res.json('Product Category Added!'))
        .catch(err => res.status(400).json('Error :'+err));
});

router.route('/:id').get((req , res) =>{
    ProductCategory.findById(req.params.id)
        .then(productcategory => res.json(productcategory))
        .catch(err => res.status(400).json('Error :'+err));
});

router.route('/:id').delete((req ,res) =>{
    ProductCategory.findByIdAndDelete(req.params.id)
        .then(()=> res.json('Product Category Deleted!'))
        .catch(err => res.status(400).json('Error :'+err));
});

router.route('/update/:id').post((req , res) =>{
    ProductCategory.findById(req.params.id)
        .then(productcategory =>{
            productcategory.categoryname = req.body.categoryname;

            productcategory.save()
                .then(()=> res.json('Product Category Updated!'))
                .catch(err => res.status(400).json('Error :'+err));
        })
        .catch(err => res.status(400).json('Error :'+err));
});

module.exports = router;
