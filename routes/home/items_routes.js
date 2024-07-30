const express = require('express');
const router = express.Router();
const { verifyToken } = require("../../utility/verify_token");
const itemsControoler = require('../../controllers/home/items_controller');
const { verifyAdmin } = require('../../utility/verify_role_admin');
const multer = require('multer');
const { verifyVendor } = require('../../utility/verify_role_vendor');
const { verifyAdd } = require('../../utility/verify_add');
const { verifyUser } = require('../../utility/verify_role_user');
router.get('/getAllItems',verifyToken,verifyUser,itemsControoler.getAllItems);
router.get('/getSearchItem',verifyToken,verifyUser,itemsControoler.getSearchItems);
router.get('/getLikesItem',verifyToken,verifyUser,itemsControoler.getLikesItems);
router.get('/getCartItem',verifyToken,verifyUser,itemsControoler.getCartItems);
router.get('/getLatestItem',verifyToken,verifyUser,itemsControoler.getLatestItems);
router.get('/admin/getLatestItemItemsVerify',verifyToken,verifyAdmin,itemsControoler.getLatestItemsVerifyAdmin);
router.get('/admin/getLatestItemItemsNotVerify',verifyToken,verifyAdmin,itemsControoler.getLatestItemsNotVerifyAdmin);
router.delete('/admin/deleteItem',verifyToken,verifyAdmin,itemsControoler.deleteItemAdmin);
router.patch('/admin/changeStatusVerify',verifyToken,verifyAdmin,itemsControoler.changeItemStatusAdmin);
router.post('/addImage',verifyToken,verifyVendor,verifyAdd,itemsControoler.iUpload.single('image'),itemsControoler.addImage);
router.post('/addProduct',verifyToken,verifyVendor,verifyAdd,itemsControoler.addProduct);
router.get('/vendor/getLatestItemItemsVerify',verifyToken,verifyVendor,itemsControoler.getLatestItemsVerifyVendor);
router.get('/vendor/getLatestItemItemsNotVerify',verifyToken,verifyVendor,itemsControoler.getLatestItemsNotVerifyVendor);
router.delete('/vendor/deleteItem',verifyToken,verifyVendor,itemsControoler.deleteItemVendor);
router.get('/vendor/verifyAdd',verifyToken,verifyVendor,itemsControoler.verifyAddP);
module.exports = 
router
