import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../api/auth";
<<<<<<< HEAD
=======
import { useToast } from "../ToastContext"; // chỉnh đúng path
>>>>>>> a03675c (add elastic remote and AI chatbot)

const ForgotPasswordForm = () => {
  useEffect(() => {
    document.title = "Quên mật khẩu | HealthTrust";
  }, []);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

<<<<<<< HEAD
=======
  const { showToast } = useToast();
>>>>>>> a03675c (add elastic remote and AI chatbot)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email) {
<<<<<<< HEAD
        alert("Vui lòng nhập địa chỉ email!");
=======
        showToast("Vui lòng nhập địa chỉ email!", "fail");
>>>>>>> a03675c (add elastic remote and AI chatbot)
        return;
      }

      const result = await sendOtp({ email });

      if (!result.ok) {
        console.log(`Gửi otp không thành công: ${result.data.message}`);
<<<<<<< HEAD
        alert(`Gửi otp không thành công`);
=======
        showToast(`Gửi otp không thành công`, "fail");
>>>>>>> a03675c (add elastic remote and AI chatbot)
      }

      navigate(
        `/email-verification?email=${encodeURIComponent(
          email
        )}&from=forgot-password`
      );
    } catch (error) {
<<<<<<< HEAD
      console.log(`Có lỗi khi fetch send otp forgot password: ${error.message}`);
=======
      console.log(
        `Có lỗi khi fetch send otp forgot password: ${error.message}`
      );
>>>>>>> a03675c (add elastic remote and AI chatbot)
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

<<<<<<< HEAD
export default ForgotPasswordForm;
=======
export default ForgotPasswordForm;
>>>>>>> a03675c (add elastic remote and AI chatbot)
