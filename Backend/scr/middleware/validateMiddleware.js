const { body } = require('express-validator'); 
const rateLimit = require('express-rate-limit');

const validationMiddleware = {
    validateInfoUser: [
        body('email')
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ'),
        body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
    ],

    validateOTP: [
        body('otp').notEmpty().withMessage('Mã OTP không được để trống')
    ],

    validateEmail: [
        body('email')
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ')
    ],

    registerLimiter: rateLimit({
        windowMs: 15 * 60 * 1000, 
        max: 5,
        message: { message: 'Quá nhiều yêu cầu đăng ký, vui lòng thử lại sau' },
        headers: true,
    }),
};

module.exports = validationMiddleware;
