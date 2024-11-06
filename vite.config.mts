import { resolve } from "path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  cacheDir: ".yarn/.vite",
  build: {
    target: "es2020",
    lib: {
      entry: resolve("src/index.ts"),
      formats: ["es", "cjs"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom", "@tanstack/react-query"],
    },
    sourcemap: command === "serve",
  },
  plugins: [
    react(),
    checker({
      typescript: {
        tsconfigPath:
          command === "serve" ? "./tsconfig.dev.json" : "./tsconfig.json",
      },
      eslint: {
        lintCommand: `eslint ./src`,
        useFlatConfig: true,
      },
    }),
    command === "build" && dts({ rollupTypes: true }),
  ],
}));
