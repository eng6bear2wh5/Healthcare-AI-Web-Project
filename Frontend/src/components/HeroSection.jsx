// HeroSection.jsx
import { motion } from "framer-motion";
import logo from "../assets/medical-icon-png.png";
import herosection from "../assets/herosection.avif"

const HeroSection = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Ảnh nền y tế rõ, sáng */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${herosection})`,
        }}
      />

      {/* Overlay gradient hiện đại, sáng, y tế */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-sky-100/60 to-white/60 backdrop-blur-sm" />

      {/* Nội dung trung tâm */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full px-6 md:px-20 text-gray-900 font-sans"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        
          {/* Logo và tên thương hiệu */}
          <div className="flex items-center mb-6 space-x-3">
            {/* Thay đổi src thành logo thực tế của bạn */}
            <img
              src={logo}
              alt="HealthTrust Logo"
              className="h-12 w-12 rounded-full shadow-lg"
            />
            <span className="text-2xl md:text-3xl font-bold tracking-tight text-sky-700 opacity-70">
              HealthTrust
            </span>
          </div>
          {/* Khung nền mờ cho chữ */}
          <div className="opacity-70">
            <h1
              className="text-4xl text-sky-700 md:text-6xl font-extrabold mb-4 leading-tight tracking-tight text-center"
              style={{
                textShadow: "0 6px 24px rgba(0,0,0,0.18), 0 1px 0 #fff",
                fontFamily: "Inter, Nunito, Arial, sans-serif",
              }}
            >
              AI trong chăm sóc sức khỏe
            </h1>
            <p
              className="text-lg md:text-2xl max-w-2xl font-light text-center text-neutral-800"
              style={{
                textShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              Phát hiện bệnh sớm bằng công nghệ thông minh, hỗ trợ bác sĩ ra
              quyết định chính xác hơn.
            </p>
          </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
