import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/lib/**/*.ts", "src/components/**/*.tsx"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/app/**"],
      thresholds: {
        "src/lib/**": {
          statements: 90,
          branches: 80,
          functions: 90,
          lines: 90,
        },
        "src/components/**": {
          statements: 60,
          branches: 50,
          functions: 60,
          lines: 60,
        },
      },
    },
  },
});
