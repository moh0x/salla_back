const httpsStatus = require('../../constants/https_status');
const {Banner} = require('../../models/home/banner_model');
const multer = require('multer');
require('dotenv').config();
const getAllBanners = async(req,res)=>{
    try {
     var token =  req.headers.token;
     const banners = await Banner.find();
     res.status(200).json({"status":httpsStatus.SUCCESS,"data":banners});
    } catch (error){
      console.log(error);
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
    }
 }
 const getAllBannersAdmin = async(req,res)=>{
  try {
   var token =  req.headers.token;
   const banners = await Banner.find();
   res.status(200).json({"status":httpsStatus.SUCCESS,"data":banners});
  } catch (error){
    console.log(error);
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const deleteBannerByIdAdmin = async(req,res)=>{
  try {
    const banner = await Banner.findById(req.body.bannerId);
    if (banner) {
      await Banner.findByIdAndDelete(req.body.bannerId);
      res.status(200).json({"status":httpsStatus.SUCCESS});
    } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"no banner"});
    }
  } catch (error) {
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const verifyAddBanner=async (req, res, next)=> {
  var token = req.headers.token;
  const banners = await Banner.find();
  if (banners.length <= 15) {
    res.status(200).send({ "success": false, "data": true});
  } else {
    res.status(400).send({ "success": false, "message": "max 100" });
  }
}
var bannerLink ;
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, 'uploads');
   
   },
   filename: (req, file, cb) => {
    const a = Date.now() + '-' + file.originalname;
     cb(null,a);
       bannerLink = `${process.env.IMAGELINK}/${a}`
   },
   
 });
 
 const bUpload = multer({
   storage: storage,
   limits: { fileSize: 5000000 }, 
   fileFilter: (req, file, cb) => {
     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      
       cb(null, true);
     } else {
       cb(new Error('Invalid file type'));
     }}
 });
const addBannerImage = async(req,res)=>{
 try {
   if (bannerLink != undefined) {
      res.status(200).json({"status":httpsStatus.SUCCESS,"data":bannerLink});
      
   } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"image not upload"});
   }
 } catch (error) { 
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   
 }
}
const addBanner = async(req,res)=>{
  try {
    const token = req.headers.token;
    const banner = new Banner({
       bannerName:req.body.bannerName,
       bannerImage:req.body.bannerImage
    });
    await banner.save();
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":banner});
  } catch (error) {
      console.log(error);
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
 module.exports = {
   getAllBanners,getAllBannersAdmin,deleteBannerByIdAdmin,addBanner,addBannerImage,bUpload,verifyAddBanner
   }