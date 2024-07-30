const mongoose = require("mongoose");
const itemsSchema = new mongoose.Schema({
    itemNameEnglish:{
        type:String,
        required:true,
        minLength:3,
        maxLength:25
    },
    itemNameArabic:{
        type:String,
        required:true,
        minLength:3,
        maxLength:25
    },
    itemDescArabic:{
        type:String,
        required:true,
        minLength:6,
       
        maxLength:200
       },
       itemDescEnglish:{
        type:String,
        required:true,
        minLength:6,
        maxLength:200
       },
       itemImage:{
        type:String,
        required:true,
        minLength:6,
        maxLength:200
       },
       itemCount:{
        type:Number,
        required:true,
   
       },
       itemActive:{
        type:Boolean,
        required:true,
        default:true
       },
       itemPrice:{
        type:Number,
        required:true,
     
       },
       itemDisCount:{
        type:Number,
        
       },
       itemCatId:{
        type:String,
        required:true,
        minLength:6,
        maxLength:100
       },
       itemLikesCount:{
        type:Number,
        required:true,
     
       },
       itemLikesArray:{
        type:Array,
        required:true,
       },
       itemCartCount:{
        type:Number,
        required:true,    
       },
       itemDate:{
        type:Date,
        default:Date.now(),
        required:true,    
       },
       itemNewPrice:{
        type:Number,
        required:true,
       
       },      
       itemImages:{
        type:Array,
        default:[]
       },
       vendorId:{
        type:String,
        maxLength:30
       }
   
});
const Item = mongoose.model("Item",itemsSchema);
module.exports = {Item};
