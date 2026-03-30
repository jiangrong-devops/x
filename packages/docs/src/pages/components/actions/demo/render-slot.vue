<script setup lang="ts">
import type { ActionsItemProps, ActionsProps } from "@antdv-next/x";

import {
  CheckOutlined,
  CopyOutlined,
  LoadingOutlined,
  RedoOutlined,
  ShareAltOutlined,
} from "@antdv-next/icons";
import { Actions, ActionsCopy, ActionsItem } from "@antdv-next/x";
import { Divider, Flex, Tag, Typography } from "antdv-next";
import { ref } from "vue";

const shareStatus = ref<ActionsItemProps["status"]>("default");

const iconItems: ActionsProps["items"] = [
  {
    key: "retry",
    label: "Retry",
    icon: "retry",
  },
  {
    key: "copy",
    label: "Copy",
    icon: "copy",
  },
];

const actionItems: ActionsProps["items"] = [
  {
    key: "share",
    label: "Share",
  },
  {
    key: "custom",
    label: "Custom",
  },
];

const toggleShare = () => {
  shareStatus.value = shareStatus.value === "running" ? "default" : "running";
};
</script>

<template>
  <Flex vertical gap="middle">
    <div>
      <Typography.Text type="secondary">`iconRender`</Typography.Text>
    </div>

    <Actions :items="iconItems">
      <template #iconRender="{ item, index }">
        <Tag color="processing">#{{ index + 1 }} {{ item.key }}</Tag>
      </template>
    </Actions>

    <Divider style="margin: 0" />

    <div>
      <Typography.Text type="secondary">`actionRender`</Typography.Text>
    </div>

    <Actions :items="actionItems">
      <template #actionRender="{ item }">
        <ActionsItem
          v-if="item.key === 'share'"
          :status="shareStatus"
          label="Share"
          default-icon="share"
          running-icon="running"
          @click="toggleShare"
        >
          <template #defaultIcon>
            <ShareAltOutlined />
          </template>

          <template #runningIcon>
            <CheckOutlined />
          </template>
        </ActionsItem>
      </template>
    </Actions>

    <Divider style="margin: 0" />

    <div>
      <Typography.Text type="secondary">
        `ActionsCopy.iconRender` / `ActionsItem` slots
      </Typography.Text>
    </div>

    <Flex gap="middle">
      <ActionsCopy text="copy value">
        <template #iconRender="{ status }">
          <span
            :style="{
              display: 'inline-flex',
              color: status === 'copied' ? '#52c41a' : '#1677ff',
            }"
          >
            <CheckOutlined v-if="status === 'copied'" />
            <CopyOutlined v-else />
          </span>
        </template>
      </ActionsCopy>

      <ActionsItem
        :status="shareStatus"
        label="Independent Item"
        default-icon="default"
        running-icon="running"
        @click="toggleShare"
      >
        <template #defaultIcon>
          <RedoOutlined />
        </template>

        <template #runningIcon>
          <LoadingOutlined />
        </template>
      </ActionsItem>
    </Flex>
  </Flex>
</template>

<docs lang="zh-CN">
通过插槽自定义 Actions、ActionsCopy 与 ActionsItem 的图标和操作渲染。`ActionsCopy.iconRender` 会额外提供 `status`，可区分默认态与复制成功态。
</docs>

<docs lang="en-US">
Customize icon and action rendering for Actions, ActionsCopy, and ActionsItem with slots. `ActionsCopy.iconRender` also receives `status` so you can render different icons for the default and copied states.
</docs>
