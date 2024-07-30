const express = require('express');
const router = express.Router();
const { verifyToken } = require("../../utility/verify_token");
const bannersController = require('../../controllers/home/banners_controllerl');
const { verifyAdmin } = require('../../utility/verify_role_admin');
const { verifyAddP } = require('../../controllers/home/items_controller');
const { verifyAddB } = require('../../utility/verify_add_banners');
const { verifyUser } = require('../../utility/verify_role_user');
router.get('/getAllBanners',verifyToken,verifyUser,bannersController.getAllBanners);
router.get('/getAllBannersAdmin',verifyToken,verifyAdmin,bannersController.getAllBannersAdmin);
router.delete('/admin/delete',verifyToken,verifyAdmin,bannersController.deleteBannerByIdAdmin);
router.post('/admin/addBannerImage',verifyToken,verifyAdmin,verifyAddB,bannersController.bUpload.single('image'),bannersController.addBannerImage);
router.post('/admin/addBanner',verifyToken,verifyAdmin,verifyAddB,bannersController.addBanner);
router.get('/admin/verifyAdd',verifyToken,verifyAdmin,bannersController.verifyAddBanner);
module.exports = 
router