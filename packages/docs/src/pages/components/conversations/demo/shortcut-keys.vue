<script setup lang="ts">
import type { ConversationsProps } from "@antdv-next/x";

import {
  CodeOutlined,
  CodeSandboxOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  SignatureOutlined,
} from "@antdv-next/icons";
import { theme } from "antdv-next";
import { computed, ref } from "vue";

const { token } = theme.useToken();

const style = computed(() => ({
  width: "256px",
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

const agentItems: ConversationsProps["items"] = [
  {
    key: "write",
    label: "Help Me Write",
  },
  {
    key: "coding",
    label: "AI Coding",
  },
  {
    key: "createImage",
    label: "Create Image",
  },
  {
    key: "deepSearch",
    label: "Deep Search",
  },
  {
    key: "inDepthResearch",
    label: "In-depth research",
    group: "More Features",
  },
  {
    key: "vincentFigure",
    label: "Vincent Figure",
    group: "More Features",
  },
  {
    type: "divider",
  },
];

const historicalItems = ref<ConversationsProps["items"]>([
  {
    key: "item1",
    label: "Conversation Item 1",
    group: "Today",
  },
]);

const items = computed(() => [...agentItems, ...(historicalItems.value ?? [])]);

function newChatClick() {
  const list = historicalItems.value ?? [];
  historicalItems.value = [
    ...list,
    {
      key: `item${list.length + 1}`,
      label: `Conversation Item ${list.length + 1}`,
      group: "Today",
    },
  ];
}
</script>

<template>
  <div style="margin-bottom: 16px">
    You can switch sessions using the shortcut key:
    <a-tag>Alt/⌥</a-tag>
    +
    <a-tag>number</a-tag>
    , and create new chat using the shortcut key:
    <a-tag>Win/⌘</a-tag>
    +
    <a-tag>K</a-tag>
    .
  </div>

  <ax-conversations
    :creation="{ onClick: newChatClick }"
    :style="style"
    default-active-key="write"
    :on-active-change="
      value => {
        console.log(value);
      }
    "
    :shortcut-keys="{
      creation: ['Meta', 75],
      items: ['Alt', 'number'],
    }"
    :groupable="{
      collapsible: group => group !== 'Today',
    }"
    :items="items"
  >
    <template #iconRender="{ item }">
      <SignatureOutlined v-if="item.key === 'write'" />
      <CodeOutlined v-else-if="item.key === 'coding'" />
      <FileImageOutlined v-else-if="item.key === 'createImage'" />
      <FileSearchOutlined v-else-if="item.key === 'deepSearch'" />
    </template>

    <template #groupLabelRender="{ group, originNode }">
      <span
        v-if="group !== 'Today'"
        style="display: inline-flex; align-items: center; gap: 8px"
      >
        <CodeSandboxOutlined />
        {{ originNode }}
      </span>
      <template v-else>{{ originNode }}</template>
    </template>
  </ax-conversations>
</template>

<docs lang="zh-CN">
通过 `shortcutKeys` 为切换会话或新建会话设置快捷键。
</docs>

<docs lang="en-US">
Set shortcut keys for switching sessions or creating new sessions through `shortcutKeys`.
</docs>
