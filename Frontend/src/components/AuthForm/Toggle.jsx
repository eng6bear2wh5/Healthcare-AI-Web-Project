import React from "react";
import { Link, useLocation } from "react-router-dom";

const Toggle = () => {
  {/* Toggle */}
  const location = useLocation();
  const currentPath = location.pathname;

  const isLogin = currentPath === "/login";
  const isSignup = currentPath === "/signup";
  
  const styles = {
    highlightBase: "absolute top-1 transition-all duration-300 ease-in-out h-9 w-[calc(50%-0.5rem)] bg-white rounded-md shadow-sm",
    leftHighlight: "left-1",
    rightHighlight: "right-1",
    linkBase: "flex-1 z-10 transition-colors duration-300 rounded-md text-sm flex items-center justify-center",
    activeText: "text-[#0180CC] font-medium",
    inactiveText: "text-gray-500",
  };

  return (
    <div className="relative w-full h-11 bg-[#F5F8FA] rounded-lg p-1 mb-5">
      <div 
        className={`${styles.highlightBase} ${
          isLogin ? styles.leftHighlight : styles.rightHighlight
        }`}
      >
      </div>

      <div className="relative flex h-full">
        <Link
          to="/login"
          className={`${styles.linkBase} ${
            isLogin ? styles.activeText : styles.inactiveText
          }`}
        >
          Đăng nhập
        </Link>

        <Link
          to="/signup"
          className={`${styles.linkBase} ${
            isSignup ? styles.activeText : styles.inactiveText
          }`}
        >
          Đăng ký
        </Link>
      </div>
    </div>
  );
};

export default Toggle;
