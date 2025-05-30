const jwt = require('jsonwebtoken');



const authenticateToken = async (req, res, next) => {
  // Get token from cookies instead of headers
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "Access denied. Please login."
    });
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'qwee123dasp1319284OQIUEWO');
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({
      status: 403,
      message: "Invalid or expired token"
    });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    // authenticateToken middleware should run before this middleware
    // to populate req.user
    
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "Authentication required"
      });
    }
    
    // Check if user's role is in the allowed roles array
    if (roles.includes(req.user.role_user)) {
      return next();
    }
    
    return res.status(403).json({
      status: 403,
      message: "Access denied. Insufficient privileges."
    });
  };
};

module.exports = { authenticateToken, requireRole };