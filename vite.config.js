import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { sitemapPlugin } from "./src/plugins/sitemapPlugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sitemapPlugin()],
  resolve: {
    alias: {
      "~features": path.resolve(__dirname, "./src/features"),
    },
  },
});
