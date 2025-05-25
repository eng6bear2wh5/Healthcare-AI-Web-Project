import React, { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  ClockIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

function PersonalLayout({ children }) {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarWidth = collapsed ? 100 :220;

  const menuItems = [
    { name: "Dashboard", href: "#", icon: HomeIcon },
    { name: "Profile", href: "#", icon: UserIcon },
    { name: "Settings", href: "#", icon: Cog6ToothIcon },
    { name: "History", href: "#", icon: ClockIcon },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Gọi ngay 1 lần khi load
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        style={{ width: sidebarWidth }}
        className={`fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 dark:bg-gray-900 bg-gray-100 p-4
        ${sidebarOpen ? "flex" : "hidden"} flex-col md:flex overflow-y-auto`}
      >
        <div
          className={`flex ${
            collapsed ? "justify-center" : "justify-between"
          } items-center mb-6 mt-4`}
        >
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

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;

            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setActiveItem(item.name)}
                className={`group flex ${
                  collapsed ? "justify-center" : "items-center gap-3"
                } px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
          ${
            isActive
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 font-semibold"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "text-blue-600 dark:text-blue-300" : ""
                  }`}
                />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </a>
            );
          })}
        </nav>
      </aside>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-md shadow text-gray-700 dark:text-gray-300"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      )}

      {/* Content dịch sang phải dựa vào sidebar */}
      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-[220px]"
        } ml-0`}
      >
        <div className="p-4">
          <div className="bg-white min-h-screen rounded-xl shadow-sm">
            {/* Nội dung */}
            <div className="p-2 sm:p-4 md:p-6">
              {/* Breadcumb */}

              <nav aria-label="breadcrumb" className="mb-4 mt-4">
                <ol className="flex list-none p-0">
                  <li className="text-gray-600">
                    <span className="block text-gray-700 mb-1">HealthCare</span>
                  </li>
                  <li className="text-gray-600">
                  <span className="mx-2 text-gray-400">{'>'}</span>
                    <span className="text-blue-500">{activeItem}</span>
                  </li>
                </ol>
              </nav>

              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PersonalLayout;
