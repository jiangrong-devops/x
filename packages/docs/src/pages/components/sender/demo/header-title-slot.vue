<script setup lang="ts">
import {
  CloudUploadOutlined,
  PaperClipOutlined,
  PlusOutlined,
} from "@antdv-next/icons";
import { message } from "antdv-next";
import { ref } from "vue";

const open = ref(true);

function handleSubmit() {
  message.success("Send message successfully!");
}
</script>

<template>
  <a-flex :style="{ height: '350px' }" align="end">
    <ax-sender placeholder="试试 Header title slot" :on-submit="handleSubmit">
      <template #header>
        <ax-sender-header
          :open="open"
          :on-open-change="(next: boolean) => (open = next)"
        >
          <template #title>
            <a-flex align="center" justify="space-between" style="width: 100%">
              <a-flex align="center" gap="small">
                <CloudUploadOutlined />
                <span>Upload Sample</span>
                <a-tag color="blue">3 files</a-tag>
              </a-flex>
              <a-typography-text type="secondary">2MB left</a-typography-text>
            </a-flex>
          </template>

          <a-flex
            vertical
            align="center"
            gap="small"
            :style="{ marginBlock: '24px' }"
          >
            <CloudUploadOutlined :style="{ fontSize: '4em' }" />
            <a-typography-title :level="5" :style="{ margin: 0 }">
              Drag file here (just demo)
            </a-typography-title>
            <a-typography-text type="secondary">
              Support pdf, doc, xlsx, ppt, txt, image file types
            </a-typography-text>
            <a-button @click="message.info('Mock select file')">
              Select File
            </a-button>
          </a-flex>
        </ax-sender-header>
      </template>

      <template #prefix>
        <a-button
          type="text"
          :style="{ fontSize: '16px' }"
          @click="open = !open"
        >
          <template #icon>
            <PaperClipOutlined />
          </template>
        </a-button>
      </template>

      <template #suffix="{ components }">
        <a-flex align="center" gap="small">
          <a-button type="text">
            <template #icon>
              <PlusOutlined />
            </template>
          </a-button>
          <component :is="components.SendButton" type="primary" />
        </a-flex>
      </template>
    </ax-sender>
  </a-flex>
</template>

<docs lang="zh-CN">
通过 `Sender.Header` 的 `#title` 插槽自定义头部标题区，可以放入图标、状态和额外信息。
</docs>

<docs lang="en-US">
Customize the header title area with the `Sender.Header` `#title` slot for icons, status, and extra metadata.
</docs>
