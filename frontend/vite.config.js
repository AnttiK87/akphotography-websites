import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";

const categories = ["mammals", "landscapes", "nature", "birds"];
const galleryRoutes = categories.flatMap((category) => [
  `/pictures/${category}`,
]);

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: "https://www.akphotography.fi",
      routes: ["/", "/info", "/contact", ...galleryRoutes],
      outDir: "dist",
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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@mui")) return "mui";
            if (id.includes("fontawesome")) return "fontawesome";
            if (id.includes("react-slick") || id.includes("slick-carousel"))
              return "slick";
            if (id.includes("react-photo-album")) return "photoalbum";
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("redux") || id.includes("@reduxjs")) return "redux";
            if (id.includes("react")) return "react";
            return "vendor";
          }
        },
      },
    },
  },
});
