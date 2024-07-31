const express = require('express');
const router = express.Router();
const deliviryControoler = require('../../controllers/deliviy/deliviry_controller');
const { verifyToken } = require("../../utility/verify_token");
const {body,validationResult } = require("express-validator");
const { verifyDeliviry } = require('../../utility/verify_role_deliviry');
const { verifyAdmin } = require('../../utility/verify_role_admin');
router.post('/register',body("email").isEmail().isLength({min:6,max:50}).withMessage("type valid email"),body("password").isString().isLength({min:8,max:30}).withMessage("type valid password"),body("phone").isMobilePhone().isLength({min:10,max:15}).withMessage("type valid phone number"),body("userName").isLength({min:6,max:30}).withMessage("type valid user name"),deliviryControoler.registerFunc);

router.patch('/verifyAccount',body("verifyCode").isString().isLength({min:1,max:5}),verifyToken,deliviryControoler.confirmAccountFunc);
router.get('/deliviryInfo',verifyToken,verifyDeliviry,deliviryControoler.getDeliviryInfo);
router.patch('/resetPassword',body("resetPasswordCode").isString().isLength({min:1,max:5}),body('password').isString().isLength({min:8,max:30}),deliviryControoler.resetPasswordFunc);

router.post('/login',body("email").isEmail().isLength({min:6,max:50}).withMessage("type valid email"),body("password").isString().isLength({min:8,max:30}).withMessage("type valid password"),deliviryControoler.loginFunc);
  
router.post('/sendResetCode',deliviryControoler.sendResetCodeFunc);
router.get('/admin/getAllDeliviriesAgreeAdmin',verifyToken,verifyAdmin,deliviryControoler.getAllDeliviriesAgreeAdmin);
router.get('/admin/getAllDeliviriesNotAgreeAdmin',verifyToken,verifyAdmin,deliviryControoler.getAllDeliviriesNotAgreeAdmin);
router.patch('/admin/changeStatusAgree',verifyToken,verifyAdmin,deliviryControoler.changeDeliviryStatusAdmin);
router.delete('/admin/deleteDeliviry',verifyToken,verifyAdmin,deliviryControoler.deleteDeliviryAdmin);
router.delete('/deleteDeliviry',body("password").isString().isLength({min:8,max:30}).withMessage("type valid password"),verifyToken,verifyDeliviry,deliviryControoler.deleteFunc);
  module.exports = 
    router
  
