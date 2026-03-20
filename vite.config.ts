import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Local defaults so the app can run outside Replit.
const rawPort = process.env.PORT ?? "5173";
const port = Number(rawPort);

const safePort = Number.isNaN(port) || port <= 0 ? 5173 : port;

let basePath = process.env.BASE_PATH ?? "/";
// Vite expects base to start with a slash (except empty string).
if (basePath !== "/" && !basePath.startsWith("/")) basePath = `/${basePath}`;

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: safePort,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port: safePort,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
