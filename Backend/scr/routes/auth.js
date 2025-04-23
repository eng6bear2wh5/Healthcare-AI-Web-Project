const express = require('express');
const passport = require('passport'); //user authentication
const jwt = require('jsonwebtoken'); 
const router = express.Router();

const AuthController = require('../app/controllers/AuthController');
const validateMiddleware = require('../middleware/validateMiddleware');
const authenticate = require('../middleware/authMiddleware');

// Đăng ký (có rate limiting) với Xác thực OTP đăng ký
router.post('/register', validateMiddleware.registerLimiter, validateMiddleware.validateRegister, AuthController.register);
router.post('/verify-otp-register', validateMiddleware.validateOTP, AuthController.verifyOTPRegister);

// Đăng nhập
router.post('/login', validateMiddleware.validateLogin, AuthController.login);

// Kiểm tra đăng nhập
router.get('/me', authenticate, AuthController.me);

// Đăng xuất
router.get('/logout', AuthController.logout);

// Quên mật khẩu
router.post('/forgotpassword', validateMiddleware.validateForgotPassword, AuthController.sendOTPForgotPassword); 
router.post('/verify-otp-forgotpassword', validateMiddleware.validateOTP, AuthController.verifyOTPForgotPassword);
router.post('/reset-password', validateMiddleware.validateLogin, AuthController.resetPassword);

// Đăng nhập bằng Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    (req, res) => {
        res.json({ token: req.user.token, user: req.user.user });
    }
);

module.exports = router;
