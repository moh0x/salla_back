const { VendorPay } = require("../../models/vendor pay/vendor_pay_model");
const { Vendor } = require("../../models/vendor/vendor_model");
const httpsStatus = require('../../constants/https_status');
const { CourierClient } = require("@trycourier/courier");
require('dotenv').config();
const addVendorPay = async(req,res)=>{
  try {
    const vendor = await Vendor.findById(req.body.vendorId);
    if (vendor) {
        if (vendor.myFreeSales != 0) {
            const vendorPay = new VendorPay({
                vendorPayallMoney:vendor.sales,
                vendorPayataxMoney:vendor.salesTax,
                vendorPaySalesMoney:vendor.myFreeSales,
                vendorPayDate:Date.now(),
                vendorPayVendorId:vendor.id,
                vendorPayEmail:vendor.email,
                vendorPayPhone:vendor.phone,
                vendorPayUserName:vendor.userName
            });
           
            const courier = new CourierClient(
                { authorizationToken: process.env.EMAILTOKEN});
        
              const { requestId } =  courier.send({
                message: {
                  content: {
                    title: "payment",
                    body: `your have recived ${vendor.myFreeSales} Da`
                  },
                  to: {
                    email: `${vendor.email}`
                  }
                }
              });
              const newVendor =await Vendor.findByIdAndUpdate(req.body.VendorId,{
                $set:{
                    sales:0,
                    myFreeSales:0,
                    salesTax:0
                }
              })
              await newVendor.save();
            res.status(200).json({"status":httpsStatus.SUCCESS,"data":vendorPay});
        } else {
            res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"money 0"});
        }
    } else {
        res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no vendor exist"});
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const deleteVendorPay = async (req,res)=>{
  try {
    const vendorPay = await VendorPay.findById(req.body.vendorPayId);
    if (vendorPay) {
        await VendorPay.findByIdAndDelete(req.body.vendorPayId);
        res.status(200).json({"status":httpsStatus.SUCCESS});
    } else {
        res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no vendor pay exist"});
    }
  } catch (error) {
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const getAllVendorsPays = async(req,res)=>{
    try {
        const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
    const vendorsPay = await VendorPay.find().sort({vendorPayDate:-1}).limit(limit).skip(skip);
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":vendorsPay});
    } catch (error) {
        res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
    }

}
module.exports = {
    addVendorPay,deleteVendorPay,getAllVendorsPays
}