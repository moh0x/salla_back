const express = require('express');
const router = express.Router();
const deliviryPayControoler = require('../../controllers/deliviry pay/deliviry_pay_controller');
const {body,validationResult } = require("express-validator");
const { verifyAdmin } = require('../../utility/verify_role_admin');
const { verifyToken } = require('../../utility/verify_token');
router.post('/add',verifyToken,verifyAdmin,deliviryPayControoler.addDeliviryPay);
router.delete('/delete',verifyToken,verifyAdmin,deliviryPayControoler.deleteDeliviryPay);
router.get('/get',verifyToken,verifyAdmin,deliviryPayControoler.getAllDeliviriesPays)
  module.exports = 
    router
  