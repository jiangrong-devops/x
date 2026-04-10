<script setup lang="ts">
import type { PromptsClickInfo, PromptsProps } from "@antdv-next/x";

import {
  CommentOutlined,
  FireOutlined,
  HeartOutlined,
  ReadOutlined,
  RocketOutlined,
  SmileOutlined,
} from "@antdv-next/icons";
import { App } from "antdv-next";
const { message } = App.useApp();

const items: PromptsProps["items"] = [
  {
    key: "1",
    label: "Hot Topics",
    description: "What are you interested in?",
    children: [
      { key: "1-1", description: "What's new in X?" },
      { key: "1-2", description: "What's AGI?" },
      { key: "1-3", description: "Where is the doc?" },
    ],
  },
  {
    key: "2",
    label: "Design Guide",
    description: "How to design a good product?",
    children: [
      { key: "2-1", description: "Know the well" },
      { key: "2-2", description: "Set the AI role" },
      {
        key: "2-3",
        description: "Express the feeling",
      },
    ],
  },
  {
    key: "3",
    label: "Start Creating",
    description: "How to start a new project?",
    children: [
      { key: "3-1", label: "Fast Start", description: "Install Ant Design X" },
      {
        key: "3-2",
        label: "Online Playground",
        description: "Play on the web without installing",
      },
    ],
  },
];

function onItemClick(info: PromptsClickInfo) {
  message.success(`You clicked: ${info.data.key}`);
}
</script>

<template>
  <a-card :style="{ borderRadius: 0, border: 0 }">
    <ax-prompts
      title="Do you want?"
      :items="items"
      wrap
      :styles="{
        item: {
          flex: 'none',
          width: 'calc(30% - 6px)',
          backgroundImage: 'linear-gradient(137deg, #e5f4ff 0%, #efe7ff 100%)',
          border: '0',
        },
        subItem: {
          background: 'rgba(255,255,255,0.45)',
          border: '1px solid #FFF',
        },
      }"
      @item-click="onItemClick"
    >
      <template #labelRender="{ item, originNode, nested }">
        <span v-if="!nested && item.key === '1'">
          <FireOutlined style="color: #ff4d4f; margin-right: 8px" />
          {{ originNode }}
        </span>
        <span v-else-if="!nested && item.key === '2'">
          <ReadOutlined style="color: #1890ff; margin-right: 8px" />
          {{ originNode }}
        </span>
        <span v-else-if="!nested && item.key === '3'">
          <RocketOutlined style="color: #722ed1; margin-right: 8px" />
          {{ originNode }}
        </span>
        <template v-else>{{ originNode }}</template>
      </template>

      <template #iconRender="{ item }">
        <HeartOutlined v-if="item.key === '2-1'" />
        <SmileOutlined v-else-if="item.key === '2-2'" />
        <CommentOutlined v-else-if="item.key === '2-3'" />
      </template>
    </ax-prompts>
  </a-card>
</template>

<docs lang="zh-CN">
嵌套组合，通过 `children` 字段为提示项添加子提示列表。
</docs>

<docs lang="en-US">
Nest usage. Use the `children` field to add sub-prompt lists to a prompt item.
</docs>
