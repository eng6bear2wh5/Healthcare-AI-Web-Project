const { body } = require('express-validator'); // Kiểm tra dữ liệu đầu vào
const rateLimit = require('express-rate-limit'); // express-validator tự động gọi next() sau khi kiểm tra xong dữ liệu đầu vào.

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
        windowMs: 15 * 60 * 1000, // 15 phút
        max: 5, // Giới hạn 5 request mỗi 15 phút
        message: { message: 'Quá nhiều yêu cầu đăng ký, vui lòng thử lại sau' },
        headers: true,
    }),
};

module.exports = validationMiddleware;
