import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../api/auth";

const ForgotPasswordForm = () => {
  useEffect(() => {
    document.title = "Quên mật khẩu | HealthTrust";
  }, []);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email) {
        alert("Vui lòng nhập địa chỉ email!");
        return;
      }

      const result = await sendOtp({ email });

      if (!result.ok) {
        console.log(`Gửi otp không thành công: ${result.data.message}`);
        alert(`Gửi otp không thành công`);
      }

      navigate(
        `/email-verification?email=${encodeURIComponent(
          email
        )}&from=forgot-password`
      );
    } catch (error) {
      console.log(`Có lỗi khi fetch send otp forgot password: ${error.message}`);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Nhập Email của bạn
        </h2>
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0180CC] focus:outline-none focus:ring-[#0180CC] text-sm"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
    </form>
  );
};

export default ForgotPasswordForm;