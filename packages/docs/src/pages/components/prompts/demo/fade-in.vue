<script setup lang="ts">
import type { PromptsClickInfo, PromptsProps } from "@antdv-next/x";

import {
  BulbOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  SmileOutlined,
  WarningOutlined,
} from "@antdv-next/icons";
import { App } from "antdv-next";
import { ref } from "vue";
const { message } = App.useApp();

const renderKey = ref(0);
const fadeInLeft = ref(true);

const items: PromptsProps["items"] = [
  {
    key: "1",
    label: "Ignite Your Creativity",
    description: "Got any sparks for a new project?",
  },
  {
    key: "2",
    label: "Uncover Background Info",
    description: "Help me understand the background of this topic.",
  },
  {
    key: "3",
    label: "Efficiency Boost Battle",
    description: "How can I work faster and better?",
  },
  {
    key: "4",
    label: "Tell me a Joke",
    description: "Why do not ants get sick? Because they have tiny ant-bodies!",
  },
  {
    key: "5",
    label: "Common Issue Solutions",
    description: "How to solve common issues? Share some tips!",
  },
];

function onItemClick(info: PromptsClickInfo) {
  message.success(`You clicked a prompt: ${info.data.label}`);
}
</script>

<template>
  <a-flex gap="middle" vertical>
    <a-flex gap="middle" align="center">
      <a-switch
        v-model:checked="fadeInLeft"
        checked-children="fadeInLeft"
        un-checked-children="fadeIn"
      />
      <a-button @click="renderKey++">Re-Render</a-button>
    </a-flex>
    <ax-prompts
      :key="renderKey"
      :fade-in="!fadeInLeft"
      :fade-in-left="fadeInLeft"
      title="✨ Inspirational Sparks and Marvelous Tips"
      :items="items"
      @item-click="onItemClick"
    >
      <template #iconRender="{ item }">
        <BulbOutlined v-if="item.key === '1'" style="color: #ffd700" />
        <InfoCircleOutlined
          v-else-if="item.key === '2'"
          style="color: #1890ff"
        />
        <RocketOutlined v-else-if="item.key === '3'" style="color: #722ed1" />
        <SmileOutlined v-else-if="item.key === '4'" style="color: #52c41a" />
        <WarningOutlined v-else-if="item.key === '5'" style="color: #ff4d4f" />
      </template>
    </ax-prompts>
  </a-flex>
</template>

<docs lang="zh-CN">
通过 `fadeIn` 或 `fadeInLeft` 属性为提示列表添加渐入动画效果。
</docs>

<docs lang="en-US">
Use `fadeIn` or `fadeInLeft` to add entrance animation to the prompt list.
</docs>
