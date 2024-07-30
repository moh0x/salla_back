const mongoose = require("mongoose");
const deliviryPaySchema = new mongoose.Schema({
    deliviryPayDate:{
        type:Date,
        required:true,
        default:Date.now()
    },
    deliviryPayDeliviryId:{
        type:String,
        required:true,
        minLength:3,
        maxLength:30
    },
    deliviryPayallMoney:{
        type:Number,
       
    },
    deliviryrPayataxMoney:{
        type:Number,
      
    },
    deliviryPayShippingMoney:{
        type:Number,
        
    },
    deliviryPayUserName:{
        type:String,
        required:true,
        maxLength:30,
        minLength:3
    },
    deliviryPayPhone:{
        type:String,
        required:true,
        maxLength:30,
        minLength:3
    },
    deliviryPayEmail:{
        type:String,
        required:true,
        maxLength:50,
        minLength:3
    }
   
});
const  DeliviryPay = mongoose.model("DeliviryPay",deliviryPaySchema);
module.exports = {DeliviryPay};