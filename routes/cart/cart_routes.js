const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart/cart_controller');
const { verifyToken } = require("../../utility/verify_token");
const { verifyUser } = require('../../utility/verify_role_user');
router.patch('/changeCart',verifyToken,verifyUser,cartController.changeItemCart);
router.get('/myCart',verifyToken,verifyUser,cartController.getUserCart);
  module.exports = 
    router