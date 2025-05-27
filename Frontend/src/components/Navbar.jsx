import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const [open, setOpen] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const timeoutRef = useRef(null);
    const navigate = useNavigate();

    const navItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Chuyên mục", path: "Category/CategoryHome" },
        { label: "Video", children: [{ label: "Hướng dẫn", path: "/video/huong-dan" }, { label: "Sức khỏe", path: "/video/suc-khoe" }] },
        { label: "Về Health Trust", children: [{ label: "Tầm nhìn và sứ mệnh", path: "/AboutHealthTrust/Mission" }, { label: "Thành tựu và giải thưởng", path: "/AboutHealthTrust/Achievement" }, { label: "Đối tác", path: "/AboutHealthTrust/Partner" }] },
        { label: "Kiểm tra sức khỏe", children: [{ label: "BMI", path: "/HealthCheck/BMI" }, { label: "Lượng calo cần mỗi ngày", path: "/HealthCheck/TDEECalculator" }, {label: " Cân nặng lý tưởng", path: "/HealthCheck/IdealWeightCalculator"}, {label: "Tỉ lệ mỡ cơ thể", path: "/HealthCheck/BodyFatCalculator"}] },
        { label: "Cộng đồng", children: [{ label: "Tin tức", path: "Community/News" }, { label: "Sự kiện", path: "Community/Event" }] },
        { label: "Thông tin dược", children: [{ label: "Thuốc an toàn", path: "/PharmaInformation/SafeMedicine" }] },
    ];

    const handleMouseEnter = (index) => {
        clearTimeout(timeoutRef.current);
        setOpen(index);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(null), 200);
    };

    return (
        <nav className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
            {/* Logo */}
            <div className="text-xl font-bold text-blue-500">Health Trust</div>

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
                                className="cursor-pointer hover:text-blue-600"
                                onClick={() => {
                                    if (!item.children) navigate(item.path);
                                }}
                            >
                                {item.label}
                            </span>

                            {item.children && open === index && (
                                <div className="absolute top-full left-0 mt-2 bg-white  rounded shadow w-48 z-50">
                                    {item.children.map((child, i) => (
                                        <div
                                            key={i}
                                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
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
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="border p-2 rounded w-60"
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
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
                <div className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col items-start p-4 space-y-4 md:hidden z-50">
                    {navItems.map((item, index) => (
                        <div key={index} className="w-full">
                            <div
                                className="cursor-pointer py-2 hover:text-blue-600 font-semibold"
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
                                <div className="pl-4 space-y-1">
                                    {item.children.map((child, i) => (
                                        <div
                                            key={i}
                                            className="py-1 cursor-pointer hover:text-blue-400"
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

                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="border p-2 rounded w-full"
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
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
