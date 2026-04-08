<script setup lang="ts">
import type { ConversationsProps } from "@antdv-next/x";

import {
  CodeOutlined,
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
  <ax-conversations
    :creation="{ onClick: newChatClick }"
    :items="items"
    default-active-key="write"
    :style="style"
    groupable
  >
    <template #iconRender="{ item }">
      <SignatureOutlined v-if="item.key === 'write'" />
      <CodeOutlined v-else-if="item.key === 'coding'" />
      <FileImageOutlined v-else-if="item.key === 'createImage'" />
      <FileSearchOutlined v-else-if="item.key === 'deepSearch'" />
    </template>
  </ax-conversations>
</template>

<docs lang="zh-CN">
新对话。
</docs>

<docs lang="en-US">
New chat.
</docs>
