import React from 'react';
import { Link } from 'react-router-dom';

export const Login = () => {
  return (
    <section className="min-h-screen flex bg-[#F5F8FA]">
      {/* Information section - left side */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Full image background with subtle overlay */}
        <img 
          src="static/images/background_login.jpg" 
          alt="Medical background" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#22D3EE]/50 to-[#0891B2]/60"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-md p-6 text-center">
            <h2 className="text-white text-4xl font-bold mb-4 drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>
              Chăm Sóc Sức Khỏe Thông Minh
            </h2>

            <p className="text-white text-xl mb-0 drop-shadow-md" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
              Ứng dụng công nghệ AI tiên tiến vào chẩn đoán và điều trị y khoa
            </p>
          </div>
        </div>
      </div>
      
      {/* Form section - right side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        {/* Form container */}
        <div className="w-full max-w-lg bg-white rounded-xl shadow-md border border-gray-100">
          {/* Content wrapper with consistent padding */}
          <div className="px-8 py-6">
            {/* Logo and branding section */}
            <div className="flex flex-col items-center mb-6">
              {/* Logo with lighter background */}
              <div className="bg-[#EBF5FF] rounded-full p-3 mb-3">
                <img 
                  src="/static/images/medical-icon-png.png"
                  alt="Healthcare AI Logo"
                  className="h-16 w-16"
                />
              </div>
              
              {/* Title */}
              <h1 className="healthcare-heading text-2xl font-bold text-[#0063A3]">Healthcare AI</h1>
              
              {/* Divider */}
              <div className="h-0.5 w-32 bg-[#E1EDF7] my-2"></div>
              
              {/* Tagline */}
              <p className="healthcare-text text-sm text-gray-600">Intelligent Healthcare Solutions</p>
            </div>
            
            {/* Toggle */}
            <div className="relative w-full h-11 bg-[#F5F8FA] rounded-lg p-1 mb-5">
              <div 
                className="absolute top-1 left-1 transition-all duration-300 ease-in-out h-9 w-[calc(50%-0.5rem)] bg-white rounded-md shadow-sm"
              ></div>
              
              <div className="relative flex h-full">
                <button
                  className="flex-1 z-10 transition-colors duration-300 rounded-md text-sm text-[#0180CC] font-medium flex items-center justify-center"
                >
                  Đăng nhập
                </button>
                <Link
                  to="/signup"
                  className="flex-1 z-10 transition-colors duration-300 rounded-md text-sm text-gray-500 flex items-center justify-center"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          
            {/* Login Form */}
            <form className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đăng nhập
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0180CC] focus:outline-none focus:ring-[#0180CC] text-sm"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0180CC] focus:outline-none focus:ring-[#0180CC] text-sm"
                  placeholder="example@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#0180CC] focus:outline-none focus:ring-[#0180CC] text-sm"
                  placeholder="••••••••"
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
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Nhớ đăng nhập
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-[#0180CC] hover:text-[#0063A3]">
                    Quên mật khẩu
                  </a>
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
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z" fill="#EA4335"/>
                    <path d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z" fill="#34A853"/>
                    <path d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z" fill="#4A90E2"/>
                    <path d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z" fill="#FBBC05"/>
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};