const mongoose = require("mongoose");
const vendorSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:30
    },
    email:{
        type:String,
        required:true,
        minLength:6,
        maxLength:50
    },
    phone:{
        type:String,
        required:true,
        minLength:10,
        maxLength:11
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:100
    },
    verifyCode:{
        type:String,
        maxLength:6,
        default:0
    },
    resetPasswordCode:{
        type:String,
        maxLength:6,
        default:0
    },
    token:{
        type:String,
        default:null
    },
    isVerify:{
        type:Boolean,
        default:false
    },
    isAgree:{
        type:Boolean,
        default:false
    },
    sales:{
        type:Number,
        required:true,
        default:0
    },
    salesTax:{ type:Number,
        required:true,
        default:0},
    myFreeSales:{ type:Number,
        required:true,
        default:0},
        vendorCity:{
            type:String,
        },
        vendorMiniCipality:{
            type:String
        },
        vendorDistrict:{
            type:String
        }
        
});
const Vendor = mongoose.model("Vendor",vendorSchema);
module.exports = {Vendor};