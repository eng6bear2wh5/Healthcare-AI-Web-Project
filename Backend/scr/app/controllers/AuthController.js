const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); 

const User = require('../models/user');
const { sendOTP } = require('../../helpers/sendemailservice');
const { generateToken } = require('../../helpers/tokenHelper');

const hashPassword = async (password) => bcrypt.hash(password, 10);
const otpStore = new Map();
const pendingUsers = new Map();

const setAndSendOTP = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
    sendOTP(email, otp);
};

const verifyOTP = (email, otp) => {
    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
        return false;
    }
    otpStore.delete(email);
    return true;
};

const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ message });
};

class AuthController {
    static async register(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return sendErrorResponse(res, 400, errors.array());

        try {
            const { name, password, email } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                if (existingUser.provider.includes('google') && existingUser.googleId) {
                  return sendErrorResponse(res, 409, 'Email này đã được sử dụng với đăng nhập Google. Vui lòng đăng nhập bằng Google.');
                } else {
                  return sendErrorResponse(res, 409, 'Email đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.');
                }
            }

            const newUser = new User({
                name,
                password, 
                email
            });
            newUser.password = await hashPassword(newUser.password);

            // pendingUsers.set(email, {
            //     otp,
            //     userData: { name, email, password: hashedPassword },
            //     expiresAt: Date.now() + 90_000
            // });

            await setAndSendOTP(email);


            // setTimeout(() => {
            //     if (pendingUsers.has(email)) pendingUsers.delete(email);
            // }, 90_000);

            await newUser.save();
            

            res.status(201).json({
                message: 'Đăng ký thành công.',
                user: {
                  id: newUser._id,
                  name: newUser.name,
                  email: newUser.email,
                  isVarified: newUser.isVarified
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async verifyOTPRegister(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return sendErrorResponse(res, 400, errors.array());

        try {
            const { email, otp } = req.body;
            const isValid = verifyOTP(email, otp);

            if (!isValid) {
                return sendErrorResponse(res, 400, 'Mã OTP không hợp lệ hoặc đã hết hạn');
            }

            await User.updateOne(
                { email: email},
                { $set: { isVerified: true } }
            );
            res.json({ message: 'Tài khoản đã được kích hoạt, bạn có thể đăng nhập' });
        }
        catch (error) {
            next(error);
        }
    }

    static async login(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return sendErrorResponse(res, 400, errors.array());

        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return sendErrorResponse(res, 400, 'Sai email hoặc mật khẩu');
            }

            if (!user.isVerified) {
                return sendErrorResponse(res, 403, 'Tài khoản chưa được kích hoạt');
            }

            const token = generateToken(user);

            res.cookie("token", token, {
                httpOnly: true,  
                secure: true,    
                sameSite: "Strict",  
                maxAge: 24 * 60 * 60 * 1000, 
            });
            
            res.json({ message: 'Đăng nhập thành công', token });
        } catch (error) {
            next(error);
        }
    }

    static logout(req, res) {
        res.clearCookie('token'); 
        res.json({ message: 'Đăng xuất thành công' });
    }

    static me(req, res) {
        res.json({ message: 'Bạn đã đăng nhập', user: req.user, token: req.cookies.token });
    }

    static async sendOTPForgotPassword(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return sendErrorResponse(res, 400, errors.array());

        const { email } = req.body;
        try {
            const existingUser = await User.fineOne({ email });
            if (!existingUser) { 
                return sendErrorResponse(res, 400, 'Email chưa được đăng ký');
            }
            await setAndSendOTP(email);
            sendErrorResponse(res, 200, 'Đã gửi mã otp');
        }
        catch(error) {
            next(error);
        }
    }

    static async verifyOTPForgotPassword(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return sendErrorResponse(res, 400, errors.array());

        try {
            const { email, otp } = req.body;
            const isValid = verifyOTP(email, otp);
            if (!isValid) {
                return sendErrorResponse(res, 400, 'Mã OTP không hợp lệ hoặc đã hết hạn');
            }
            res.json({ message: 'Mã OTP hợp lệ, bạn có thể tạo lại mật khẩu' });
        }
        catch (error) {
            next(error);
        }
    }

    static async resetPassword(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return sendErrorResponse(res, 400, errors.array());

        const { email, password } = req.body;   
        try {
            const hashedPassword = await hashPassword(password);
            await User.updateOne(
                { email: email},
                { $set: { password: hashedPassword } }
            );

            res.json({ message: 'Mật khẩu đã được đặt lại thành công' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
