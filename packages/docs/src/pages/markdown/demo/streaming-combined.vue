<script setup lang="ts">
import type { Component } from "vue";

import { SettingOutlined } from "@antdv-next/icons";
import { XMarkdown } from "@antdv-next/x-markdown";
import { Skeleton } from "antdv-next";
import { computed, defineComponent, h, onBeforeUnmount, ref, watch } from "vue";

import { useDarkMode } from "@/composables/use-dark-mode";

const { isDark } = useDarkMode();

const text = `# Antdv Next X

Antdv Next X 是一款 AI 应用复合工具集，融合了 Vue UI 组件库、流式 Markdown 渲染引擎和 AI SDK，为开发者提供构建下一代 AI 驱动应用的完整工具链。

![Antdv Next X](https://x.antdv-next.com/x.svg)


基于 Antdv Next 设计体系，专为 AI 驱动界面设计，提供开箱即用的智能对话组件与 API 集成能力，帮助你快速搭建智能应用界面。查看详情请点击 [Antdv Next X](https://github.com/antdv-next/x)。
`;

const enableAnimation = ref(true);
const enableCache = ref(true);
const tailEnabled = ref(false);
const tailContent = ref("▋");
const isStreaming = ref(false);
const index = ref(0);

const markdownClass = computed(() =>
  isDark.value ? "x-markdown-dark" : "x-markdown-light",
);

let timerRef: ReturnType<typeof setTimeout> | null = null;

const clearTimer = () => {
  if (timerRef !== null) {
    clearTimeout(timerRef);
    timerRef = null;
  }
};

watch(
  index,
  () => {
    clearTimer();

    if (index.value >= text.length) {
      isStreaming.value = false;
      return;
    }

    isStreaming.value = true;
    timerRef = setTimeout(() => {
      index.value = Math.min(index.value + 1, text.length);
    }, 50);
  },
  { immediate: true },
);

onBeforeUnmount(clearTimer);

const LoadingLink = defineComponent({
  name: "LoadingLink",
  setup() {
    return () =>
      h(Skeleton.Button, {
        active: true,
        size: "small",
        style: {
          margin: "4px 0",
          width: "16px",
          height: "16px",
        },
      });
  },
});

const LoadingImage = defineComponent({
  name: "LoadingImage",
  setup() {
    return () =>
      h(Skeleton.Image, {
        active: true,
        style: {
          width: "60px",
          height: "60px",
        },
      });
  },
});

const loadingComponents: Record<string, Component> = {
  "loading-link": LoadingLink,
  "loading-image": LoadingImage,
};

const runStream = () => {
  clearTimer();
  index.value = 0;
  isStreaming.value = true;
};
</script>

<template>
  <div
    style="
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
      height: 360px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    "
  >
    <a-flex
      vertical
      gap="middle"
      style="flex: 1; min-height: 0; overflow: hidden"
    >
      <a-flex gap="small" justify="end" style="flex-shrink: 0">
        <a-popover trigger="click" placement="bottomRight">
          <template #content>
            <a-flex vertical :gap="10">
              <a-flex
                align="center"
                justify="space-between"
                :gap="16"
                style="min-width: 180px"
              >
                <a-typography-text
                  style="font-size: 12px; margin: 0; white-space: nowrap"
                >
                  Animation
                </a-typography-text>
                <a-switch size="small" v-model:checked="enableAnimation" />
              </a-flex>
              <a-flex
                align="center"
                justify="space-between"
                :gap="16"
                style="min-width: 180px"
              >
                <a-typography-text
                  style="font-size: 12px; margin: 0; white-space: nowrap"
                >
                  Syntax Cache
                </a-typography-text>
                <a-switch size="small" v-model:checked="enableCache" />
              </a-flex>
              <a-flex
                align="center"
                justify="space-between"
                :gap="16"
                style="min-width: 180px"
              >
                <a-typography-text
                  style="font-size: 12px; margin: 0; white-space: nowrap"
                >
                  Tail
                </a-typography-text>
                <a-switch size="small" v-model:checked="tailEnabled" />
              </a-flex>
              <a-flex
                align="center"
                justify="space-between"
                :gap="16"
                style="min-width: 180px"
              >
                <a-typography-text
                  style="font-size: 12px; margin: 0; white-space: nowrap"
                >
                  Tail Content
                </a-typography-text>
                <a-input
                  size="small"
                  style="width: 80px"
                  v-model:value="tailContent"
                  :disabled="!tailEnabled"
                />
              </a-flex>
            </a-flex>
          </template>
          <a-button type="default" size="small">
            <template #icon>
              <SettingOutlined />
            </template>
            Config
          </a-button>
        </a-popover>
        <a-button
          type="primary"
          size="small"
          style="align-self: flex-end"
          @click="runStream"
        >
          Run Stream
        </a-button>
      </a-flex>

      <a-flex style="flex: 1; min-height: 0; overflow: auto">
        <ax-bubble :content="text.slice(0, index)">
          <template #contentRender="{ content }">
            <XMarkdown
              :class-name="markdownClass"
              :content="content"
              paragraph-tag="div"
              :streaming="{
                hasNextChunk: isStreaming && enableCache,
                enableAnimation,
                tail: tailEnabled ? { content: tailContent || '▋' } : false,
                incompleteMarkdownComponentMap: {
                  link: 'loading-link',
                  image: 'loading-image',
                },
              }"
              :components="loadingComponents"
            />
          </template>
        </ax-bubble>
      </a-flex>
    </a-flex>
  </div>
</template>

<docs lang="zh-CN">
流式渲染综合示例，演示动画、语法缓存、尾部指示器和不完整语法占位。
</docs>

<docs lang="en-US">
Combined streaming demo with animation, syntax cache, tail indicator, and incomplete syntax placeholders.
</docs>
