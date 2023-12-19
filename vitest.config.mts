import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    exclude: ["**/cjs/**"],
    include: ["./tests/**/*.test.{ts,tsx}"]
  }
});
