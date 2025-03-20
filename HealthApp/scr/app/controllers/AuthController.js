const UserModel = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Cấu hình gửi email OTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Bộ nhớ tạm lưu OTP
const otpStore = new Map();

// 🛠 **Hàm hỗ trợ** 
const hashPassword = async (password) => bcrypt.hash(password, 10);

const generateToken = (user) => jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
);

const sendOTP = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Mã xác thực OTP',
        text: `Mã OTP của bạn là: ${otp}`
    });
};

const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ message });
};

const verifyOTP = (email, otp) => {
    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
        return false;
    }
    otpStore.delete(email);
    return true;
};

// 🎯 **AuthController**
class AuthController {
    static async sendOTPForgotPassword(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return sendErrorResponse(res, 400, errors.array());

        const { email } = req.body;
        try {
            const existingUser = await UserModel.findByEmail(email);
            if (!existingUser) { 
                return sendErrorResponse(res, 400, 'Email chưa được đăng ký');
            }
            await sendOTP(email);
            res.status(200).end();
        }
        catch(error) {
            sendErrorResponse(res, 500, 'Lỗi server');
        }
    }

    static async register(req, res) {
        // Kiểm tra validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) return sendErrorResponse(res, 400, errors.array());

        const { username, password, email } = req.body;
        try {
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) return sendErrorResponse(res, 400, 'Email đã được sử dụng');

            const hashedPassword = await hashPassword(password);
            await UserModel.create(username, hashedPassword, email, false);

            await sendOTP(email);

            res.render('verifyOTP', { email });
        } catch (error) {
            sendErrorResponse(res, 500, 'Lỗi server');
        }
    }

    static async verifyOTPLogin(req, res) {
        const { email, otp } = req.body;
        const isValid = verifyOTP(email, otp);

        if (!isValid) {
            return sendErrorResponse(res, 400, 'Mã OTP không hợp lệ hoặc đã hết hạn');
        }

        await UserModel.activateUser(email);
        res.json({ message: 'Tài khoản đã được kích hoạt, bạn có thể đăng nhập' });
    }

    static async verifyOTPForgotPassword(req, res) {
        const { email, otp } = req.body;
        const isValid = verifyOTP(email, otp);

        if (!isValid) {
            return sendErrorResponse(res, 400, 'Mã OTP không hợp lệ hoặc đã hết hạn');
        }

        // Trả về trạng thái thành công để cho phép đổi mật khẩu
        res.render('reset-password', { email } );
    }

    static async login(req, res) {
        // Kiểm tra validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) return sendErrorResponse(res, 400, errors.array());

        const { email, password } = req.body;
        try {
            const user = await UserModel.findByEmail(email);
            if (!user || !(await bcrypt.compare(password, user.password_hash))) {
                return sendErrorResponse(res, 400, 'Sai email hoặc mật khẩu');
            }

            if (!user.is_active) {
                return sendErrorResponse(res, 403, 'Tài khoản chưa được kích hoạt');
            }

            const token = generateToken(user);

            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
            res.json({ message: 'Đăng nhập thành công', token });
        } catch (error) {
            sendErrorResponse(res, 500, 'Lỗi server');
        }
    }

    static logout(req, res) {
        res.clearCookie('token');
        res.json({ message: 'Đăng xuất thành công' });
    }

    static me(req, res) {
        res.json({ message: 'Bạn đã đăng nhập', user: req.user });
    }

    static async resetPassword(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return sendErrorResponse(res, 400, errors.array());

        const { email, password } = req.body;   
        try {
            const hashedPassword = await hashPassword(password);
            await UserModel.updatePassword(email, hashedPassword);

            res.json({ message: 'Mật khẩu đã được đặt lại thành công' });
        } catch (error) {
            sendErrorResponse(res, 500, 'Lỗi server');
        }
    }
}

module.exports = AuthController;
