import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../api/auth";


const ResetPasswordForm = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailToReset = searchParams.get("email");

  const [email] = useState(emailToReset || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ mật khẩu mới và xác nhận mật khẩu!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      const result = await resetPassword({ email, password });
      if (result.ok) {
        // alert("Đặt lại mật khẩu thành công, bạn có thể đăng nhập lại");
        navigate("/login");
      } else {
        alert(`Đặt lại mật khẩu thất bại: ${result.data.message}`);
      }
    } catch (error) {
      alert(`Có lỗi khi đặt lại mật khẩu: ${error.message}`);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Đổi mật khẩu
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Click "Xác nhận” để đổi mật khẩu cho email: <br />
          <span className="font-medium">{email}</span>
        </p>
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mật khẩu
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          required
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0180CC] focus:outline-none focus:ring-[#0180CC] text-sm"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Xác nhận mật khẩu
        </label>
        <input
          id="confirm-password"
          name="confirm-password"
          type="password"
          required
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0180CC] focus:outline-none focus:ring-[#0180CC] text-sm"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className="mt-5">
        <button
          type="submit"
          className="w-full bg-[#0180CC] text-white font-medium py-2.5 px-4 rounded-md hover:bg-[#0063A3] focus:outline-none focus:ring-2 focus:ring-[#0180CC] focus:ring-offset-2 transition-colors duration-200"
        >
          Xác nhận
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;