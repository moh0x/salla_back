const { Banner } = require("../models/home/banner_model");

const verifyAddB=async (req, res, next)=> {
    var token = req.headers.token;
    const banners = await Banner.find();
    if (banners.length < 15) {
        next();
    } else {
      res.status(400).send({ "success": false, "message": "max 100" });
    }
  }
  module.exports = {verifyAddB};