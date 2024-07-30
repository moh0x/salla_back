const { Deliviry } = require('../models/deliviry/deliviry_model');
const verifyDeliviry=async (req, res, next)=> {
    var token = req.headers.token;
    const deliviry = await Deliviry.findOne({token:token});
    if (deliviry) {
  if (deliviry.isAgree == true && deliviry.isVerify == true) {
    next();
  } else {
    res.status(403).send({ "success": false, "message": "you don't have perrmision" })
  }
    } else {
      res.status(403).send({ "success": false, "message": "you don't have perrmision" })
    }
  }
  module.exports = {verifyDeliviry};