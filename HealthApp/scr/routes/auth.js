const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const AuthController = require('../app/controllers/AuthController');
const validateMiddleware = require('../middleware/validateMiddleware');
const authenticateJWT = require('../middleware/authMiddleware');

// Đăng ký (có rate limiting)
router.post('/register', validateMiddleware.registerLimiter, validateMiddleware.validateRegister, AuthController.register);

// Xác thực OTP
router.post('/verify-otp-login', validateMiddleware.validateOTP, AuthController.verifyOTPLogin);

// Đăng nhập
router.post('/login', validateMiddleware.validateLogin, AuthController.login);

// Kiểm tra đăng nhập
//router.get('/me', authMiddleware, AuthController.me);

// Đăng xuất
router.post('/logout', AuthController.logout);

// Quên mật khẩu
router.post('/send-otp', validateMiddleware.validateForgotPassword, AuthController.sendOTPForgotPassword); 
router.post('/verify-otp-forgotpassword', validateMiddleware.validateOTP, AuthController.verifyOTPForgotPassword);
router.post('/reset-password', validateMiddleware.validateLogin, AuthController.resetPassword);








// ✅ Đăng nhập bằng Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// ✅ Xử lý callback Google
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    (req, res) => {
        res.json({ token: req.user.token, user: req.user.user });
    }
);

// ✅ Đăng nhập bằng Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// ✅ Xử lý callback Facebook
router.get('/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: '/' }),
    (req, res) => {
        res.json({ token: req.user.token, user: req.user.user });
    }
);

// ✅ Kiểm tra đăng nhập (Dùng JWT thay vì session)
router.get('/me', authenticateJWT, (req, res) => {
    res.json({ message: 'Bạn đã đăng nhập!', user: req.user });
});

// ✅ Đăng xuất (Không cần làm gì với JWT)
router.get('/logout', (req, res) => {
    res.json({ message: 'Bạn đã đăng xuất!' });
});

module.exports = router;
