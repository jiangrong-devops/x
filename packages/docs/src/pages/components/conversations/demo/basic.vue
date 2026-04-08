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
const deepSearchChecked = ref(false);

const style = computed(() => ({
  width: "256px",
  background: token.value.colorBgContainer,
  borderRadius: `${token.value.borderRadius}px`,
}));

const items = computed<ConversationsProps["items"]>(() => [
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
    disabled: !deepSearchChecked.value,
    label: "Deep Search",
  },
]);
</script>

<template>
  <ax-conversations :items="items" default-active-key="write" :style="style">
    <template #iconRender="{ item }">
      <SignatureOutlined v-if="item.key === 'write'" />
      <CodeOutlined v-else-if="item.key === 'coding'" />
      <FileImageOutlined v-else-if="item.key === 'createImage'" />
      <FileSearchOutlined v-else-if="item.key === 'deepSearch'" />
    </template>

    <template #labelRender="{ item, originNode }">
      <a-flex v-if="item.key === 'deepSearch'" gap="small" align="center">
        <span>{{ originNode }}</span>
        <a-switch
          size="small"
          :checked="deepSearchChecked"
          @click.stop
          @change="deepSearchChecked = $event"
        />
      </a-flex>
      <template v-else>{{ originNode }}</template>
    </template>
  </ax-conversations>
</template>

<docs lang="zh-CN">
基础用法。
</docs>

<docs lang="en-US">
Basic usage.
</docs>
