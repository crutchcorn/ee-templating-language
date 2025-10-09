import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "unplugin-dts/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [dts({
    tsconfigPath: "tsconfig.app.json",
    entryRoot: "src",
  })],
  build: {
    lib: {
      name: "Doodl",
      fileName: 'index',
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^node:/],
    },
  },
});
