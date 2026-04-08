<script setup lang="ts">
import {
  CheckCircleOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from "@antdv-next/icons";
import { ref } from "vue";

const checked = ref(true);
</script>

<template>
  <a-flex vertical gap="middle">
    <a-flex align="center" gap="small">
      Slot content:
      <ax-sender-switch
        :value="checked"
        :on-change="(next: boolean) => (checked = next)"
      >
        <template #icon>
          <a-badge dot :offset="[-2, 10]">
            <SearchOutlined />
          </a-badge>
        </template>
        <template #checkedChildren>
          <a-flex align="center" gap="small">
            <CheckCircleOutlined />
            <span>Deep Search On</span>
            <a-tag color="green">Active</a-tag>
          </a-flex>
        </template>
        <template #unCheckedChildren>
          <a-flex align="center" gap="small">
            <ThunderboltOutlined />
            <span>Deep Search Off</span>
            <a-typography-text type="secondary">Manual</a-typography-text>
          </a-flex>
        </template>
      </ax-sender-switch>
    </a-flex>

    <a-flex align="center" gap="small">
      Mixed with default slot:
      <ax-sender-switch>
        <template #icon>
          <SearchOutlined />
        </template>
        <template #unCheckedChildren>Search</template>
        <a-typography-text type="secondary">Beta</a-typography-text>
      </ax-sender-switch>
    </a-flex>
  </a-flex>
</template>

<docs lang="zh-CN">
通过 `Sender.Switch` 的 `#icon`、`#checkedChildren`、`#unCheckedChildren` 插槽自定义图标和开关两种状态下的内容。
</docs>

<docs lang="en-US">
Customize icon and state-specific content with the `Sender.Switch` `#icon`, `#checkedChildren`, and `#unCheckedChildren` slots.
</docs>
