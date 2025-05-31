//src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CategoryProvider } from "./contexts/CategoryContext";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
// Khởi tạo client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, cacheTime: 1000 * 60 * 10 },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Ở đây bọc toàn bộ App bằng context provider */}
    {/* Thứ tự wrapper: QueryClientProvider trước, rồi CategoryProvider */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CategoryProvider>
          <App />
        </CategoryProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
