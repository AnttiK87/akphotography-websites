import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";

const categories = ["mammals", "landscapes", "nature", "birds"];
const galleryRoutes = categories.flatMap((c) => [`/pictures/${c}`]);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: "https://www.akphotography.fi",
      routes: ["/", "/info", "/contact", ...galleryRoutes],
      // valinnainen:
      outDir: "dist", // minne sitemap kirjoitetaan
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
