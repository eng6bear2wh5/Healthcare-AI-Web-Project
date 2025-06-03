const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { sendOTP } = require("../../helpers/sendemailservice");
const { generateToken } = require("../../helpers/tokenHelper");

const hashPassword = async (password) => bcrypt.hash(password, 10);

const setAndSendOTP = async (req, email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  req.session.otp = otp;
  req.session.otpExpires = Date.now() + 5 * 60 * 1000; // 5 phút
  sendOTP(email, otp);
};

const verifyOTP = (req, email, otp) => {
  if (!req.session.otp || req.session.otp !== otp || !req.session.otpExpires || Date.now() > req.session.otpExpires) {
    return false;
  }
  delete req.session.otp;
  delete req.session.otpExpires;
  return true;
};

const sendResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};

class AuthController {
  static async register(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendResponse(res, 400, errors.array());

    try {
      const { name, password, email } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        if (existingUser.provider.includes("google") && existingUser.googleId) {
          return sendResponse(
            res,
            409,
            "Email này đã được sử dụng với đăng nhập Google. Vui lòng đăng nhập bằng Google."
          );
        } else {
          return sendResponse(
            res,
            409,
            "Email đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập."
          );
        }
      }
      // Lưu thông tin tạm trong session
      req.session.pendingUser = {
        name,
        email,
        password: await hashPassword(password),
      };
      await setAndSendOTP(req, email);
      sendResponse(res, 201, "Nhận được thông tin đăng ký, chờ xác thực OTP");
    } catch (error) {
      next(error);
    }
  }

  static async storeInfoRegisterFromUser(req, res, next) {
    try {
      const newUser = new User({
        ...req.session.pendingUser,
        isVerified: true,
      });

      await newUser.save();

      sendResponse(
        res,
        201,
        "Tài khoản đã được kích hoạt, bạn có thể đăng nhập"
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendResponse(res, 400, errors.array());

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return sendResponse(res, 400, "Sai email hoặc mật khẩu");
      }

      if (!user.isVerified) {
        return sendResponse(res, 403, "Tài khoản chưa được kích hoạt");
      }

      const token = generateToken(user);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: false,
<<<<<<< HEAD
        sameSite: "strict",
=======
        sameSite: "Strict",
>>>>>>> a03675c (add elastic remote and AI chatbot)
        maxAge: 15 * 60 * 1000,
        path: "/",
      });

      const { password: pwd, ...userData } = user._doc;

<<<<<<< HEAD
=======

>>>>>>> a03675c (add elastic remote and AI chatbot)
      res.status(200).json({ message: "Đăng nhập thành công", user: userData });
    } catch (error) {
      next(error);
    }
  }

  static logout(req, res, next) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false, // hoặc true nếu dùng HTTPS
      sameSite: "strict",
      path: "/",     // thêm path nếu lúc set có path
    });
    res.status(200).json({
        success: true, message: "Đăng xuất thành công"
    });
  }

  static me(req, res, next) {
    res.status(201).json({
      message: "Bạn đã đăng nhập",
      user: req.user,
      token: req.cookies.jwt,
    });
  }

  static async sendOTP(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendResponse(res, 400, errors.array());

    const { email } = req.body;
    try {
      await setAndSendOTP(req, email);
      sendResponse(res, 200, "Đã gửi mã otp");
    } catch (error) {
      next(error);
    }
  }

  static async verifyOTP(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendResponse(res, 400, errors.array());

    try {
      const { email, otp } = req.body;
      const isValid = verifyOTP(req, email, otp);
      if (!isValid) {
        return sendResponse(res, 400, "Mã OTP không hợp lệ hoặc đã hết hạn");
      }
      next();
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendResponse(res, 400, errors.array());

    const { email, password } = req.body;
    try {
      const hashedPassword = await hashPassword(password);
      await User.updateOne(
        { email: email },
        { $set: { password: hashedPassword } }
      );

      res.status(201).json({ message: "Mật khẩu đã được đặt lại thành công" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
