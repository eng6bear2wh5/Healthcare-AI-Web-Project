import React from "react";
import backgroundimage from '../../assets/background_login.jpg';
import logoimage from '../../assets/medical-icon-png.png';

const AuthLayout = ({ children }) => {
  return (
    <section className="min-h-screen flex bg-[#F5F8FA]">
      {/* Information section - left side */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Full image background with subtle overlay */}
        <img
          src={backgroundimage}
          alt="Medical background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#22D3EE]/50 to-[#0891B2]/60"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-md p-6 text-center">
            <h2
              className="text-white text-4xl font-bold mb-4 drop-shadow-md"
              style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)" }}
            >
              Chăm Sóc Sức Khỏe Thông Minh
            </h2>

            <p
              className="text-white text-xl mb-0 drop-shadow-md"
              style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}
            >
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
                  src={logoimage}
                  alt="Healthcare AI Logo"
                  className="h-16 w-16"
                />
              </div>

              {/* Title */}
              <h1 className="healthcare-heading text-2xl font-bold text-[#0063A3]">
                Healthcare AI
              </h1>

              {/* Divider */}
              <div className="h-0.5 w-32 bg-[#E1EDF7] my-2"></div>

              {/* Tagline */}
              <p className="healthcare-text text-sm text-gray-600">
                Intelligent Healthcare Solutions
              </p>
            </div>

            {/* Content */}
            <div className="content">{children}</div>

            <div className="mt-4 text-center text-xs font-medium text-[#0180CC] hover:text-[#0063A3]">
              <a href="#" className="hover:underline">
                Terms of Use
              </a>{" "}
              |{" "}
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
