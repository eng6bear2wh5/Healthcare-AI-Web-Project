require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 2525,
    secure: false,
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
    }
});


const sendOTP = async (email, otp) => {
    console.log('Hàm sendOTP được gọi với:', email, otp);
    try {
        await transporter.sendMail({
            from: process.env.SENDGRID_FROM_EMAIL,
            to: email,
            subject: 'Mã xác thực OTP',
            text: `Mã OTP của bạn là: ${otp}. \nMã OTP của bạn sẽ hết hạn sau 5 phút!`
        });
        console.log('Đã gửi mail tới:', email);
    } catch (err) {
        console.error('Lỗi gửi mail:', err);
    }
};