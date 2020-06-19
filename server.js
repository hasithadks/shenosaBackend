const express = require('express');
const  cors = require('cors');
const  bodyParser = require('body-parser');
const mongoose =require('mongoose');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());

    const uri = process.env.ATLAS_URI;
    mongoose.connect(uri,{useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false });

    const connection = mongoose.connection;
    connection.once('open',() => {
        console.log("MongoDB database connection established successfully");
    }).catch(err => {
        console.error('App starting error:', err.stack);
        process.exit(1);
    });

const productRouter = require('./routes/products');
const quantityRouter = require('./routes/quantity');
const staffRouter = require('./routes/managementstaff');
const favouriteRouter = require('./routes/favouriteProduct');
const deliveryDetailsRouter = require('./routes/deliveryDetails');
const productCategoryRouter = require('./routes/productcategory');
const cartRouter = require('./routes/cart');
const userRouter = require('./routes/user');
const soldRouter = require('./routes/soldProducts');
const accountRouter = require('./routes/account');
const rateRouter = require('./routes/ratingProduts');

app.use('/products', productRouter);
app.use('/quantity', quantityRouter);
app.use('/mstaff', staffRouter);
app.use('/favouriteProduct', favouriteRouter);
app.use('/deliveryDetails', deliveryDetailsRouter);
app.use('/pcategory',productCategoryRouter);
app.use('/cart',cartRouter);
app.use('/users',userRouter);
app.use('/soldProducts',soldRouter);
app.use('/userAccounts',accountRouter);
app.use('/rateProducts',rateRouter);
// app.use('/uploads', express.static('/uploads'));

app.listen(port, () => {
    console.log(`Server is running on Port: ${port}`);
});

app.get('/*', (req, res) => {
    res.send("Backend Service");
});
