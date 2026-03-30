import { globSync } from "tinyglobby";
import dts from "unplugin-dts/vite";
import { defineConfig } from "vite-plus";

const files = globSync(["./src/**/*.ts"])
  .sort()
  .map(file => `./${file}`);

const entries = Object.fromEntries(
  files.map(file => [file.replace("./src/", "").replace(/\.ts$/, ""), file]),
);

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
    rolldownOptions: {
      external: ["vue"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        format: "esm",
        entryFileNames: "[name].js",
        dir: "dist",
      },
    },
    lib: {
      entry: entries,
      formats: ["es"],
    },
  },
});
