import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
      },
    },
  },
});

// proxy → Any request starting with /api will be forwarded to your backend at http://localhost:5000.
// Node.js backend (Express server) is running on port 5000.
// React frontend (Vite dev server) is running on port 3000.
