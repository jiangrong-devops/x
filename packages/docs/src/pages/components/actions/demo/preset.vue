<script setup lang="ts">
import type {
  ActionsFeedbackProps,
  ActionsItemProps,
  ActionsProps,
} from "@antdv-next/x";

import { CheckOutlined, ShareAltOutlined } from "@antdv-next/icons";
import { App } from "antdv-next";
import { computed, ref } from "vue";
const { message } = App.useApp();

const curPage = ref(1);
const feedbackStatus = ref<ActionsFeedbackProps["value"]>("default");
const audioStatus = ref<ActionsItemProps["status"]>("default");
const shareStatus = ref<ActionsItemProps["status"]>("default");

function toggleStatus(type: "share" | "audio") {
  const statusRef = type === "share" ? shareStatus : audioStatus;

  if (statusRef.value === "default") {
    statusRef.value = "loading";
    setTimeout(() => {
      statusRef.value = "running";
    }, 1500);
    return;
  }

  if (statusRef.value === "running") {
    statusRef.value = "loading";
    setTimeout(() => {
      statusRef.value = "default";
    }, 1500);
  }
}

const items = computed<ActionsProps["items"]>(() => [
  {
    key: "pagination",
  },
  {
    key: "feedback",
  },
  {
    key: "copy",
    label: "Copy",
  },
  {
    key: "audio",
    label: "Audio",
  },
  {
    key: "share",
    label: "Share",
  },
]);

const handleFeedbackChange = (val: ActionsFeedbackProps["value"]) => {
  feedbackStatus.value = val;
  message.success(`Updated antdv next x feedback to: ${val}`);
};
</script>

<template>
  <ax-actions :items="items">
    <template #actionRender="{ item }">
      <a-pagination
        v-if="item.key === 'pagination'"
        simple
        :current="curPage"
        :total="5"
        :page-size="1"
        @change="page => (curPage = page)"
      />

      <ax-actions-feedback
        v-else-if="item.key === 'feedback'"
        :value="feedbackStatus"
        :styles="{
          liked: {
            color: '#f759ab',
          },
        }"
        @change="handleFeedbackChange"
      />

      <ax-actions-copy v-else-if="item.key === 'copy'" text="antdv next x" />

      <ax-actions-audio
        v-else-if="item.key === 'audio'"
        :status="audioStatus"
        @click="toggleStatus('audio')"
      />

      <ax-actions-item
        v-else-if="item.key === 'share'"
        :label="shareStatus"
        :status="shareStatus"
        @click="toggleStatus('share')"
      >
        <template #defaultIcon>
          <ShareAltOutlined />
        </template>

        <template #runningIcon>
          <CheckOutlined />
        </template>
      </ax-actions-item>
    </template>
  </ax-actions>
</template>

<docs lang="zh-CN">
对于一些常用的功能，可以使用预设的组件来实现快速的搭建。
</docs>

<docs lang="en-US">
For some commonly used functions, preset components can be used to quickly build them.
</docs>
