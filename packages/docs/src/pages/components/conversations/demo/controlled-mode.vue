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

const activeKey = ref<string | number>("write");
const { token } = theme.useToken();

const style = computed(() => ({
  width: "256px",
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

const items: ConversationsProps["items"] = [
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
];
</script>

<template>
  <a-flex vertical gap="small" align="flex-start">
    <ax-conversations
      v-model:active-key="activeKey"
      :shortcut-keys="{ items: ['Alt', 'number'] }"
      :items="items"
      :style="style"
    >
      <template #iconRender="{ item }">
        <SignatureOutlined v-if="item.key === 'write'" />
        <CodeOutlined v-else-if="item.key === 'coding'" />
        <FileImageOutlined v-else-if="item.key === 'createImage'" />
        <FileSearchOutlined v-else-if="item.key === 'deepSearch'" />
      </template>
    </ax-conversations>

    <a-flex gap="small">
      <a-button @click="activeKey = 'write'"> Active First </a-button>
      <a-button @click="activeKey = 'deepSearch'"> Active Last </a-button>
    </a-flex>
  </a-flex>
</template>

<docs lang="zh-CN">
使用 `activeKey`、`onChange` 属性，控制当前选中的会话。
</docs>

<docs lang="en-US">
Use the `activeKey` and `onChange` property to configure conversation.
</docs>
