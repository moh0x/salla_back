const express = require('express');
const router = express.Router();
const favoriteController = require('../../controllers/favorites/favorites_controller');
const { verifyToken } = require("../../utility/verify_token");
router.patch('/changeFavorites',verifyToken,favoriteController.changeFavorites);
router.get('/myFavorites',verifyToken,favoriteController.getUserFavorites);
  module.exports = 
    router