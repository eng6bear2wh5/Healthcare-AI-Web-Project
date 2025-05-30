import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/medical-icon-png.png";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [open, setOpen] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const navItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Chuyên mục bệnh", path: "Category/CategoryHome" },
    {
      label: "Thông tin dược", path: "/PharmaInformation/MedicineList" },
    {
      label: "Kiểm tra sức khỏe",
      children: [
        { label: "BMI", path: "/HealthCheck/BMI" },
        {
          label: "Lượng calo cần mỗi ngày",
          path: "/HealthCheck/TDEECalculator",
        },
        {
          label: " Cân nặng lý tưởng",
          path: "/HealthCheck/IdealWeightCalculator",
        },
        { label: "Tỉ lệ mỡ cơ thể", path: "/HealthCheck/BodyFatCalculator" },
      ],
    },
    {
      label: "Cộng đồng",
      children: [
        { label: "Tin tức", path: "Community/News" },
        { label: "Lịch hiến máu", path: "Community/ScheduleBlood" },
      ],
    },
    {
      label: "Về Health Trust",
      children: [
        { label: "Tầm nhìn và sứ mệnh", path: "/AboutHealthTrust/Mission" },
        {
          label: "Thành tựu và giải thưởng",
          path: "/AboutHealthTrust/Achievement",
        },
        { label: "Đối tác", path: "/AboutHealthTrust/Partner" },
      ],
    },
  ];

  const handleMouseEnter = (index) => {
    clearTimeout(timeoutRef.current);
    setOpen(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(null), 200);
  };

  return (
    <nav className="bg-white/40 backdrop-blur-md shadow-md p-4 flex justify-between items-center sticky top-0 z-50 border-b border-white/10 ">
      {/* Logo */}
      <div
        className="flex items-center gap-2 text-xl font-bold text-blue-500 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src={logo} // Nếu dùng public folder
          alt="Logo"
          className="w-8 h-8 object-contain"
        />
        HealthTrust
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-6">
        <ul className="flex gap-6 items-center">
          {navItems.map((item, index) => (
            <li
              key={index}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <span
                className="cursor-pointer text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => {
                  if (!item.children) navigate(item.path);
                }}
              >
                {item.label}
              </span>

              {item.children && open === index && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white rounded shadow-lg w-56 z-50 transition-all duration-300 ease-in-out">
                  {item.children.map((child, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 hover:bg-blue-50 text-gray-700 hover:text-blue-600 cursor-pointer transition-colors"
                      onClick={() => {
                        navigate(child.path);
                        setOpen(null);
                      }}
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Search Box */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border border-gray-300 p-2 pl-10 rounded-lg w-60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <span className="absolute left-3 top-2.5 text-gray-600 w-5 h-5">
            <MagnifyingGlassIcon />
          </span>
        </div>

        {/* Login Button */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Đăng nhập
        </button>
      </div>

      {/* Mobile button */}
      <div className="flex md:hidden">
        <button
          className="text-blue-600 font-bold"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰ Menu
        </button>
      </div>

      {/* Mobile menu content */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col items-start px-4 py-6 space-y-4 md:hidden z-50 text-base font-medium text-gray-800">
          {navItems.map((item, index) => (
            <div key={index} className="w-full">
              <div
                className="cursor-pointer py-2 px-2 rounded hover:bg-blue-50 hover:text-blue-600 transition"
                onClick={() => {
                  if (!item.children) {
                    navigate(item.path);
                    setMenuOpen(false);
                  }
                }}
              >
                {item.label}
              </div>

              {item.children && (
                <div className="pl-4 space-y-1 mt-1">
                  {item.children.map((child, i) => (
                    <div
                      key={i}
                      className="py-1 px-2 rounded hover:bg-blue-100 hover:text-blue-500 cursor-pointer transition"
                      onClick={() => {
                        navigate(child.path);
                        setMenuOpen(false);
                      }}
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition"
            onClick={() => {
              navigate("/login");
              setMenuOpen(false);
            }}
          >
            Đăng nhập
          </button>
        </div>
      )}
    </nav>
  );
}
