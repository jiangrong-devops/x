<script setup lang="ts">
import type { ActionsProps } from "@antdv-next/x";

import { RedoOutlined } from "@antdv-next/icons";
import { App } from "antdv-next";
import { ref } from "vue";
const { message } = App.useApp();

const curPage = ref(1);

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
    <ax-actions :items="items" :on-click="onClick" variant="outlined">
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
    <ax-actions :items="items" :on-click="onClick" variant="filled">
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
    <ax-actions :items="items" :on-click="onClick" variant="borderless">
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
使用 `variant` 切换变体。
</docs>

<docs lang="en-US">
Use `variant` to switch variants.
</docs>
