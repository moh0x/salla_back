const mongoose = require("mongoose");
const vendorPaySchema = new mongoose.Schema({
    vendorPayDate:{
        type:Date,
        required:true,
        default:Date.now()
    },
    vendorPayVendorId:{
        type:String,
        required:true,
        minLength:3,
        maxLength:30
    },
    vendorPayallMoney:{
        type:Number,
       
    },
    vendorPayataxMoney:{
        type:Number,
      
    },
    vendorPaySalesMoney:{
        type:Number,
        
    },
    vendorPayUserName:{
        type:String,
        required:true,
        maxLength:30,
        minLength:3
    },
    vendorPayPhone:{
        type:String,
        required:true,
        maxLength:30,
        minLength:3
    },
    vendorPayEmail:{
        type:String,
        required:true,
        maxLength:50,
        minLength:3
    }
   
});
const  VendorPay = mongoose.model("VendorPay",vendorPaySchema);
module.exports = {VendorPay};