const jwt = require('jsonwebtoken'); //Tạo JWT token cho đăng nhập.
const { body } = require('express-validator'); // Kiểm tra dữ liệu đầu vào

// Middleware bảo vệ API bằng JWT
//Middleware kiểm tra token JWT trước khi truy cập API
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

// ✅ Middleware kiểm tra JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Không có token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token không hợp lệ" });

        req.user = user;
        next();
    });
};

module.exports = authenticateJWT;
