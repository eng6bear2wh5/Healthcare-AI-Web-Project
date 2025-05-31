import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  UserIcon,
  Squares2X2Icon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

function PersonalLayout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const menuItems = [
    { name: "Home", to: "/", icon: HomeIcon },
    { name: "Dashboard", to: "/personal-tracker/dashboard", icon: Squares2X2Icon },
    { name: "Profile", to: "/personal-tracker/edit-profile", icon: UserIcon },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 md:flex-row">
      {/* Sidebar for desktop */}
      {!isMobile && (
        <aside
          style={{ width: collapsed ? 80 : 220 }}
          className="bg-gray-100 dark:bg-gray-900 p-4 transition-all duration-300 hidden md:flex flex-col"
        >
          <div className={`flex ${collapsed ? "justify-center" : "justify-between"} items-center mb-6 mt-4`}>
            {!collapsed && (
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                HealthCare
              </h1>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
            >
              {collapsed ? (
                <ChevronRightIcon className="w-5 h-5" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <hr className="border-gray-200 dark:border-gray-700 mb-6" />
          <nav className="space-y-2">
            {menuItems.map(({ name, to, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={name}
                  to={to}
                  className={`group flex ${
                    collapsed ? "justify-center" : "items-center gap-3"
                  } px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && <span className="truncate">{name}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>
      )}

      <main className={`flex-1"}`}>
        <div className="p-4 pb-20 md:pb-4">
          <div className="bg-white min-h-screen rounded-xl shadow-sm">
            <div className="p-2 sm:p-4 md:p-6">
              {/* Breadcrumb đã được xoá */}
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom nav for mobile */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-2">
          {menuItems.map(({ name, to, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={name}
                to={to}
                className={`flex flex-col items-center justify-center text-xs ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Mobile menu toggle (optional, hidden in this version) */}
      {/* Nếu muốn có nút mở sidebar trong mobile, có thể bổ sung thêm */}
    </div>
  );
}

export default PersonalLayout;
