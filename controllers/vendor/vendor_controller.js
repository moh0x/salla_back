const { Vendor } = require("../../models/vendor/vendor_model");
const gen = require("@codedipper/random-code");
var jwt = require('jsonwebtoken');
const { CourierClient } = require("@trycourier/courier");
const bcrypt = require("bcryptjs");
const {body,validationResult } = require("express-validator");
const httpsStatus = require('../../constants/https_status');
const { Order } = require("../../models/order/order_model");
const { Item } = require("../../models/home/items_model");
require('dotenv').config();
const getVendorInfo = async(req,res)=>{
  try {
   const token = req.headers.token;
   const vendor = await Vendor.findOne({token:token},{__v:false,password:false});  
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":vendor});
   
  } catch (error) {
   res.status(400).json({"status":httpsStatus.ERROR,"message":"error"});
  }
}
const registerFunc = async(req,res)=>{
    try {
     const email = await Vendor.findOne({email : req.body.email});
     const valid = validationResult (req)
    if (valid.isEmpty()) {
     if (!email) {
         const token = jwt.sign({ email: req.body.email,password:req.body.password }, process.env.TOKEN);
         const verifyCode = gen(5,"0123456789");
         var password =await  bcrypt.hash(req.body.password,10)
         const vendor =  new Vendor({
             userName:req.body.userName,
             token:token,
             email:req.body.email,
             password:password,
             phone:req.body.phone,
             verifyCode:verifyCode,
     resetPasswordCode:0,
     isAgree:true,        
             isVerify:false,
             sales:0,
             salesTax:0,
             myFreeSales:0
     });
         await vendor.save();
         const newVendor= await Vendor.findOne({email : req.body.email},{__v:false,password:false});
       const courier = new CourierClient(
         { authorizationToken: `${process.env.EMAILTOKEN}`});
 
       const { requestId } =  courier.send({
         message: {
           content: {
             title: "confirm your email",
             body: `your verification code is ${verifyCode}`
           },
           to: {
             email: `${newVendor.email}`
           }
         }
       });
         res.status(200).json({"status":httpsStatus.SUCCESS,"data":newVendor});
        } else {
         res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"user already exist"});
        }
    }
    else {
     res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"check your input"});
    }
    } catch (error) {
        console.log(error);
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
     
    }
 }
 const loginFunc = async(req,res)=>{
   
  try {
     const vendor = await Vendor.findOne({email : req.body.email},{__v:false});
  const valid = validationResult (req);
  const passwordMatch = await bcrypt.compare(req.body.password,vendor.password);
  
if (valid.isEmpty()) {
 if (vendor) {
     if (passwordMatch == true) {
         if (vendor.isVerify) {
             const vendorRet = await Vendor.findOne({email : req.body.email},{__v:false,password:false});
             res.status(200).json({"status":httpsStatus.SUCCESS,"data":vendorRet});
         } else {
             const vendorRet = await Vendor.findOne({email : req.body.email},{__v:false,password:false});
             const verifyCode = gen(5,"0123456789");
            await Vendor.findByIdAndUpdate(vendorRet._id,{
                 $set:{
                     verifyCode:verifyCode
                 }
             })
             
             const courier = new CourierClient(
                 { authorizationToken: `${process.env.EMAILTOKEN}`});
               const { requestId } =  courier.send({
                 message: {
                   content: {
                     title: "confirm your email",
                     body: `your verification code is ${verifyCode}`
                   },
                   to: {
                     email: `${vendorRet.email}`
                   }
                 }
               });
               res.status(200).json({"status":httpsStatus.SUCCESS,"data":vendorRet});
         }
     } else {
         res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"password not match"});
     }
    } else {
     res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"there is no user with this email"});
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
   const vendor = await Vendor.findOne({email:req.body.email},{__v:false,password:false,token:false});
   if (vendor) {
               const resetPasswordCode = gen(5,"0123456789");
           await    Vendor.findByIdAndUpdate(vendor._id,{
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
                       email: `${vendor.email}`
                     }
                   }
                 });
                
                 res.status(200).json({"status":httpsStatus.SUCCESS,"data":vendor});
   } else {
       res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"we don't have user with this email"});
   }
  } catch (error) {
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const resetPasswordFunc = async(req,res)=>{
  try {     
      const email = req.body.email;
      const vendor = await Vendor.findOne({email:email},{__v:false,password:false,token:false});
      const resetPasswordCode = req.body.resetPasswordCode;
      const password =await bcrypt.hash(req.body.password, 10);
if (vendor) {
if (resetPasswordCode == vendor.resetPasswordCode && vendor.resetPasswordCode != 0 ) {
  await Vendor.findByIdAndUpdate(vendor._id,{
      $set:{
          isVerify:true,
          verifyCode:0,
          resetPasswordCode:0,
          password:password
      }
  });
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":vendor});
} else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"verification code not match"});
}
} else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no user"});
}
 
  } catch (error) {

      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   
  }
}
const confirmAccountFunc = async(req,res)=>{
  try {     
      const token = req.headers.token;
      const vendor = await Vendor.findOne({token:token},{__v:false,password:false,token:false});
      const verifyCode = req.body.verifyCode;
if (vendor) {
if (verifyCode == vendor.verifyCode && vendor.verifyCode != 0 ) {
  await Vendor.findByIdAndUpdate(vendor._id,{
      $set:{
          isVerify:true,
          verifyCode:0,
          resetPasswordCode:0,
      }
  });
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":vendor});
} else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"verification code not match"});
}
} else {
  res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no user"});
}
 
  } catch (error) {
      res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   
  }
}
const getAllVendorsAgreeAdmin =  async(req,res)=>{
  try {
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
    const vendors = await Vendor.find({isAgree:true},{password:false,token:false}).limit(limit).skip(skip);
   
   res.status(200).json({"status":httpsStatus.SUCCESS,"data":vendors}); 
   } catch (error) {
    console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"
    }); 
   }
}
const getAllVendorsNotAgreeAdmin =  async(req,res)=>{
   try {
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
    const vendors = await Vendor.find({isAgree:false},{password:false,token:false}).limit(limit).skip(skip);
    
   res.status(200).json({"status":httpsStatus.SUCCESS,"data":vendors}); 
   } catch (error) {
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"
    }); 
   }
}
const changeVendorStatusAdmin = async(req,res)=>{  try {
   const vendorId = req.body.vendorId;
   const vendorSer = await Vendor.findById(vendorId);
 if (vendorSer) {
   const agree = vendorSer.isAgree;
   const vendorSerAgree = !agree;
 const vendor = await Vendor.findByIdAndUpdate(vendorId,{
   $set:{
      isAgree:vendorSerAgree
   }
 });
 if (vendorSerAgree == false) {
  const items = await Item.find({vendorId:vendorId});
  for (let index = 0; index < items.length; index++) {
 const item =   await Item.findByIdAndUpdate(items[index].id,{
    $set:{
      itemActive:false
    }
   })
    await item.save();
  }
 }
 await vendor.save();
 
       
 const vendorRet = await Vendor.findById(vendorId);
 res.status(200).json({"status":httpsStatus.SUCCESS,"data":vendorRet});
 } else {
   res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no user"});
 }
} catch (error){
console.log(error);
 res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
}}
const deletevendorAdmin = async(req,res)=>{
   try {
      const vendorId = req.body.vendorId;
      const vendorSer = await Vendor.findById(vendorId);
    if (vendorSer) {
      const orders = await Order.find({orderVendorId:vendorId});
      for (let index = 0; index < orders.length; index++) {
        if (orders[index].orderStatusId == "order by user" || orders[index].orderStatusId == "agree" || orders[index].orderStatusId == "not agree"  ) {
         await Order.findByIdAndDelete(orders[index].id);
        }
       }  
       const items = await Item.find({vendorId:vendorId});
       for (let index = 0; index < items.length; index++) {
         await Item.findByIdAndDelete(items[index].id);
         
       }
    const vendor = await Vendor.findByIdAndDelete(vendorId);
      const courier = new CourierClient(
                 { authorizationToken:  `${process.env.EMAILTOKEN}`});
               const { requestId } =  courier.send({
                 message: {
                   content: {
                     title: "delete account",
                     body: `we have delete your account`
                   },
                   to: {
                     email: `${vendor.email}`
                   }
                 }
               });
    res.status(200).json({"status":httpsStatus.SUCCESS});
    } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no user"});
    }
   } catch (error){
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const deleteFunc = async(req,res)=>{
   
  try {
    const token = req.headers.token;
     const vendor = await Vendor.findOne({token:token});
  const valid = validationResult (req);
  const passwordMatch = await bcrypt.compare(req.body.password,vendor.password);
if (valid.isEmpty()) {
 if (vendor) {
     if (passwordMatch == true) {  
      const orders = await Order.find({orderVendorId:vendor.id});
      for (let index = 0; index < orders.length; index++) {
       if (orders[index].orderStatusId == "order by user" || orders[index].orderStatusId == "agree" || orders[index].orderStatusId == "not agree"  ) {
        await Order.findByIdAndDelete(orders[index].id);
       }
      }     
      const items = await Item.find({vendorId:vendor.id});
      for (let index = 0; index < items.length; index++) {
        await Item.findByIdAndDelete(items[index].id);
        
      }
             await Vendor.findByIdAndDelete(vendor.id);      
             const courier = new CourierClient(
                 { authorizationToken:  `${process.env.EMAILTOKEN}`});
               const { requestId } =  courier.send({
                 message: {
                   content: {
                     title: "delete account",
                     body: `your account hase been deleted`
                   },
                   to: {
                     email: `${vendor.email}`
                   }
                 }
               });
               res.status(200).json({"status":httpsStatus.SUCCESS,"data":"success"});
         }  
    } else {
     res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"there is no user with this email"});
    }
} else {
 res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"check your input"});
}
  } catch (error) {
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }

}
 module.exports = {
  registerFunc,loginFunc,sendResetCodeFunc,resetPasswordFunc,confirmAccountFunc,getVendorInfo,deletevendorAdmin,changeVendorStatusAdmin,getAllVendorsAgreeAdmin,getAllVendorsNotAgreeAdmin,deleteFunc
 }
