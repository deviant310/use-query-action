import { resolve } from "path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import dts from "vite-plugin-dts";

const { DEV_SERVER_HOST, DEV_SERVER_PORT } = process.env;

const { host, port } = {
  host: DEV_SERVER_HOST,
  get port() {
    if (DEV_SERVER_PORT) return parseInt(DEV_SERVER_PORT);
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  server: {
    host,
    port,
  },
  preview: {
    port,
  },
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
          command === "serve" ? "./tsconfig.json" : "./tsconfig.build.json",
      },
      eslint: {
        lintCommand: `eslint ./src`,
        useFlatConfig: true,
      },
    }),
    command === "build" && dts({ rollupTypes: true }),
  ],
}));
