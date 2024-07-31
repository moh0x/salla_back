const express = require('express');
const router = express.Router();
const { verifyToken } = require("../../utility/verify_token");
const categoriesControoler = require('../../controllers/home/categories_controller');
const { verifyAdmin } = require('../../utility/verify_role_admin');
const multer = require('multer');
const { verifyUser } = require('../../utility/verify_role_user');
router.get('/getAllCategories',verifyToken,categoriesControoler.getAllCategories);
router.get('/getAllCategoriesAdmin',verifyToken,verifyAdmin,categoriesControoler.getAllCategoriesAdmin);
router.delete('/admin/delete',verifyToken,verifyAdmin,categoriesControoler.deleteCategoryAdmin);
router.post('/admin/addCategoryImage',verifyToken,verifyAdmin,categoriesControoler.catUpload.single('image'),categoriesControoler.addCategoryImage);
router.post('/admin/addBanner',verifyToken,verifyAdmin,categoriesControoler.addCategoryAdmin);
module.exports = 
router
