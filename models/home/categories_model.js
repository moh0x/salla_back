const mongoose = require("mongoose");
const categoriesSchema = new mongoose.Schema({
    categoryNameArabic:{
        type:String,
        required:true,
        minLength:3,
        maxLength:30
    },
    categoryName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:30
    },
   
       categoryImage:{
        type:String,
        required:true,
        minLength:6,
        maxLength:200
       },
       categoryDate:{
        type:Date,
        required:true,
       default:Date.now()
       },
   
});
const Category = mongoose.model("Category",categoriesSchema);
module.exports = {Category};