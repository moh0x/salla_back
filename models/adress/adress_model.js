const mongoose = require("mongoose");
const adressSchema = new mongoose.Schema({
    adressName:{
        type:String,
        required:true,
       
        maxLength:30
    },
    adressCity:{
        type:String,
        required:true,
        
        maxLength:30
    },
    adressMiniCipality:{
        type:String,
        required:true,
      
        maxLength:30
    },
    adressDistrict:{
        type:String,
        required:true,
        
        maxLength:50
    },
    adressUserId:{
        type:String,
        required:true,
    
        maxLength:30
    },
   
});
const Adress = mongoose.model("Adress",adressSchema);
module.exports = {Adress};