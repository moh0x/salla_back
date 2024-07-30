const express = require('express');
const router = express.Router();
const vendorPayController = require('../../controllers/vendor pay/vendor_pay_controller');
const {body,validationResult } = require("express-validator");
const { verifyAdmin } = require('../../utility/verify_role_admin');
const { verifyToken } = require('../../utility/verify_token');
router.post('/add',verifyToken,verifyAdmin,vendorPayController.addVendorPay);
router.delete('/delete',verifyToken,verifyAdmin,vendorPayController.deleteVendorPay);
router.get('/get',verifyToken,verifyAdmin,vendorPayController.getAllVendorsPays)
  module.exports = 
    router
  