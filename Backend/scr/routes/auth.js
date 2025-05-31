const express = require('express');
const passport = require('passport');
const router = express.Router();

const AuthController = require('../app/controllers/AuthController');
const validateMiddleware = require('../middleware/validateMiddleware');
const { protect, authorize } = require('../middleware/auth');

// Đăng ký (có rate limiting) với Xác thực OTP đăng ký
router.post('/register', validateMiddleware.registerLimiter, validateMiddleware.validateInfoUser, AuthController.register);
router.post('/verify-otp-register', validateMiddleware.validateOTP, AuthController.verifyOTP, AuthController.storeInfoRegisterFromUser);

// Đăng nhập
router.post('/login', validateMiddleware.validateInfoUser, AuthController.login);

// Quên mật khẩu
router.post('/verify-otp-forgot-password', validateMiddleware.validateOTP, AuthController.verifyOTP, (req, res) => {res.status(201).json({ message: 'Mã OTP hợp lệ, bạn có thể đặt lại mật khẩu' });});
router.post('/reset-password', validateMiddleware.validateInfoUser, AuthController.resetPassword);

// Gửi otp code
router.post('/send-otp', validateMiddleware.validateEmail, AuthController.sendOTP); 

// Kiểm tra đăng nhập
// router.get('/me', authenticate, AuthController.me);

// Đăng xuất
router.get('/logout', AuthController.logout);

// Đăng nhập bằng Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    (req, res) => {
        res.cookie('authToken', req.user.token, {
            httpOnly: true,     // không cho JS truy cập
            secure: true,       // chỉ gửi qua HTTPS
            sameSite: 'Lax',    // chống CSRF cơ bản
            maxAge: 60 * 60 * 1000 // 1h
          });
        res.redirect('http://localhost:5173/login');
    }
);

module.exports = router;
