import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const EmailVerificationForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailToVerify = searchParams.get("email");
  const from = searchParams.get("from");

  const [email] = useState(emailToVerify || "");
  const [otp, setOtp] = useState("");

  const sendRequestToVerifyOTP = async (to) => {
    try {
      const res = await fetch(`http://localhost:3000/auth/${to}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        console.log(
          `Xác minh OTP thành công. Tài khoản đã được kích hoạt: : ${data.message}`
        );
        return true;
      } else {
        console.log(`Xác minh thất bại: ${data.message || "Sai mã OTP"}`);
        alert(`Xác minh thất bại`);
        return false;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const sendToVerifyCode = async (e) => {
    e.preventDefault();
    try {
      if (from === "signup") {
        const result = await sendRequestToVerifyOTP("verify-otp-register");
        if (result) {
          navigate("/login");
        }
      } else if (from === "forgot-password") {
        const result = await sendRequestToVerifyOTP(
          "verify-otp-forgot-password"
        );
        if (result) {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(`Có lỗi khi fetch xác minh OTP: ${error.message}`);
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        console.log(`Đã gửi lại mã otp: ${data.message}`);
      } else {
        console.log(`Gửi lại otp không thành công: ${data.message}`);
      }
    } catch (error) {
      console.log(`Có lỗi khi yêu cầu gửi lại otp code: ${error.message}`);
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

      {/* OTP Code */}
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

      {/* Verify OTP code */}
      <div className="mt-5">
        <button
          type="submit"
          className="w-full bg-[#0180CC] text-white font-medium py-2.5 px-4 rounded-md hover:bg-[#0063A3] focus:outline-none focus:ring-2 focus:ring-[#0180CC] focus:ring-offset-2 transition-colors duration-200"
        >
          Tiếp tục
        </button>
      </div>

      {/* Resend email button */}
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
