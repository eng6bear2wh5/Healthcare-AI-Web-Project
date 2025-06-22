// src/contexts/AuthContext.jsx

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
      if (event.data?.type === 'LOGOUT') {
        setUser(null);
        localStorage.removeItem('token');
      }
    };

    authChannel.addEventListener('message', handleMessage);

    return () => {
      authChannel.removeEventListener('message', handleMessage);
    };
  }, []); 


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