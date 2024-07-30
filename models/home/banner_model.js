const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema({
    bannerName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:30
    },
       bannerImage:{
        type:String,
        required:true,
        minLength:6,
        maxLength:200
       },
   
});
const Banner = mongoose.model("Banner",bannerSchema);
module.exports = {Banner};