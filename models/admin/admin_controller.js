const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        minLength:6,
        maxLength:50
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:100
    },
    token:{
        type:String,
        default:null
    },
    resetPasswordCode:{
        type:String,
        maxLength:6,
        default:0
    },
});
const Admin = mongoose.model("Admin",adminSchema);
module.exports = {Admin};