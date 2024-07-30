const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/admin_controller');
const { verifyToken } = require("../../utility/verify_token");
const {body,validationResult } = require("express-validator");
const { verifyAdmin } = require('../../utility/verify_role_admin');
router.get('/adminInfo',verifyToken,verifyAdmin,adminController.getAdminInfo);
router.patch('/resetPassword',body("resetPasswordCode").isString().isLength({min:1,max:5}),body('password').isString().isLength({min:8,max:30}),adminController.resetPasswordFunc);

router.post('/login',body("email").isEmail().isLength({min:6,max:50}).withMessage("type valid email"),body("password").isString().isLength({min:8,max:30}).withMessage("type valid password"),adminController.loginFunc);
  
router.post('/sendResetCode',adminController.sendResetCodeFunc)
  module.exports = 
    router
  