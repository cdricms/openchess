import { defineConfig, splitVendorChunkPlugin } from "vite";

export default defineConfig({
  base: "./",
  plugins: [splitVendorChunkPlugin()]
});
