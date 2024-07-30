const { Deliviry } = require("../../models/deliviry/deliviry_model");

const gen = require("@codedipper/random-code");
var jwt = require('jsonwebtoken');
const { CourierClient } = require("@trycourier/courier");
const bcrypt = require("bcryptjs");
const {body,validationResult } = require("express-validator");
const httpsStatus = require('../../constants/https_status');
const { Vendor } = require("../../models/vendor/vendor_model");
const { Order } = require("../../models/order/order_model");
require('dotenv').config();
const getDeliviryInfo = async(req,res)=>{
  try {
   const token = req.headers.token;
   const deliviry = await Deliviry.findOne({token:token},{__v:false,password:false});  
       res.status(200).json({"status":httpsStatus.SUCCESS,"data":deliviry});
   
  } catch (error) {
   res.status(400).json({"status":httpsStatus.ERROR,"message":"error"});
  }
}
const registerFunc = async(req,res)=>{
    try {
     const email = await Deliviry.findOne({email : req.body.email});
     const valid = validationResult (req)
    if (valid.isEmpty()) {
     if (!email) {
         const token = jwt.sign({ email: req.body.email,password:req.body.password }, process.env.TOKEN);
         const verifyCode = gen(5,"0123456789");
         var password =await  bcrypt.hash(req.body.password,process.env.PASSHASH)
         const deliviry =  new Deliviry({
             userName:req.body.userName,
             token:token,
             email:req.body.email,
             password:password,
             phone:req.body.phone,
             verifyCode:verifyCode,
     resetPasswordCode:0,
     isAgree:false,
     isVerify:false,
     shipping:0,
     shippingTax:0,
     myFreeShipping:0, 
             
     });
         await deliviry.save();
         const newDeliviry = await Deliviry.findOne({email : req.body.email},{__v:false,password:false});
       const courier = new CourierClient(
         { authorizationToken: `${process.env.EMAILTOKEN}`});
 
       const { requestId } =  courier.send({
         message: {
           content: {
             title: "confirm your email",
             body: `your verification code is ${verifyCode}`
           },
           to: {
             email: `${newDeliviry.email}`
           }
         }
       });
         res.status(200).json({"status":httpsStatus.SUCCESS,"data":newDeliviry});
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
     const deliviry = await Deliviry.findOne({email : req.body.email},{__v:false});
  const valid = validationResult (req);
  const passwordMatch = await bcrypt.compare(req.body.password,deliviry.password);
  
if (valid.isEmpty()) {
 if (deliviry) {
     if (passwordMatch == true) {
         if (deliviry.isVerify) {
             const deliviryRet = await Deliviry.findOne({email : req.body.email},{__v:false,password:false});
             res.status(200).json({"status":httpsStatus.SUCCESS,"data":deliviryRet});
         } else {
             const deliviryRet = await Deliviry.findOne({email : req.body.email},{__v:false,password:false});
             const verifyCode = gen(5,"0123456789");
            await Vendor.findByIdAndUpdate(deliviryRet._id,{
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
                     email: `${deliviryRet.email}`
                   }
                 }
               });
               res.status(200).json({"status":httpsStatus.SUCCESS,"data":deliviryRet});
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
   const deliviry = await Deliviry.findOne({email:req.body.email},{__v:false,password:false,token:false});
   if (deliviry) {
               const resetPasswordCode = gen(5,"0123456789");
           await    Deliviry.findByIdAndUpdate(deliviry._id,{
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
                       email: `${deliviry.email}`
                     }
                   }
                 });
                
                 res.status(200).json({"status":httpsStatus.SUCCESS,"data":deliviry});
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
      const deliviry = await Deliviry.findOne({email:email},{__v:false,password:false,token:false});
      const resetPasswordCode = req.body.resetPasswordCode;
      const password =await bcrypt.hash(req.body.password,process.env.PASSHASH);
if (deliviry) {
if (resetPasswordCode == deliviry.resetPasswordCode && deliviry.resetPasswordCode != 0 ) {
  await Deliviry.findByIdAndUpdate(deliviry._id,{
      $set:{
          isVerify:true,
          verifyCode:0,
          resetPasswordCode:0,
          password:password
      }
  });
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":deliviry});
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
      const deliviry = await Deliviry.findOne({token:token},{__v:false,password:false,token:false});
      const verifyCode = req.body.verifyCode;
if (deliviry) {
if (verifyCode == deliviry.verifyCode && deliviry.verifyCode != 0 ) {
  await Deliviry.findByIdAndUpdate(deliviry._id,{
      $set:{
          isVerify:true,
          verifyCode:0,
          resetPasswordCode:0,
      }
  });
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":deliviry});;
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
const getAllDeliviriesAgreeAdmin =  async(req,res)=>{
   try {
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
    const deliviries = await Deliviry.find({isAgree:true},{token:false,password:false}).limit(limit).skip(skip);
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":deliviries}); 

   } catch (error) {
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"
    }); 
   }
}
const getAllDeliviriesNotAgreeAdmin =  async(req,res)=>{
    try {
     const limit = 15;
     const page = req.body.page || 1;
     const skip = (page - 1) * limit;
     const deliviries = await Deliviry.find({isAgree:false},{token:false,password:false}).limit(limit).skip(skip);
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":deliviries}); 
    } catch (error) {
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"
     }); 
    }
 }
const changeDeliviryStatusAdmin = async(req,res)=>{  try {
    const deliviryId = req.body.deliviryId;
    const delivirySer = await Deliviry.findById(deliviryId);
  if (delivirySer) {
    const agree = delivirySer.isAgree;
    const delivirySerAgree = !agree;
  const deliviry = await Deliviry.findByIdAndUpdate(deliviryId,{
    $set:{
       isAgree:delivirySerAgree
    }
  });
  if (delivirySerAgree == false) {
    const orders = await Order.find({orderDeliviryId:deliviryId,orderStatusId:"deliviry"});
    for (let index = 0; index < orders.length; index++) {
      const newOrder =   await Order.findByIdAndUpdate(orders[index].id,{
        $set:{
          orderStatusId:"agree",
          orderDeliviryEmail:" ",
          orderDeliviryId:" ",
          orderDeliviryName:" ",
          orderDeliviryPhone:" "
        }
      });
      await newOrder.save();
    }
  }
  await deliviry.save();
  const deliviryRet = await Deliviry.findById(deliviryId);
  res.status(200).json({"status":httpsStatus.SUCCESS,"data":deliviryRet});
  } else {
    res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no user"});
  }
 } catch (error){

  res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
 }}
 const deleteDeliviryAdmin = async(req,res)=>{
    try {
       const deliviryId = req.body.deliviryId;
       const delivirySer = await Deliviry.findById(deliviryId);
     if (delivirySer) {
      const orders = await Order.find({orderDeliviryId:deliviryId,orderStatusId:"deliviry"});
      for (let index = 0; index < orders.length; index++) {
        const newOrder =   await Order.findByIdAndUpdate(orders[index].id,{
          $set:{
            orderStatusId:"agree",
            orderDeliviryEmail:" ",
            orderDeliviryId:" ",
            orderDeliviryName:" ",
            orderDeliviryPhone:" "
          }
        });
        await newOrder.save();
      }     
     const deliviry = await Deliviry.findByIdAndDelete(deliviryId);
     const courier = new CourierClient(
      { authorizationToken: `${process.env.EMAILTOKEN}`});
    const { requestId } =  courier.send({
      message: {
        content: {
          title: "delete account",
          body: `we have delete your account`
        },
        to: {
          email: `${deliviry.email}`
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
     const deliviry = await Deliviry.findOne({token:token});
  const valid = validationResult (req);
  const passwordMatch = await bcrypt.compare(req.body.password,deliviry.password);
if (valid.isEmpty()) {
 if (deliviry) {
     if (passwordMatch == true) {  
      const orders = await Order.find({orderDeliviryId:deliviry.id,orderStatusId:"deliviry"});
      for (let index = 0; index < orders.length; index++) {
        const newOrder =   await Order.findByIdAndUpdate(orders[index].id,{
          $set:{
            orderStatusId:"agree",
            orderDeliviryEmail:" ",
            orderDeliviryId:" ",
            orderDeliviryName:" ",
            orderDeliviryPhone:" "
          }
        });
        await newOrder.save();
      }     
             await Deliviry.findByIdAndDelete(deliviry.id);      
             const courier = new CourierClient(
                 { authorizationToken: `${process.env.EMAILTOKEN}`});
               const { requestId } =  courier.send({
                 message: {
                   content: {
                     title: "delete account",
                     body: `your account hase been deleted`
                   },
                   to: {
                     email: `${deliviry.email}`
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
  registerFunc,loginFunc,sendResetCodeFunc,resetPasswordFunc,confirmAccountFunc,getDeliviryInfo,getAllDeliviriesAgreeAdmin,getAllDeliviriesNotAgreeAdmin,changeDeliviryStatusAdmin,deleteDeliviryAdmin,deleteFunc
 }