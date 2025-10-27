import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";

const galleryRoutes = [
  "/info",
  "/contact",
  "/pictures/monthly",
  "/pictures/mammals",
  "/pictures/landscapes",
  "/pictures/nature",
  "/pictures/birds",
];

const dynamicRoutes = galleryRoutes.map((route) => route);

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: "https://www.akphotography.fi",
      readable: true,
      dynamicRoutes,
      changefreq: "weekly",
      generateRobotsTxt: false,
      exclude: [
        "/admin",
        "/admin/uploadPictures",
        "/admin/editContent",
        "/admin/ownProfile",
      ],
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
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
