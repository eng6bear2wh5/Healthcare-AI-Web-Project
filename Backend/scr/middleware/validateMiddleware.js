const { body } = require('express-validator'); 
const rateLimit = require('express-rate-limit');

const validationMiddleware = {
    validateRegister: [
        body('email').isEmail().withMessage('Email không hợp lệ'),
        body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
    ],
    
    validateLogin: [
        body('email').isEmail().withMessage('Email không hợp lệ'),
        body('password').notEmpty().withMessage('Mật khẩu không được để trống')
    ],

    validateOTP: [
        body('otp').notEmpty().withMessage('Mã OTP không được để trống')
    ],

    validateForgotPassword: [
        body('email').isEmail().withMessage('Email không hợp lệ'),
    ],

    registerLimiter: rateLimit({
        windowMs: 15 * 60 * 1000, 
        max: 5,
        message: { message: 'Quá nhiều yêu cầu đăng ký, vui lòng thử lại sau' },
        headers: true,
    }),
};

module.exports = validationMiddleware;
