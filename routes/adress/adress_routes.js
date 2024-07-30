const express = require('express');
const router = express.Router();
const adressController = require('../../controllers/adress/adress_controller');
const { verifyToken } = require("../../utility/verify_token");
const { verifyUser } = require('../../utility/verify_role_user');
const { verifyAddAdress } = require('../../utility/verify_add_adress');
router.get('/myAdreses',verifyToken,verifyUser,adressController.getMyAdresses);
router.post('/addAdress',verifyToken,verifyUser,verifyAddAdress,adressController.addAdress);
router.delete('/deleteAdress',verifyToken,verifyUser,adressController.deleteAdress);
router.get('/verifyAddAdress',verifyToken,verifyUser,adressController.verifyAddAdressCon);
  module.exports = 
    router