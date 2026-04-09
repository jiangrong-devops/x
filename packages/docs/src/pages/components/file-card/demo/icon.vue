<script setup lang="ts">
import { AndroidOutlined } from "@antdv-next/icons";
</script>

<template>
  <a-flex vertical gap="middle">
    <ax-file-card
      icon="pdf"
      name="antdv-next-x-guide.pdf"
      :byte="1024 * 1024"
    />

    <ax-file-card name="antdv-next-x-android.apk" :byte="1024 * 1024">
      <template #iconRender>
        <AndroidOutlined style="font-size: 36px; color: #22b35e" />
      </template>
    </ax-file-card>
  </a-flex>
</template>

<docs lang="zh-CN">
可使用内置图标或自定义。
</docs>

<docs lang="en-US">
you can use built-in icons or custom.
</docs>
