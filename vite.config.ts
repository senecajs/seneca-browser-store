import dts from "vite-plugin-dts"
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  base: "./",
  plugins: [dts({ rollupTypes: true })],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/browser-store.ts"),
      name: "BrowserStore",
      formats: ["es", "cjs", "umd", "iife"],
      fileName: (format) => `browser-store.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {
        },
      },
    },
  },
})

