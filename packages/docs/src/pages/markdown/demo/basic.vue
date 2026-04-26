<script setup lang="ts">
import { XMarkdown } from "@antdv-next/x-markdown";
import { theme } from "antdv-next";
import { computed } from "vue";

const { theme: currentTheme } = theme.useToken();
const isDark = computed(() => currentTheme.value.id === 1);

const markdownClass = computed(() =>
  isDark.value ? "x-markdown-dark" : "x-markdown-light",
);

const content = `# Hello XMarkdown

> Streaming-friendly, extensible Markdown renderer for LLM output.

## Features

- **Streaming** - syntax recovery and progressive rendering
- **Extensible** - map any node to your Vue components (\`components\`)
- **Plugins** - Latex, code highlighting, Mermaid, etc.

Inline code: \`vp add @antdv-next/x-markdown\`. See [docs](/markdown) for more.
`;
</script>

<template>
  <XMarkdown :content="content" :class-name="markdownClass" />
</template>

<docs lang="zh-CN">
基础渲染示例，展示 Markdown 渲染能力与常见特性。
</docs>

<docs lang="en-US">
Basic rendering demo showcasing core Markdown capabilities and common features.
</docs>
