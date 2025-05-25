import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Toggle from "./Toggle";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Đăng nhập thành công, đây là token của bạn: ${data.token}`);
      } else {
        alert(`Sai mật khẩu hoặc email chưa đăng ký: ${data.message}`);
      }
    } catch (error) {
      alert(`Có lỗi khi fetch đăng nhập: ${error.message}`);
    }
  };

  const loginGoogle = async () => {
    try {
      window.location.href = "http://localhost:3000/auth/google";
    } catch (error) {
      alert(`Có lỗi khi đăng nhập google: ${error.message}`);
    }
  };

  return (
    <>
      <Toggle />

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tên đăng nhập
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0180CC] focus:outline-none focus:ring-[#0180CC] text-sm"
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0180CC] focus:outline-none focus:ring-[#0180CC] text-sm"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Checkbox and forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-[#0180CC] focus:ring-[#0180CC]"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Nhớ đăng nhập
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium hover:underline text-[#0180CC] hover:text-[#0063A3]"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5">
          <button
            type="submit"
            className="w-full bg-[#0180CC] text-white font-medium py-2.5 px-4 rounded-md hover:bg-[#0063A3] focus:outline-none focus:ring-2 focus:ring-[#0180CC] focus:ring-offset-2 transition-colors duration-200"
          >
            Đăng nhập
          </button>

          <div className="relative flex items-center mt-4 mb-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-3 text-gray-400 text-sm">hoặc</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-md hover:bg-gray-50 transition-colors duration-200"
            onClick={loginGoogle}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z"
                fill="#EA4335"
              />
              <path
                d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z"
                fill="#34A853"
              />
              <path
                d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z"
                fill="#4A90E2"
              />
              <path
                d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z"
                fill="#FBBC05"
              />
            </svg>
            Đăng nhập với Google
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
