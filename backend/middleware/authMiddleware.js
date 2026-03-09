const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Engineer = require('../models/Engineer');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      if (decoded.role === 'Admin') {
        req.user = { _id: 'admin-id', role: 'Admin', email: 'admin@aquasafe.com' };
        return next();
      }

      let user = await User.findById(decoded.id).select('-password');
      if (!user) {
        user = await Engineer.findById(decoded.id).select('-password');
      }
      
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
