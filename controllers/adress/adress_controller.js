const { isObjectIdOrHexString } = require('mongoose');
const httpsStatus = require('../../constants/https_status');
const { Adress } = require('../../models/adress/adress_model');
const { User } = require('../../models/user_model');
const { ObjectId } = require('mongodb');
const getMyAdresses = async(req,res)=>{
    try {
     var token =  req.headers.token;
     const user = await User.findOne({token:token});
     const adreses = await Adress.find({adressUserId:user._id},{adressUserId:false});
     res.status(200).json({"status":httpsStatus.SUCCESS,"data":adreses});
    } catch (error){
      console.log(error);
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
    }
 }
 const deleteAdress = async(req,res)=>{
    try {
     var token =  req.headers.token;
     const user = await User.findOne({token:token});
     const _id = new ObjectId(req.body.adressId);
     const adress = await Adress.findById(_id);
     if (adress.adressUserId == user._id) {
         await Adress.findByIdAndDelete(req.body.adressId);
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":"success"});
     } else {
        res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"you don't have permission"}); 
     }
    } catch (error){
      console.log(error);
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
    }
 }
 const verifyAddAdressCon=async (req, res)=> {
    var token = req.headers.token;
    const user = await User.findOne({token:token});
    const adresses = await Adress.find({adressUserId:user.id});
    if (adresses.length < 5) {
        res.status(200).json({"status":httpsStatus.SUCCESS});
    } else {
      res.status(400).send({ "success": false, "message": "max 100" });
    }
  }
 const addAdress = async(req,res)=>{
    try {
     var token =  req.headers.token;
     const user = await User.findOne({token:token});
     const adreses = await Adress.find({adressUserId:user._id},{adressUserId:false});
    if(adreses.length >= 5){
        res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"5 adreses max"}); 
    }
    else{
        const adress =  new Adress(
            {
                adressName:req.body.adressName,
                adressCity:req.body.adressCity,
                adressDistrict:req.body.adressDistrict,
                adressMiniCipality:req.body.adressMiniCipality,
                adressUserId:user._id
            }
        );
        await adress.save();
        res.status(200).json({"status":httpsStatus.SUCCESS,"data":adreses}); 
    }
    } catch (error){
      console.log(error);
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
    }
 }
 module.exports = {
    getMyAdresses,addAdress,deleteAdress,verifyAddAdressCon
   }