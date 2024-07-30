const { VendorPay } = require("../../models/vendor pay/vendor_pay_model");
const { Vendor } = require("../../models/vendor/vendor_model");
const httpsStatus = require('../../constants/https_status');
const { CourierClient } = require("@trycourier/courier");
const { Deliviry } = require("../../models/deliviry/deliviry_model");
const { DeliviryPay } = require("../../models/deliviry pay/deliviry_pay_model");
require('dotenv').config();
const addDeliviryPay = async(req,res)=>{
  try {
    const deliviry = await Deliviry.findById(req.body.deliviryId);
    if (deliviry) {
        if (deliviry.myFreeShipping != 0) {
            const deliviryPay = new DeliviryPay({
                deliviryPayallMoney:deliviry.shipping,
                deliviryrPayataxMoney:deliviry.shippingTax,
                deliviryPayShippingMoney:deliviry.myFreeShipping,
                deliviryPayDate:Date.now(),
                deliviryPayDeliviryId:deliviry.id,
                deliviryPayEmail:deliviry.email,
                deliviryPayPhone:deliviry.phone,
                deliviryPayUserName:deliviry.userName
            });
           
            const courier = new CourierClient(
                { authorizationToken: `${process.env.EMAILTOKEN}`});
        
              const { requestId } =  courier.send({
                message: {
                  content: {
                    title: "payment",
                    body: `your have recived ${deliviry.myFreeShipping} Da`
                  },
                  to: {
                    email: `${deliviry.email}`
                  }
                }
              });
              const newDeliviry =await Deliviry.findByIdAndUpdate(req.body.deliviryId,{
                $set:{
                    shipping:0,
                    myFreeShipping:0,
                    shippingTax:0
                }
              })
              await newDeliviry.save();
            res.status(200).json({"status":httpsStatus.SUCCESS,"data":deliviryPay});
        } else {
            res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"money 0"});
        }
    } else {
        res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no delivry exist"});
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const deleteDeliviryPay = async (req,res)=>{
  try {
    const deliviryPay = await DeliviryPay.findById(req.body.deliviryPayId);
    if (deliviryPay) {
        await DeliviryPay.findByIdAndDelete(req.body.deliviryPayId);
        res.status(200).json({"status":httpsStatus.SUCCESS});
    } else {
        res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no deliviry pay exist"});
    }
  } catch (error) {
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const getAllDeliviriesPays = async(req,res)=>{
    try {
        const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
    const deliviryPay = await DeliviryPay.find().sort({deliviryPayDate:-1}).limit(limit).skip(skip);
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":deliviryPay});
    } catch (error) {
        res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
    }

}
module.exports = {
    addDeliviryPay,deleteDeliviryPay,getAllDeliviriesPays
}