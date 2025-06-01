// middleware/auth.js
const { verifyToken } = require('../helpers/tokenHelper');
const User = require('../app/models/user');

exports.protect = async (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated hahahahah' });
  }
  try {
    const decoded = verifyToken(token); 
    // Lấy thông tin user (không chứa password)
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
