import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          // Tách Dashboard page nếu file lớn
          if (id.includes("src/pages/Dashboard")) {
            return "dashboard";
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:5000",
      "/auth": "http://localhost:5000",
      "/health": "http://localhost:5000",
    },
  },
});
