<script setup lang="ts">
import type { FileCardProps } from "@antdv-next/x";

import { DownloadOutlined } from "@antdv-next/icons";

const listItems: FileCardProps[] = [
  { name: "report.pdf", byte: 1024 * 1024 },
  { name: "spec.docx", byte: 512 * 1024 },
];
</script>

<template>
  <a-flex vertical gap="middle">
    <ax-file-card
      name="project-plan.pdf"
      :byte="1024 * 1024"
      mask="default mask"
    >
      <template #iconRender="{ info }">
        <a-tag color="processing">{{ info.nameSuffix }}</a-tag>
      </template>

      <template #description="{ info, originNode }">
        <a-flex align="center" justify="space-between">
          <a-typography-text type="secondary">{{
            originNode
          }}</a-typography-text>
          <a-button type="text" size="small">
            <template #icon>
              <DownloadOutlined />
            </template>
            下载
          </a-button>
        </a-flex>
      </template>

      <template #mask="{ info }">
        <span>预览 {{ info.name }}</span>
      </template>
    </ax-file-card>

    <ax-file-card-list :items="listItems">
      <template #iconRender="{ item, index }">
        <a-tag :color="index === 0 ? 'red' : 'blue'">{{ item.name }}</a-tag>
      </template>

      <template #description="{ item, info }">
        <span>{{ item.name }} · {{ info.size }}</span>
      </template>

      <template #extension="{ items }">
        <a-typography-text type="secondary">
          共 {{ items.length }} 个文件
        </a-typography-text>
      </template>
    </ax-file-card-list>
  </a-flex>
</template>

<docs lang="zh-CN">
通过插槽自定义 FileCard 与 FileCardList 的图标、描述、遮罩和扩展区域。
</docs>

<docs lang="en-US">
Customize FileCard and FileCardList with slots for icon, description, mask, and extension areas.
</docs>
