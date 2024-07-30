const { Category } = require("../../models/home/categories_model");
const httpsStatus = require('../../constants/https_status');
const multer = require('multer');
require('dotenv').config();
const getAllCategories = async(req,res)=>{
    try {
      const limit = 15;
      const page = req.body.page || 1;
      const skip = (page - 1) * limit;
     var token =  req.headers.token;
     const categories = await Category.find().sort({categoryDate:-1}).limit(limit).skip(skip);
     res.status(200).json({"status":httpsStatus.SUCCESS,"data":categories});
    } catch (error){
     res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
    }
 }
 const getAllCategoriesAdmin = async(req,res)=>{
  try {
    const limit = 15;
    const page = req.body.page || 1;
    const skip = (page - 1) * limit;
   var token =  req.headers.token;
   const categories = await Category.find().sort({categoryDate:-1}).limit(limit).skip(skip);
   res.status(200).json({"status":httpsStatus.SUCCESS,"data":categories});
  } catch (error){
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
const deleteCategoryAdmin = async(req,res)=>{
  try {
   const category = await Category.findById(req.body.categoryId);
   if (category) {
    await Category.findByIdAndDelete(req.body.categoryId);
    res.status(200).json({"status":httpsStatus.SUCCESS});
   } else {
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":null,"message":"no category"});
   }
   
  } catch (error){
   res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}
var categoryLink ;
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, 'uploads');
   
   },
   filename: (req, file, cb) => {
    const a = Date.now() + '-' + file.originalname;
    cb(null,a);
      categoryLink = `${process.env.IMAGELINK}/${a}`
  },
  
});
 
 const catUpload = multer({
   storage: storage,
   limits: { fileSize: 5000000 }, 
   fileFilter: (req, file, cb) => {
     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      
       cb(null, true);
     } else {
       cb(new Error('Invalid file type'));
     }}
 });
const addCategoryImage = async(req,res)=>{
 try {
   if (categoryLink != undefined) {
      res.status(200).json({"status":httpsStatus.SUCCESS,"data":categoryLink});
      
   } else {
      res.status(400).json({"status":httpsStatus.FAIL,"data":null,"message":"image not upload"});
   }
 } catch (error) { 
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
   
 }
}
const addCategoryAdmin = async(req,res)=>{
  try {
    const token = req.headers.token;
    const category = new Category({
       categoryName:req.body.categoryName,
       categoryNameArabic:req.body.categoryNameArabic,
       categoryDate:Date.now(),
       categoryImage:req.body.categoryLink
    });
    await category.save();
    res.status(200).json({"status":httpsStatus.SUCCESS,"data":category});
  } catch (error) {
    res.status(400).json({"status":httpsStatus.ERROR,"data":null,"message":"error"});
  }
}

 module.exports = {
   getAllCategories,getAllCategoriesAdmin,deleteCategoryAdmin,addCategoryAdmin,catUpload,addCategoryImage
   }