// import { createContext, useContext, useState } from 'react';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null); // user là thông tin người dùng

//   const logout = async () => {
//     try {
//       // await fetch('/auth/logout', {
//       await fetch("/auth/logout", { 
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     } catch (e) {
//       console.error('Logout error: ', e);
//     }
//     setUser(null);
//     localStorage.removeItem('token');
//     // navigate(`/`);
//   }

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);

// }

// src/contexts/AuthContext.jsx

// Thêm useEffect và useCallback từ 'react'
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// --- Tạo BroadcastChannel ---
// Kênh này sẽ giúp các tab giao tiếp với nhau.
// Nó được đặt bên ngoài component để chỉ tạo một lần duy nhất.
const authChannel = new BroadcastChannel('auth-channel');

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // --- Lắng nghe sự kiện logout từ các tab khác ---
  useEffect(() => {
    const handleMessage = (event) => {
      // Nếu nhận được tin nhắn 'LOGOUT' từ một tab khác
      if (event.data?.type === 'LOGOUT') {
        // Cập nhật trạng thái của tab này thành đã đăng xuất
        setUser(null);
        localStorage.removeItem('token'); // Đồng bộ cả localStorage
      }
    };

    // Bắt đầu lắng nghe trên kênh
    authChannel.addEventListener('message', handleMessage);

    // Dọn dẹp listener khi component không còn được sử dụng
    return () => {
      authChannel.removeEventListener('message', handleMessage);
    };
  }, []); // useEffect này chỉ chạy 1 lần


  // Sử dụng useCallback để tối ưu hóa hàm logout
  const logout = useCallback(async () => {
    try {
      await fetch("/auth/logout", { 
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      console.error('Logout error: ', e);
    } finally {
      // Các hành động này sẽ luôn được thực hiện dù API có lỗi hay không
      setUser(null);
      localStorage.removeItem('token');
      
      // --- Gửi thông điệp logout đến các tab khác ---
      // Sau khi đã đăng xuất ở tab này, phát tín hiệu cho các tab khác biết
      authChannel.postMessage({ type: 'LOGOUT' });
    }
  }, []); // useCallback không có dependency

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}