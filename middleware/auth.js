const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = (roles = []) => {
  return async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user || (roles.length && !roles.includes(user.role))) {
        return res.status(403).send('Access denied');
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send('Invalid token');
    }
  };
};
module.exports = auth;
