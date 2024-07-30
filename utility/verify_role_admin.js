const { Admin } = require("../models/admin/admin_controller");

const verifyAdmin=async (req, res, next)=> {
    var token = req.headers.token;
    const admin = await Admin.findOne({token:token});
    if (admin) {
      next();
    } else {
      res.status(403).send({ "success": false, "message": "you don't have perrmision" })
    }
  }
  module.exports = {verifyAdmin};