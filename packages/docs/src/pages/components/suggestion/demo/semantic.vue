<script setup lang="ts">
import type { SuggestionItem } from "@antdv-next/x";

import { BulbOutlined } from "@antdv-next/icons";
import { computed } from "vue";

import { SemanticPreview } from "@/components/semantic";
import { useLocale } from "@/composables/use-locale";

const locales = {
  "zh-CN": {
    root: "根节点",
    content: "标题容器",
    popup: "弹层容器",
  },
  "en-US": {
    root: "Root",
    content: "Content",
    popup: "Popup",
  },
} as const;

const { locale } = useLocale();

const t = computed(() =>
  locale.value === "zh-CN" ? locales["zh-CN"] : locales["en-US"],
);

const semantics = computed(() => [
  { name: "root", desc: t.value.root },
  { name: "content", desc: t.value.content },
  { name: "popup", desc: t.value.popup },
]);

const items: SuggestionItem[] = [
  { label: "Write a report", value: "report" },
  { label: "Draw a picture", value: "draw" },
  {
    label: "Explore a topic",
    value: "knowledge",
    children: [
      {
        label: "About Vue",
        value: "vue",
      },
      {
        label: "About Antdv Next X",
        value: "Antdv Next X",
      },
    ],
  },
];

const getPopupContainer = (triggerNode: HTMLElement) =>
  triggerNode.parentElement ?? triggerNode;
</script>

<template>
  <SemanticPreview
    component-name="Suggestion"
    :semantics="semantics"
    :height="300"
  >
    <template #default="{ classes }">
      <ax-suggestion
        open
        :items="items"
        :classes="classes"
        :get-popup-container="getPopupContainer"
      >
        <template #default="{ onKeyDown }">
          <ax-sender placeholder="输入 / 获取建议" :on-key-down="onKeyDown" />
        </template>
        <template #iconRender="{ item }">
          <BulbOutlined v-if="item.value === 'knowledge'" />
        </template>
      </ax-suggestion>
    </template>
  </SemanticPreview>
</template>

<docs lang="zh-CN">
Suggestion 的语义化 DOM 结构预览。
</docs>

<docs lang="en-US">
Semantic DOM preview for Suggestion.
</docs>
