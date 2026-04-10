<script setup lang="ts">
import type { ActionsProps } from "@antdv-next/x";

import { RedoOutlined } from "@antdv-next/icons";
import { App } from "antdv-next";
import { ref } from "vue";
const { message } = App.useApp();

const curPage = ref(1);
const renderKey = ref(0);
const fadeInLeft = ref(true);

const items: ActionsProps["items"] = [
  {
    key: "pagination",
  },
  {
    key: "retry",
    label: "Retry",
  },
  {
    key: "copy",
    label: "Copy",
  },
];

const onClick: ActionsProps["onClick"] = ({ keyPath }) => {
  message.success(`you clicked ${keyPath.join(",")}`);
};
</script>

<template>
  <a-space direction="vertical" style="display: flex; width: 100%" :size="12">
    <a-space wrap>
      <a-switch
        v-model:checked="fadeInLeft"
        checked-children="fadeInLeft"
        un-checked-children="fadeIn"
      />
      <a-button @click="renderKey += 1"> Re-Render </a-button>
    </a-space>

    <ax-actions
      :key="renderKey"
      :fade-in="!fadeInLeft"
      :fade-in-left="fadeInLeft"
      :items="items"
      :on-click="onClick"
      variant="borderless"
    >
      <template #iconRender="{ item }">
        <RedoOutlined v-if="item.key === 'retry'" />
      </template>

      <template #actionRender="{ item }">
        <a-pagination
          v-if="item.key === 'pagination'"
          simple
          :current="curPage"
          :total="5"
          :page-size="1"
          @change="page => (curPage = page)"
        />
        <a-actions-copy v-else-if="item.key === 'copy'" text="antdv next x" />
      </template>
    </ax-actions>
  </a-space>
</template>

<docs lang="zh-CN">
渐进效果。
</docs>

<docs lang="en-US">
FadeIn.
</docs>
