<script setup lang="ts">
import { XMarkdown } from "@antdv-next/x-markdown";
import { Segmented, theme } from "antdv-next";
import { computed, ref, watch } from "vue";
import "@antdv-next/x-markdown/themes/index.css";
import "@antdv-next/x-markdown/themes/light.css";
import "@antdv-next/x-markdown/themes/dark.css";

const { token, theme: currentTheme } = theme.useToken();
const isDark = computed(() => currentTheme.value.id === 1);
const mode = ref<"light" | "dark">(isDark.value ? "dark" : "light");

watch(isDark, value => {
  mode.value = value ? "dark" : "light";
});

const markdownClass = computed(() =>
  mode.value === "light" ? "x-markdown-light" : "x-markdown-dark",
);

const containerStyle = computed(() => ({
  background: mode.value === "light" ? token.value.colorWhite : "#141414",
  borderColor:
    mode.value === "light" ? token.value.colorBorderSecondary : "#303030",
}));

const content = `
# Theme Demo

Used to show **theme switching** and \`CSS variable\` customization.

- Keep typography and color consistent
- Keep spacing and borders consistent
- Keep link and quote styles consistent

> Override variables to customize appearance quickly.

See [x-markdown theme docs](/markdown/themes).

| Token | Usage |
| --- | --- |
| --primary-color | Link/primary color |
| --text-color | Body text |
`;
</script>

<template>
  <div>
    <Segmented
      v-model:value="mode"
      :options="[
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ]"
      style="margin-bottom: 12px"
    />

    <div :style="containerStyle" class="border border-solid p-4 rounded-md">
      <XMarkdown :content="content" :class-name="markdownClass" />
    </div>
  </div>
</template>

<docs lang="zh-CN">
主题切换示例，展示分段切换交互与主题容器样式。
</docs>

<docs lang="en-US">
Theme switch demo showing segmented controls and themed container styling.
</docs>
