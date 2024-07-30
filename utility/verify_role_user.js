const { User } = require('../models/user_model');
const verifyUser =async (req, res, next)=> {
    var token = req.headers.token;
    const user = await User.findOne({token:token});
    if (user) {
  if (user.isVerify == true) {
    next();
  }
  else{
    res.status(403).send({ "success": false, "message": "you don't have perrmision" })
  }
    } else {
      res.status(403).send({ "success": false, "message": "you don't have perrmision" })
    }
  }
  module.exports = {verifyUser};