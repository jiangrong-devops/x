<script setup lang="ts">
import { DownloadOutlined, EyeOutlined } from "@antdv-next/icons";
import { h } from "vue";

const imagePreviewMask = h(
  "div",
  { style: { display: "flex", gap: "8px", color: "#fff" } },
  [h("span", "预览"), h("span", "下载")],
);
</script>

<template>
  <a-flex gap="middle" wrap="wrap">
    <ax-file-card
      name="antdv-next-x-manual.pdf"
      :byte="1024000"
      description="产品手册（PDF）"
    >
      <template #mask>
        <a-space size="small">
          <EyeOutlined />
          <DownloadOutlined />
        </a-space>
      </template>
    </ax-file-card>

    <ax-file-card
      name="image.jpg"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      type="image"
      :image-props="{
        preview: {
          mask: imagePreviewMask,
        },
      }"
    />

    <ax-file-card
      name="video.mp4"
      src="https://www.w3schools.com/html/mov_bbb.mp4"
      type="video"
    >
      <template #mask="{ info }">
        <div>
          <div>播放视频</div>
          <div style="font-size: 12px; opacity: 0.8">{{ info.name }}</div>
        </div>
      </template>
    </ax-file-card>
  </a-flex>
</template>

<docs lang="zh-CN">
自定义遮罩。
</docs>

<docs lang="en-US">
Custom mask.
</docs>
