import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3005,
    host: "0.0.0.0",
  },
  plugins: [react()],
  css: {
    postcss: './postcss.config.js'
  }
});