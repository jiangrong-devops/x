<script setup lang="ts">
import {
  PaperClipOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@antdv-next/icons";
import { message } from "antdv-next";
import { ref } from "vue";

const value = ref("");
const headerOpen = ref(true);

function handleSubmit() {
  message.success(`发送内容: ${value.value || "空消息"}`);
  value.value = "";
}
</script>

<template>
  <ax-sender
    :value="value"
    placeholder="试试用 slot 自定义布局"
    :on-change="(nextValue: string) => (value = nextValue)"
    :on-submit="handleSubmit"
  >
    <template #header>
      <ax-sender-header
        title="会话配置"
        :open="headerOpen"
        :on-open-change="(open: boolean) => (headerOpen = open)"
      >
        <a-flex gap="small" wrap="wrap">
          <a-tag color="blue">gpt-4.1</a-tag>
          <a-tag color="green">联网搜索</a-tag>
          <a-tag color="gold">低温度</a-tag>
        </a-flex>
      </ax-sender-header>
    </template>

    <template #prefix>
      <a-button type="text">
        <template #icon>
          <PaperClipOutlined />
        </template>
      </a-button>
    </template>

    <template #suffix="{ components }">
      <a-flex align="center" gap="small">
        <a-typography-text type="secondary">
          <small>Enter 发送</small>
        </a-typography-text>
        <a-button type="text">
          <template #icon>
            <SettingOutlined />
          </template>
        </a-button>
        <component :is="components.SpeechButton" />
        <component :is="components.ClearButton" />
        <component
          :is="components.SendButton"
          type="primary"
          :disabled="!value"
        />
      </a-flex>
    </template>

    <template #footer>
      <a-flex justify="space-between" align="center">
        <a-typography-text type="secondary">
          通过 `#header / #prefix / #suffix / #footer` 定制布局
        </a-typography-text>
        <a-button type="link">
          <template #icon>
            <SearchOutlined />
          </template>
          更多工具
        </a-button>
      </a-flex>
    </template>
  </ax-sender>
</template>

<docs lang="zh-CN">
通过 `#header`、`#prefix`、`#suffix`、`#footer` 命名插槽自定义 Sender 的各个区域；`#suffix` 插槽还能拿到默认操作节点和内置按钮组件。
</docs>

<docs lang="en-US">
Customize each Sender area with `#header`, `#prefix`, `#suffix`, and `#footer` slots. The `#suffix` slot also receives the default action node and built-in action components.
</docs>
