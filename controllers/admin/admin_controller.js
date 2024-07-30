const { Admin } = require("../../models/admin/admin_controller");

const gen = require("@codedipper/random-code");
var jwt = require('jsonwebtoken');
const { CourierClient } = require("@trycourier/courier");
const bcrypt = require("bcryptjs");
const {body,validationResult } = require("express-validator");
const httpsStatus = require('../../constants/https_status');
require('dotenv').config();
const getAdminInfo = async(req,res)=>{
  try {
   const token = req.headers.token;
   const admin = await Admin.findOne({token:token},{__v:false,password:false});  
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":admin});
   
  } catch (error) {
   res.status(400).json({"status":httpsStatus.ERROR,"message":"error"});
  }
}
 const loginFunc = async(req,res)=>{
 
  try {
     const admin = await Admin.findOne({email : req.body.email},{__v:false});
  const valid = validationResult (req);
  const passwordMatch = await bcrypt.compare(req.body.password,admin.password);
if (valid.isEmpty()) {
 if (admin) {
     if (passwordMatch == true) {      
             const adminRet = await Admin.findOne({email : req.body.email},{__v:false,password:false});
             const token = jwt.sign({ email: req.body.email,password:req.body.password }, process.env.TOKEN);
         const add =     await Admin.findByIdAndUpdate(adminRet.id,{$set:{
                token:token
             }});
             await add.save();
             const result = await Admin.findOne({token:token});
             res.status(200).json({"status":httpsStatus.SUCCESS,"data":result});       
     } else {
         res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"password not match"});
     }
    } else {
     res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"there is no admin with this email"});
    }
} else {
 res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"check your input"});
}
  } catch (error) {
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }

}
const sendResetCodeFunc = async(req,res)=>{
  try {
   const admin = await Admin.findOne({email:req.body.email},{__v:false,password:false,token:false});
   if (admin) {
               const resetPasswordCode = gen(5,"0123456789");
           await    Admin.findByIdAndUpdate(admin._id,{
                   $set:{
                       resetPasswordCode:resetPasswordCode
                   }
               });    
               const courier = new CourierClient(
                   { authorizationToken: `${process.env.EMAILTOKEN}`});
                 const { requestId } =  courier.send({
                   message: {
                     content: {
                       title: "reset password",
                       body: `your reset code is ${resetPasswordCode}`
                     },
                     to: {
                       email: `${admin.email}`
                     }
                   }
                 });
                
                 res.status(200).json({"status":httpsStatus.SUCCESS,"data":admin});
   } else {
       res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"we don't have admin with this email"});
   }
  } catch (error) {
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const resetPasswordFunc = async(req,res)=>{
  try {     
      const email = req.body.email;
      const admin = await Admin.findOne({email:email},{__v:false,password:false});
      const resetPasswordCode = req.body.resetPasswordCode;
      const password =await bcrypt.hash(req.body.password,10);
if (admin) {
if (resetPasswordCode == admin.resetPasswordCode && admin.resetPasswordCode != 0 ) {
  await Admin.findByIdAndUpdate(admin._id,{
      $set:{
          resetPasswordCode:0,
          password:password
      }
  });
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":admin});
} else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"verification code not match"});
}
} else {
  
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no admin"});
}
 
  } catch (error) {
    console.log(error);
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   
  }
}
 module.exports = {
  getAdminInfo,loginFunc,sendResetCodeFunc,resetPasswordFunc
 }