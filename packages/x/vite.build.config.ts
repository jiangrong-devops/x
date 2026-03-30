import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { globSync } from "tinyglobby";
import dts from "unplugin-dts/vite";
import { tsxResolveTypes } from "vite-plugin-tsx-resolve-types";
import vueResolveTypes from "vite-plugin-vue-resolve-types";
import { defineConfig } from "vite-plus";

import { LIB_EXTERNALS, TEST_FILE_PATTERNS } from "./build.constants";

const files = globSync([
  "./components/**/*.ts",
  "./components/**/*.tsx",
  "./components/**/*.vue",
  ...TEST_FILE_PATTERNS,
]).map(file => `./${file}`);

export default defineConfig({
  base: "./",
  // has worker format es
  // worker: {
  //   format: 'es',
  // },
  plugins: [
    vueResolveTypes(),
    vue(),
    tsxResolveTypes({
      defaultPropsToUndefined: ["Boolean"],
    }),
    vueJsx(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      entryRoot: "components",
      processor: "vue",
      exclude: ["**/__tests__/**", "**/*.test.*"],
    }),
  ],
  build: {
    minify: false,
    sourcemap: false,
    rolldownOptions: {
      external: LIB_EXTERNALS,

      output: {
        preserveModules: true,
        preserveModulesRoot: "components",
        format: "esm",
        entryFileNames: "[name].js",
        dir: "dist",
      },
    },
    lib: {
      entry: files,
      formats: ["es"],
    },
  },
});
