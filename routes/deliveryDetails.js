const router = require('express').Router();
let deliveryDetail = require('../models/deliveryDetails.model');

router.route('/').get((req, res)=>{
    deliveryDetail.find()
        .then(detils => res.json(detils))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/:id').get((req, res)=>{
    let id = req.params.id;
    deliveryDetail.find({userID: id}, function (err, details){
       // console.log(details);
        if (err) {
            console.log(err);
            res.status(400).json('Error: ' + err);
        }
        res.json(details);
    }).catch(err => res.status(400).json('Error: ' + err));


});


router.route("/add").post((req, res) => {

   // let jsonContent =  JSON.parse(req.body);

    let {userID : userID,
        fullName : fullName,
        phoneNo : phoneNo,
        province : province,
        district : district,
        city : city,
        address : address
    } = req.body;

    let allDetails = new deliveryDetail({userID, fullName, phoneNo, province, district, city, address});

    allDetails.save()
        .then(() => res.json('Add deliveryDetails'))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/update/:id').post((req, res) => {
    deliveryDetail.findById(req.params.id,function(err, details){
        if(!details)
            req.status(404).send("data is not found");
        else {
            details.userID = req.body.userID;
            details.fullName = req.body.fullName;
            details.phoneNo = req.body.phoneNo;
            details.province = req.body.updateProvince;
            details.district = req.body.district;
            details.city = req.body.city;
            details.address = req.body.address;

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
