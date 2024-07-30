const { Adress } = require("../models/adress/adress_model");
const { Banner } = require("../models/home/banner_model");
const { User } = require("../models/user_model");

const verifyAddAdress=async (req, res, next)=> {
    var token = req.headers.token;
    const user = await User.findOne({token:token});
    const adresses = await Adress.find({adressUserId:user.id});
    if (adresses.length < 5) {
        next();
    } else {
      res.status(400).send({ "success": false, "message": "max 100" });
    }
  }
  module.exports = {verifyAddAdress};