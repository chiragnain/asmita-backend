// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.authenticate_Admin_Organizer = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the user's role is 'organizer' or 'admin'
    if (decoded.role !== 'organizer' && decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: insufficient privileges' });
    }

    req.user = decoded; // Set the decoded token data to req.user
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.authenticate_student = (req, res, next) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if the user's role is student
      if (decoded.role !== 'student') {
        return res.status(403).json({ message: 'Access denied: insufficient privileges' });
      }
  
      req.user = decoded; // Set the decoded token data to req.user
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };

