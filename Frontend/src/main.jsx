import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CategoryProvider } from "./contexts/CategoryContext";
import { ToastProvider } from "./components/ToastContext";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom"; 
// Khởi tạo client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, cacheTime: 1000 * 60 * 10 },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CategoryProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </CategoryProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
