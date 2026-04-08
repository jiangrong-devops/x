<script setup lang="ts">
import type { ConversationsProps } from "@antdv-next/x";

import { MessageOutlined } from "@antdv-next/icons";
import { theme } from "antdv-next";
import { computed, h } from "vue";

const { token } = theme.useToken();

const style = computed(() => ({
  width: "280px",
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

const items: ConversationsProps["items"] = Array.from({ length: 4 }).map(
  (_, index) => ({
    key: `item-${index + 1}`,
    label: `Conversation ${index + 1}`,
    icon: h(MessageOutlined),
  }),
);

const labelRender: ConversationsProps["labelRender"] = (item, info) =>
  h("span", { class: "prop-label" }, `prop-${info.index + 1}-${item.key}`);

const iconRender: ConversationsProps["iconRender"] = (_item, info) =>
  h("span", { class: "prop-icon" }, `${info.index + 1}`);
</script>

<template>
  <ax-conversations
    default-active-key="item-1"
    :items="items"
    :style="style"
    :label-render="labelRender"
    :icon-render="iconRender"
  >
    <template #labelRender="{ item, active, originNode }">
      <span :class="['slot-label', { 'slot-label-active': active }]">
        {{ item.key }} ·
      </span>
      <span>{{ originNode }}</span>
    </template>
    <template #iconRender="{ index }">
      <span class="slot-icon">{{ index + 1 }}</span>
    </template>
  </ax-conversations>
</template>

<style scoped>
.prop-label,
.prop-icon {
  color: #999;
}

.slot-label {
  margin-inline-end: 4px;
}

.slot-label-active {
  font-weight: 600;
}

.slot-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background: #1677ff;
  color: #fff;
  font-size: 12px;
}
</style>

<docs lang="zh-CN">
`labelRender` 与 `iconRender` 同时支持属性回调和同名插槽，插槽优先级更高。
</docs>

<docs lang="en-US">
`labelRender` and `iconRender` support both prop callbacks and same-name slots, with slots taking precedence.
</docs>
