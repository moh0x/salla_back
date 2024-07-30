const express = require("express");
require('dotenv').config();
const port = process.env.PORT;
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const path = require("path")
var cors = require('cors');
app.use(cors());


app.use("/uploads",express.static(path.join(__dirname,"uploads")));
const userRoute = require('./routes/user_routes');
const categoryRoute = require('./routes/home/catgories_routes');
const bannerRoute = require('./routes/home/banners_routes');
const itemRoute = require('./routes/home/items_routes');
const favoriteRoute = require('./routes/favorites/favorites_routes');
const cartRoute = require('./routes/cart/cart_routes');
const adressRoute = require('./routes/adress/adress_routes');
const orderRoute = require('./routes/order/order_routes');
const adminRoute = require('./routes/admin/admin_routes');
const deliviryRoute = require('./routes/deliviry/deliviry_routes');
const vendorRoute = require('./routes/vendor/vendor_routes');
const vendorPayRoute = require('./routes/vendor pay/vendor_pay_routes');
const deliviryPayRoute = require('./routes/deliviry pay/deliviry_pay_routes');
const { log } = require("console");
app.use('/api/users/',userRoute);
app.use('/api/home/categories',categoryRoute);
app.use('/api/home/items',itemRoute);
app.use('/api/home/banners',bannerRoute);
app.use('/api/favorites',favoriteRoute);
app.use('/api/carts',cartRoute);
app.use('/api/adress',adressRoute);
app.use('/api/order',orderRoute);
app.use('/api/admin',adminRoute);
app.use('/api/deliviry',deliviryRoute);
app.use('/api/vendor',vendorRoute);
app.use('/api/vendorPay',vendorPayRoute);
app.use('/api/deliviryPay',deliviryPayRoute);

app.listen(port);
try {
      mongoose.connect(process.env.MONGODB);
      console.log("mongo db connected");
} catch (error) {
      console.log(error);
      console.log("mongo db error");
}
/*
      1) Install Courier SDK: npm install @trycourier/courier
      2) Make sure you allow ES module imports: Add "type": "module" to package.json file
      
      ; */
