export const baseConfig = {
  "App.vue": "",
  "antdv-next-x.js": `import Antdv from "antdv-next";
import AntdvX from "@antdv-next/x";
import { getCurrentInstance } from "vue";

let installed = false;
await loadStyle();

export function setupAntdvNextX() {
  if (installed) return;
  const instance = getCurrentInstance();
  instance.appContext.app.use(Antd);
  instance.appContext.app.use(AntdvX);
  installed = true;
}

export function loadStyle() {
  const styles = [
    "https://cdn.jsdelivr.net/npm/antdv-next@latest/dist/reset.css",
    "https://cdn.jsdelivr.net/npm/antdv-next@latest/dist/antd.css",
    "https://cdn.jsdelivr.net/npm/@antdv-next/x@latest/dist/index.css",
  ].map(style => {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = style;
      link.addEventListener("load", resolve);
      link.addEventListener("error", reject);
      document.body.append(link);
    });
  });
  return Promise.allSettled(styles);
}
`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ESNext",
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["antdv-next/global.d.ts"],
    "allowImportingTsExtensions": true,
    "allowJs": true,
    "checkJs": true
  },
  "vueCompilerOptions": {
    "target": 3.3
  }
}
`,
  "PlaygroundMain.vue": `<script setup>
import { theme } from "antdv-next";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { setupAntdvNextX } from "./antdv-next-x.js";
import App from "./App.vue";
setupAntdvNextX();

const { darkAlgorithm, defaultAlgorithm } = theme;
const isDark = ref(document.documentElement.classList.contains("dark"));

const themeConfig = computed(() => ({
  algorithm: isDark.value ? darkAlgorithm : defaultAlgorithm,
}));

let observer;
onMounted(() => {
  observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains("dark");
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});
onUnmounted(() => observer?.disconnect());
</script>

<template>
  <a-config-provider :theme="themeConfig">
    <App />
  </a-config-provider>
</template>
`,
  "import-map.json": `{
  "imports": {
     "vue": "https://cdn.jsdelivr.net/npm/@vue/runtime-dom@latest/dist/runtime-dom.esm-browser.js",
    "@vue/shared": "https://cdn.jsdelivr.net/npm/@vue/shared@latest/dist/shared.esm-bundler.js",
    "@antdv-next/x": "https://cdn.jsdelivr.net/npm/@antdv-next/x@latest/dist-browser/index.es.js",
    "@antdv-next/x/": "https://cdn.jsdelivr.net/npm/@antdv-next/x/@latest/",
    "@antdv-next/x-markdown": "https://cdn.jsdelivr.net/npm/@antdv-next/x-markdown@latest/dist/index.js",
    "@antdv-next/x-markdown/themes/": "https://cdn.jsdelivr.net/npm/@antdv-next/x-markdown@latest/themes/",
    "@antdv-next/x-markdown/": "https://cdn.jsdelivr.net/npm/@antdv-next/x-markdown@latest/",
    "marked": "https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js",
    "dompurify": "https://cdn.jsdelivr.net/npm/dompurify@3.3.3/dist/purify.es.mjs",
    "antdv-next": "https://cdn.jsdelivr.net/npm/antdv-next@latest/dist/antd.esm.js",
    "antdv-next/": "https://cdn.jsdelivr.net/npm/antdv-next/@latest/",
    "@antdv-next/icons": "https://cdn.jsdelivr.net/npm/@antdv-next/icons@latest/dist/antd-icons.esm.js"
  },
  "scopes": {}
}`,
  _o: {},
};

function toBase64(str: string) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export function loadPlaygroundUrl(code: string) {
  const defaultCode = `<script setup lang="ts">
import { version as vueVersion } from "vue";

const message = "Hello Antdv Next X";
</script>

<template>
  <a-welcome :title="message" :description="\`Vue \${vueVersion}\`" />
</template>
`;

  baseConfig["App.vue"] = code || defaultCode;
  return `https://x-play.antdv-next.com/#${toBase64(JSON.stringify(baseConfig))}`;
}
