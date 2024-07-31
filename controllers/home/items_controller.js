const { Item } = require("../../models/home/items_model");
const httpsStatus = require('../../constants/https_status');
const multer = require('multer');
const { upload } = require("./categories_controller");
const { Vendor } = require("../../models/vendor/vendor_model");
require('dotenv').config();
const getAllItems = async(req,res)=>{
    try {
     var token =  req.headers.token;
     const items = await Item.find();
     res.status(200).json({"status":httpsStatus.SUCCESS,"data":items});
    } catch (error){
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
    }
 }
 const getLikesItems = async(req,res)=>{
   try {
    var token =  req.headers.token;
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
    const items = await Item.find({itemActive:true}).sort({itemLikesCount:-1}).limit(limit).skip(skip);
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":items});
   } catch (error){
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const getCartItems = async(req,res)=>{
   try {
    var token =  req.headers.token;
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
    const items = await Item.find({itemActive:true}).sort({itemCartCount:-1}).limit(limit).skip(skip);
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":items});
   } catch (error){
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const getLatestItems = async(req,res)=>{
   try {
    var token =  req.headers.token;
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
    const items = await Item.find({itemActive:true}).sort({itemDate:-1}).limit(limit).skip(skip);
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":items});
   } catch (error){
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
 const getSearchItems = async(req,res)=>{
   try {
      const limit = 15;
      const page = req.body.page || 1;
      const skip = (page - 1) * limit;
    var token =  req.headers.token;
    var textItem = req.body.textItem;
    const regex =new RegExp(textItem,'i');
    const items = await Item.find({
     $or:[
      {itemNameArabic:regex},{itemNameEnglish:regex}
     ],
     itemActive:true
    
    }).sort({itemDate:-1}).limit(limit).skip(skip);
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":items});
   } catch (error){
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const getLatestItemsVerifyAdmin = async(req,res)=>{
   try {
    var token =  req.headers.token;
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
    const items = await Item.find({itemActive:true}).sort({itemDate:-1}).limit(limit).skip(skip);
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":items});
   } catch (error){
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const getLatestItemsNotVerifyAdmin = async(req,res)=>{
   try {
    var token =  req.headers.token;
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
    const items = await Item.find({itemActive:false}).sort({itemDate:-1}).limit(limit).skip(skip);
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":items});
   } catch (error){
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const changeItemStatusAdmin = async(req,res)=>{
   try {
      const itemId = req.body.itemId;
      const itemSer = await Item.findById(itemId);
    if (itemSer) {
      const active = itemSer.itemActive;
      const itemSerActive = !active;
    const item = await Item.findByIdAndUpdate(itemId,{
      $set:{
         itemActive:itemSerActive
      }
    });
    await item.save();
    const itemRet = await Item.findById(itemId);
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":itemRet});
    } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no item"});
    }
   } catch (error){
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const deleteItemAdmin = async(req,res)=>{
   try {
      const itemId = req.body.itemId;
      const itemSer = await Item.findById(itemId);
    if (itemSer) {
    const item = await Item.findByIdAndDelete(itemId);
    res.status(200).json({"status":httpsStatus.SUCCESS});
   
    } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no item"});
    }
   } catch (error){
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
var itemLink ;
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, 'uploads');
   
   },
   filename: (req, file, cb) => {
    const a = Date.now() + '-' + file.originalname;
     cb(null,a);
       itemLink = `${process.env.IMAGELINK}/${a}`
   },
   
 });
 
 const iUpload = multer({
   storage: storage,
   limits: { fileSize: 5000000 }, 
   fileFilter: (req, file, cb) => {
     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      
       cb(null, true);
     } else {
       cb(new Error('Invalid file type'));
     }}
 });
const addImage = async(req,res)=>{
 try {
   if (itemLink != undefined) {
      res.status(200).json({"status":httpsStatus.SUCCESS,"data":itemLink});
      
   } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"image not upload"});
   }
 } catch (error) { 
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   
 }
}
 const addProduct = async(req,res)=>{
 try {
   const token = req.headers.token;
   const vendor = await Vendor.findOne({token:token});
   const item = new Item({
      itemNameArabic:req.body.itemNameArabic,
      itemNameEnglish:req.body.itemNameEnglish,
      itemDescArabic:req.body.itemDescArabic,
      itemDescEnglish:req.body.itemDescEnglish,
      itemImage:req.body.itemLink,
      itemCount:0,
      itemActive:false,
      itemPrice:req.body.itemPrice,
      itemDisCount:req.body.itemDisCount == null ? 0 : req.body.itemDisCount,
      itemCatId:req.body.itemCatId,
      itemLikesCount:0,
      itemLikesArray:[],
      itemCartCount:0,
      itemDate:Date.now(),
      itemNewPrice:req.body.itemDisCount == null ? 0 : (req.body.itemPrice * (req.body.itemDisCount /100)).toFixed(),
      itemCity:vendor.vendorCity,
      itemMiniCipality:vendor.vendorMiniCipality,
      itemDistrict:vendor.vendorDistrict,
      vendorId:vendor.id
   });
   await item.save();
   res.status(200).json({"status":httpsStatus.SUCCESS,"data":item});
 } catch (error) {
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
 }
    
 }
 const getLatestItemsVerifyVendor = async(req,res)=>{
   try {
    var token =  req.headers.token;
    const vendor = await Vendor.findOne({token:token});
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
    const items = await Item.find({itemActive:true,vendorId:vendor.id}).sort({itemDate:-1}).limit(limit).skip(skip);
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":items});
   } catch (error){
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const getLatestItemsNotVerifyVendor = async(req,res)=>{
   try {
    var token =  req.headers.token;
    const vendor = await Vendor.findOne({token:token});
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
    const items = await Item.find({itemActive:false,vendorId:vendor.id}).sort({itemDate:-1}).limit(limit).skip(skip);
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":items});
   } catch (error){
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}

const deleteItemVendor = async(req,res)=>{
   try {
      const itemId = req.body.itemId;
      const itemSer = await Item.findById(itemId);
      const token = req.headers.token;
      const vendor = await Vendor.findOne({token:token});
    if (itemSer) {
    if (itemSer.vendorId == vendor.id) {
      const item = await Item.findByIdAndDelete(itemId);
      res.status(200).json({"status":httpsStatus.SUCCESS});
    } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no permission"});
    }
   
    } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no item"});
    }
   } catch (error){
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   }
}
const verifyAddP=async (req, res, next)=> {
    var token = req.headers.token;
    const vendor = await Vendor.findOne({token:token});
    const items = await Item.find({vendorId:vendor.id});
    if (items.length <= 100) {
      res.status(200).send({ "success": false, "data": true});
    } else {
      res.status(400).send({ "success": false, "message": "max 100" });
    }
  }
 module.exports = {
    getAllItems,getSearchItems,getLikesItems,getCartItems,getLatestItems,deleteItemAdmin,changeItemStatusAdmin,getLatestItemsNotVerifyAdmin,getLatestItemsVerifyAdmin,addProduct,iUpload,addImage,getLatestItemsVerifyVendor,getLatestItemsNotVerifyVendor,deleteItemVendor,verifyAddP
   }
