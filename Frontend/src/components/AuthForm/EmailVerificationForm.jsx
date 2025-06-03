import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyOtpForgotPassword, verifyOtpRegister, sendOtp } from "../../api/auth";
<<<<<<< HEAD
=======
import { useToast } from "../ToastContext"; // chỉnh đúng path
>>>>>>> a03675c (add elastic remote and AI chatbot)

const EmailVerificationForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailToVerify = searchParams.get("email");
  const from = searchParams.get("from");

  const [email] = useState(emailToVerify || "");
  const [otp, setOtp] = useState("");

<<<<<<< HEAD
=======
  const { showToast } = useToast();

>>>>>>> a03675c (add elastic remote and AI chatbot)
  // Xác thực OTP đúng endpoint, dùng hàm import từ api/auth.js
  const sendToVerifyCode = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (from === "signup") {
        result = await verifyOtpRegister({ email, otp });
        if (result.ok) {
          navigate("/login");
        } else {
<<<<<<< HEAD
          alert(`Xác minh thất bại: ${result.data.message || "Sai mã OTP"}`);
=======
          showToast(`Xác minh thất bại: ${result.data.message || "Sai mã OTP"}`, "fail");
>>>>>>> a03675c (add elastic remote and AI chatbot)
        }
      } else if (from === "forgot-password") {
        result = await verifyOtpForgotPassword({ email, otp });
        if (result.ok) {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        } else {
<<<<<<< HEAD
          alert(`Xác minh thất bại: ${result.data.message || "Sai mã OTP"}`);
=======
          showToast(`Xác minh thất bại: ${result.data.message || "Sai mã OTP"}`, "fail");
>>>>>>> a03675c (add elastic remote and AI chatbot)
        }
      } else {
        navigate("/");
      }
    } catch (error) {
<<<<<<< HEAD
      alert(`Có lỗi khi xác minh OTP: ${error.message}`);
=======
      showToast(`Có lỗi khi xác minh OTP: ${error.message}`, "fail");
>>>>>>> a03675c (add elastic remote and AI chatbot)
    }
  };

  // Gửi lại OTP dùng hàm import từ api/auth.js
  const handleResendOTP = async () => {
    try {
      const result = await sendOtp({ email });
      if (result.ok) {
<<<<<<< HEAD
        alert(`Đã gửi lại mã OTP: ${result.message}`);
      } else {
        alert(`Gửi lại OTP không thành công: ${result.message}`);
      }
    } catch (error) {
      alert(`Có lỗi khi gửi lại OTP: ${error.message}`);
=======
        showToast(`Đã gửi lại mã OTP: ${result.message}`, "success");
      } else {
        showToast(`Gửi lại OTP không thành công: ${result.message}`, "fail");
      }
    } catch (error) {
      showToast(`Có lỗi khi gửi lại OTP: ${error.message}`, "fail");
>>>>>>> a03675c (add elastic remote and AI chatbot)
    }
  };

  return (
    <form onSubmit={sendToVerifyCode} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Kiểm tra hộp thư của bạn
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Mã OTP đã được gửi tới email:
          <br />
          <span className="font-medium">{email || "...."}</span>
        </p>
      </div>
      <div>
        <label
          htmlFor="otp"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mã OTP
        </label>
        <input
          id="otp"
          name="otp"
          type="text"
          required
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0180CC] focus:outline-none focus:ring-[#0180CC] text-sm"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>
      <div className="mt-5">
        <button
          type="submit"
          className="w-full bg-[#0180CC] text-white font-medium py-2.5 px-4 rounded-md hover:bg-[#0063A3] focus:outline-none focus:ring-2 focus:ring-[#0180CC] focus:ring-offset-2 transition-colors duration-200"
        >
          Tiếp tục
        </button>
      </div>
      <div className="text-center">
        <button
          id="resend-email-btn"
          type="button"
          onClick={handleResendOTP}
          className="text-sm font-medium text-gray-700 hover:underline"
        >
          Gửi lại OTP
        </button>
      </div>
    </form>
  );
};

export default EmailVerificationForm;