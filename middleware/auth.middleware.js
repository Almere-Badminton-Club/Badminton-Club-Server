const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided.');

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log('decoded token:', decoded);
    
    const user = await User.findById(decoded.id);
    if (!user) throw new Error('User not found.');

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.userType !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only.' });
  }
  next();
};

module.exports = { authenticateUser, isAdmin };
