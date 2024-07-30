const { Admin } = require("../models/admin/admin_controller");
const { Vendor } = require("../models/vendor/vendor_model");
const { Item } = require("../models/home/items_model");
const verifyAdd=async (req, res, next)=> {
    var token = req.headers.token;
    const vendor = await Vendor.findOne({token:token});
    const items = await Item.find({vendorId:vendor.id});
    if (items.length < 100) {
      next();
    } else {
      res.status(400).send({ "success": false, "message": "max 100" })
    }
  }
  module.exports = {verifyAdd};