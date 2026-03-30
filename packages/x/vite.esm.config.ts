import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { tsxResolveTypes } from "vite-plugin-tsx-resolve-types";
import vueResolveTypes from "vite-plugin-vue-resolve-types";
import { defineConfig } from "vite-plus";

import { LIB_EXTERNALS } from "./build.constants";

export default defineConfig({
  base: "./",
  plugins: [
    vueResolveTypes(),
    vue(),
    tsxResolveTypes({
      defaultPropsToUndefined: ["Boolean"],
    }),
    vueJsx(),
  ],
  build: {
    minify: false,
    sourcemap: false,
    rolldownOptions: {
      external: LIB_EXTERNALS,
    },
    emptyOutDir: false,
    lib: {
      entry: "components/index.ts",
      formats: ["es"],
      fileName: () => "index.esm.js",
    },
  },
});
