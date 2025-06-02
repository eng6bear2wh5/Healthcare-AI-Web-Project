// middleware/auth.js
const User = require('../app/models/user');
const jwt = require('jsonwebtoken') ;

exports.protect = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'Bạn chưa đăng nhập.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Bạn không có quyền truy cập trang này"});
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại.' });
    }
    req.user = user;
    next();
  } catch (err) {
      console.log("Error in protectRoute middleware", err);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Không có quyền truy cập.' });
  }
  next();
};