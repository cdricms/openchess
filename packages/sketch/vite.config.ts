import typescript from "rollup-plugin-typescript2";
import { defineConfig, splitVendorChunkPlugin } from "vite";

export default defineConfig({
  base: "./",
  plugins: [splitVendorChunkPlugin(), { ...typescript(), apply: "build" }]
});
