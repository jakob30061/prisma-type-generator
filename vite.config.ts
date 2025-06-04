import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    ssr: path.resolve(__dirname, "src/index.ts"),
    outDir: "dist",
    target: "node22",
    minify: true
  },
});
