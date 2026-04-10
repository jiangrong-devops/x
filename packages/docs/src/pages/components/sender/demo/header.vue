<script setup lang="ts">
import { CloudUploadOutlined, PaperClipOutlined } from "@antdv-next/icons";
import { App } from "antdv-next";
import { ref } from "vue";
const { message } = App.useApp();

const open = ref(false);

function handleSubmit() {
  message.success("Send message successfully!");
}
</script>

<template>
  <a-flex :style="{ height: '350px' }" align="end">
    <ax-sender placeholder="← Click to open" :on-submit="handleSubmit">
      <template #header>
        <ax-sender-header
          title="Upload Sample"
          :open="open"
          :on-open-change="(val: boolean) => (open = val)"
        >
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
    </ax-sender>
  </a-flex>
</template>

<docs lang="zh-CN">
使用 `header` 自定义文件上传示例。
</docs>

<docs lang="en-US">
Use `header` to customize the file upload example.
</docs>
