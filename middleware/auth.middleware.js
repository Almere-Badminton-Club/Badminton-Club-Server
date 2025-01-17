const { expressjwt: jwt } = require("express-jwt");


const isAdmin = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  
  if (!token) {
    return res.status(403).json({ message: 'No token, no access' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.userType !== 'Admin') {
      return res.status(403).json({ message: 'You are not authorized to access this page' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to authenticate token' });
  }
};

module.exports = { isAdmin };
