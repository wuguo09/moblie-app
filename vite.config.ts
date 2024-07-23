import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [uni()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: true,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://192.168.32.200:8082/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
