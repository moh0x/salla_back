var jwt = require('jsonwebtoken');
const verifyToken = (req, res, next)=> {
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, `${process.env.TOKEN}`, (err, decoded)=> {
        if (err) {
          res.status(403).json({ "success": false, "message": "Failed to authenticate user." })
        } else {
          
          next()
        }
      })
    } else {
      res.status(403).send({ "success": false, "message": "No Token Provided." })
    }
  }
  module.exports = {verifyToken};