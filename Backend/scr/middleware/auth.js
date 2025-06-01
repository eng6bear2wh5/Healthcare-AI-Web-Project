// middleware/auth.js
const { verifyToken } = require('../helpers/tokenHelper');
const User = require('../app/models/user');

exports.protect = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Bạn chưa đăng nhập.' });
  }
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại.' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token không hợp lệ.' });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Không có quyền truy cập.' });
  }
  next();
};