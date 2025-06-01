import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/medical-icon-png.png";
import { useAuth } from "../contexts/AuthContext";
import defaultimage from '../assets/avatars/uit_avatar.png';

export default function Navbar() {
  const [open, setOpen] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSubmenus, setMobileSubmenus] = useState({});
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); // Dropdown for account
  const timeoutRef = useRef(null);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Chuyên mục bệnh", path: "Category/CategoryHome" },
    { label: "Thông tin dược", path: "/PharmaInformation/MedicineList" },
    {
      label: "Kiểm tra sức khỏe",
      children: [
        { label: "BMI", path: "/HealthCheck/BMI" },
        { label: "Lượng calo cần mỗi ngày", path: "/HealthCheck/TDEECalculator" },
        { label: " Cân nặng lý tưởng", path: "/HealthCheck/IdealWeightCalculator" },
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
        { label: "Thành tựu và giải thưởng", path: "/AboutHealthTrust/Achievement" },
        { label: "Đối tác", path: "/AboutHealthTrust/Partner" },
      ],
    },
  ];

  // Đóng menu mobile khi click ra ngoài (kể cả vùng nút ☰ Menu)
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Đóng profile dropdown khi click ra ngoài
  useEffect(() => {
    if (!profileMenuOpen) return;
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen]);

  const handleMouseEnter = (index) => {
    clearTimeout(timeoutRef.current);
    setOpen(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(null), 200);
  };

  const handleMobileToggle = (index) => {
    setMobileSubmenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <nav className="bg-white/40 backdrop-blur-md shadow-md px-4 py-2 sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - luôn ở trái */}
        <div
          className="flex items-center gap-2 min-w-[180px] cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-blue-500">HealthTrust</span>
        </div>

        {/* Menu chính - căn giữa, chiếm flex-1 */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <ul className="flex items-center gap-8">
            {navItems.map((item, index) => (
              <li
                key={index}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <span
                  className="cursor-pointer text-gray-700 hover:text-blue-600 font-medium transition-colors whitespace-nowrap"
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
        </div>

        {/* Nút đăng nhập/avatar + dropdown - luôn ở phải */}
        <div className="hidden md:flex items-center min-w-[120px] justify-end relative">
          {user ? (
            <div ref={profileRef} className="relative">
              <button
                className="rounded-full w-10 h-10 overflow-hidden border border-blue-300 flex items-center justify-center"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                title="Tài khoản"
              >
                <img
                  src={user.avatar || defaultimage}
                  alt="Avatar"
                  className="w-8 h-8 object-cover rounded-full"
                />
                <span className="ml-1 text-gray-500 text-xs">▼</span>
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow-md border z-50 text-base">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-blue-50"
                    onClick={() => {
                      navigate("/personal-tracker");
                      setProfileMenuOpen(false);
                    }}
                  >
                    Cá nhân
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-red-600"
                    onClick={() => {
                      logout();
                      setProfileMenuOpen(false);
                    }}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          )}
        </div>

        {/* Mobile button */}
        <div className="flex md:hidden">
          <button
            className="text-blue-600 font-bold"
            ref={menuBtnRef}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰ Menu
          </button>
        </div>
      </div>

      {/* Mobile menu content */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
          <div
            className="absolute top-16 left-1/2 -translate-x-1/2 w-[95%] max-w-sm bg-white shadow-lg flex flex-col items-start px-4 py-6 space-y-4 md:hidden text-base font-medium text-gray-800 rounded-lg"
            ref={menuRef}
          >
            {navItems.map((item, index) => (
              <div key={index} className="w-full">
                <div
                  className={`cursor-pointer py-2 px-2 rounded hover:bg-blue-50 hover:text-blue-600 transition flex items-center justify-between`}
                  onClick={() => {
                    if (item.children) {
                      handleMobileToggle(index);
                    } else {
                      navigate(item.path);
                      setMenuOpen(false);
                    }
                  }}
                >
                  <span>{item.label}</span>
                  {item.children && (
                    <span className="ml-2">
                      {mobileSubmenus[index] ? "▲" : "▼"}
                    </span>
                  )}
                </div>
                {/* Submenu mobile */}
                {item.children && mobileSubmenus[index] && (
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

            {user ? (
              <>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition flex items-center gap-2"
                  onClick={() => {
                    navigate("/personal-tracker");
                    setMenuOpen(false);
                  }}
                >
                  <img
                    src={user.avatar || defaultimage}
                    alt="Avatar"
                    className="w-7 h-7 rounded-full"
                  />
                  Cá nhân
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full transition mt-2"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition"
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}