import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_API_BASE_URL || "http://localhost:5000";

  return {
    plugins: [react()],
    server: {
      host: true, // Allow access from any IP on the network
      port: 5173,
      proxy: {
        "/contractor": {
          target,
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes("text/html")) return "/index.html";
          }
        },
        "/customer": {
          target,
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes("text/html")) return "/index.html";
          }
        },
        "/admin": {
          target,
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes("text/html")) return "/index.html";
          }
        },
        "/proposals": {
          target,
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes("text/html")) return "/index.html";
          }
        },
        "/chat": {
          target,
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes("text/html")) return "/index.html";
          }
        },
        "/notifications": {
          target,
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes("text/html")) return "/index.html";
          }
        },
        "/ai": {
          target,
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes("text/html")) return "/index.html";
          }
        },
        "/uploads": { target, changeOrigin: true },
        "/contractor_images": { target, changeOrigin: true },
        "/customer_images": { target, changeOrigin: true },
        "/house_images": { target, changeOrigin: true },
        "/contractor_verification_images": { target, changeOrigin: true },
        "/contractor_cnic_images": { target, changeOrigin: true },
        "/contractor_verification": { target, changeOrigin: true },
        "/contractor_certifications": { target, changeOrigin: true }
      }
    }
  };
})
