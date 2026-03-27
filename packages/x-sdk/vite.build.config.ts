import { resolve } from "node:path";
import dts from "unplugin-dts/vite";
import { defineConfig } from "vite-plus";

const entries = {
  index: resolve(__dirname, "src/index.ts"),
  "chat-providers/index": resolve(__dirname, "src/chat-providers/index.ts"),
  "chat-providers/types/model": resolve(
    __dirname,
    "src/chat-providers/types/model.ts",
  ),
  "x-chat/index": resolve(__dirname, "src/x-chat/index.ts"),
  "x-conversations/index": resolve(__dirname, "src/x-conversations/index.ts"),
  "x-request/index": resolve(__dirname, "src/x-request/index.ts"),
  "x-stream/index": resolve(__dirname, "src/x-stream/index.ts"),
};

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.build.json",
      entryRoot: "src",
      include: ["src/**/*.ts"],
      outDirs: "dist",
    }),
  ],
  build: {
    minify: false,
    sourcemap: false,
    emptyOutDir: true,
    lib: {
      entry: entries,
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rolldownOptions: {
      external: ["vue"],
    },
  },
});
